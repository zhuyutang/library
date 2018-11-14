//admin/add.js
//后台录入
const app = getApp();
const G = app.data;
const $ = app.data.utils;
const U = app.data.ajaxUrl;
let that;
Page({
	data:{
		iconUrl:app.data.iconUrl,
		menu_cur:2,//左侧菜单1-添加，2-编辑类型,
		typeList:[],//分类列表
		isShowFormBox:false,//是否显示弹窗
		bookInfo:{},//书籍信息
    isbn:'',//书籍isbn号
    book_type:1,//书籍类型,typelist数组的下标
    temp_img: app.data.iconUrl+"add_img.png",//临时封面图片
    keyword:'',//搜索关键字
    chooseType:'',//搜索书籍时，选择的分类
    bookList: {
      ismore: true,
      data: [],
      page: 1
    },
    pageSize: 9,
	},

	onLoad:function(){
    that = this;
    that.getType();
	},

  //获取七牛token值
  qiniuToken:()=>{
    // 获取token值
    $.promiseAjax("tool/qiniuToken","GET",{})
  },

  //上传文件至七牛空间
  uploadImg:(img)=>{
    that.qiniuToken((token)=>{
      wx.uploadFile({
        url: 'https://upload-z2.qiniup.com',
        name: 'file',
        filePath: img,
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          token: token,
        },
        success: function (res) {
          let data = JSON.parse(res.data)
        },
        fail: function (res) {
          console.log(res)
        }
      })
    })

  },

	//提交书籍
	submitBook:(e)=>{
    var param = that.data.bookInfo;
    var book_type = that.data.book_type;
    $.extent(param, e.detail.value);//合并表单信息
    param.type = that.data.typeList[book_type].id;//书籍类别
    param.isbn = param.isbn ? param.isbn : '';//书籍isbn号

    var temp_img = that.data.temp_img;

    if (temp_img.indexOf("http://tmp")>=0){//如果是本地上传图片，则上传至七牛空间
      $.promiseAjax("tool/qiniuToken", "GET", {})//获取七牛token
      .then((token)=>{//上传至七牛空间
        return $.uploadImg(temp_img,token);
      })
      .then((res)=>{//存入数据库
        param.book_cover = "qiniu_"+ JSON.parse(res).key;
        that.doSumib(param);
      }).catch((res)=>{
        $.toast(res.message);
      })

    }else{
      param.book_cover = temp_img ? temp_img : '';//书籍封面
      that.doSumib(param);
    }
	},

  //提交书籍信息函数
  doSumib:(param)=>{
    $.ajax("book/bookInfo", "POST", param, function (res) {
      if (res.success) {
        wx.showToast({
          title: '加入成功',
        })
        that.clearBookInfo();
      } else {
        wx.showToast({
          title: '加入失败:' + res.msg,
        })
      }
    })
  },

  //清空编辑信息
  clearBookInfo:()=>{
    that.setData({
      bookInfo: {},//书籍信息
      isbn: '',//书籍isbn号
      book_type: 1,//书籍类型
    })
  },


	//获取书籍分类
	getType:()=>{
	    $.ajax("book/type","GET",{},(res)=>{
	      that.setData({
	        typeList: res
	      })
	    })
	},

	// 添加分类
	addType: (e)=>{
		var param = {
			name:e.detail.value.name
		}
		$.ajax("book/type","POST",param,(res)=>{
	      $.toast("添加成功！");
	      that.getType();
	      that.showFormBox();
	    })
	},

	//删除分类
	deteleType:(e)=>{
		var name = e.target.dataset.name;
		var id = e.target.dataset.id;
		$.modal("是否删除分类:"+name,(res)=>{
			if(res.confirm){	
				var param={
					id:id
				}
				$.ajax("book/type","DELETE",param,(res)=>{
			      $.toast("已成功删除！");
			      that.getType();
			    })
			}
		})
	},

  //打开扫描
  openscan:()=>{
    // that.getBookInfoByScanCode("9787544258975");
    // return;

    wx.scanCode({
      onlyFromCamera:true,
      success:(res)=>{
        that.data.bookInfo.isbn = res.data.result;
        that.getBookInfoByScanCode(res.result);
      },
      fail:(res)=>{
        wx.showToast({
          title: '无法打开微信扫描功能，请手工输入',
          icon:"none"
        })
      }
    })
  },

  //根据扫描码获取书籍信息
  getBookInfoByScanCode:(code)=>{
    var data={
      is_info:true,
      isbn:code
    }
    $.ajax("http://isbn.market.alicloudapi.com/ISBN", "GET", data,(res)=>{
      var bookInfo = that.data.bookInfo;
      var result = res.result;
      bookInfo.title = result.title;
      bookInfo.author = result.author;
      bookInfo.summary = result.summary;
      that.setData({
        bookInfo: bookInfo,
        temp_img: result.images_medium
      });

    },(res)=>{
      wx.showToast({
        title: '书籍查找失败，请手工输入',
        icon: "none"
      })
    });
  },

  //选择图片
  chooseImage:(e)=>{    
    wx.chooseImage({
      count:1,
      success: function(res) {
        var temp = res.tempFilePaths[0];
        that.setData({
          temp_img:temp
        })
      },
    })
  },
  
  //查找书籍
  findBook:(init)=>{
    if (init) {
      that.data.bookList = {
        ismore: true,
        data: [],
        page: 1
      };
    } else {
      that.data.bookList.page++;
    }

    if (!that.data.bookList.ismore) {
      return;
    }

    var param = {
      bookType: that.data.chooseType,
      keyword: that.data.keyword,
      page: that.data.bookList.page,
      size: that.data.pageSize
    }

    $.ajax("book/bookList", "GET", param, (res) => {
      if (res.success) {
        for (let i = 0; i < res.data.length; i++) {
          that.data.bookList.data.push(res.data[i]);
        }
        if (res.data.length < that.data.pageSize) {
          that.data.bookList.ismore = false;
        }
        that.setData({
          bookList: that.data.bookList
        })
      } else {
        $.toast(res.msg)
      }
    })
  },


  //选择分类
  chooseType: (e) => {
    var id = e.target.dataset.id;
    that.setData({
      chooseType: id
    });
    that.findBook(true);
  },

  //绑定搜索关键词
  bind_keyword: (e) => {
    that.setData({
      keyword: e.detail.value,
      chooseType:  ''
    })
  },


  //加载更多
  onReachBottom: (e) => {
    that.findBook(false);
  },

  // 跳转至修改书籍信息页
  updateBook: (e) => {
    var index = e.currentTarget.dataset.index;
    var bookInfo = that.data.bookList.data[index];
    that.setData({
      bookInfo:bookInfo,
      menu_cur:1
    })
  },

  //选择书籍类型
  choose_type:(e)=>{
    that.setData({
      book_type: e.detail.value
    })
  },

	// 切换菜单
	changeMenu:(e)=>{
    that.setData({
			menu_cur:e.target.dataset.type
		});
	},
	//显示表单弹窗
	showFormBox:()=>{
    that.data.isShowFormBox = !that.data.isShowFormBox;
    that.setData({
      isShowFormBox: that.data.isShowFormBox
		})
	},
	//阻止冒泡
	stopBubbl:()=>{
	},
})