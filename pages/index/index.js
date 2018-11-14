//index.js
//获取应用实例
const app = getApp();
const G = app.data;
const $ = app.data.utils;
const U = app.data.ajaxUrl;
let that;

Page({
  data: {
    iconUrl: app.data.iconUrl,
    typeList:[],
    bookList:{
      ismore:true,
      data:[],
      page:1
    },
    pageSize:9,
    chooseType:{
      id:'',
      name:"全部"
    },//分类
    keyword:'',//搜索关键词
  },
  onLoad: function () {
    that = this;
    that.getBookType();
    that.findBook(true);
  },

  //搜索书籍
  findBook:(init)=>{
    if(init){
      that.data.bookList = {
        ismore:true,
        data:[],
        page:1
      };
    }else{
      that.data.bookList.page++;
    }

    if(!that.data.bookList.ismore){
      return;
    }

    var param={
      bookType:that.data.chooseType.id,
      keyword:that.data.keyword,
      page: that.data.bookList.page,
      size: that.data.pageSize
    }

    $.ajax("book/bookList", "GET", param, (res) => {
      if(res.success){
        for(let i = 0; i<res.data.length; i++){
          that.data.bookList.data.push(res.data[i]);
        }
        if (res.data.length < that.data.pageSize){
          that.data.bookList.ismore = false;
        }
        that.setData({
          bookList: that.data.bookList
        })
      }else{
        $.toast(res.msg)
      }
    })
  },

  //获取书籍分类
  getBookType:()=>{
    $.ajax("book/type", "GET", {}, (res) => {
      that.setData({
        typeList: res
      })
    })
  },

  //选择分类
  chooseType:(e)=>{
    var data = e.target.dataset;
    that.setData({
      chooseType: data
    });
    that.findBook(true);
  },

  //绑定搜索关键词
  bind_keyword:(e)=>{
    that.setData({
      keyword:e.detail.value,
      chooseType:{
        id:'',
        name:"全部"
      }
    })
  },

  //加载更多
  onReachBottom:(e)=>{
    that.findBook(false);
  },

  //跳转到详情页 
  book_detail:(e)=>{
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../book_detail/detail?id='+id,
    })
  }
})
