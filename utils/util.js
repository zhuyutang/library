// const ajax_url = "https://www.yutangmeng.com/Law/public/index.php/";
const ajax_url = "http://z.cn/";

const upload_img_url = "https://upload-z2.qiniup.com";

//日期格式
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 请求函数封装
const ajax = (url,method,data,callback_success,callback_fail)=>{
  var ajaxUrl = ajax_url + url;
  if (url.indexOf("http")>=0){
    ajaxUrl = url;
  }
  showLoad();
  wx.request({
    url: ajaxUrl,
    method: method,
    header: {
      "Authorization": "APPCODE 984d90c9811f4f2abe372af277394358"
      },
    data:data,
    success:function(res){
      if (callback_success){
        callback_success(res.data);
      }
    },
    fail:function(res){
      if (callback_fail){
        callback_fail(res.data);
      }
     
    },
    complete:function(res){
      hideLoad();
    }
  })
}

//promise封装的ajax
const promiseAjax = (url, method, data)=>{
  return new Promise((resolve, reject)=>{
    var ajaxUrl = ajax_url + url;
    if (url.indexOf("http") >= 0) {
      ajaxUrl = url;
    }
    showLoad();
    wx.request({
      url: ajaxUrl,
      method: method,
      header: {
        "Authorization": "APPCODE 984d90c9811f4f2abe372af277394358"
      },
      data: data,
      success: function (res) {
          resolve(res.data);
      },
      fail: function (res) {
          reject(res.data);

      },
      complete: function (res) {
        hideLoad();
      }
    })
  })
}

//上传图片
const uploadImg = (img_path,token)=>{
  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: upload_img_url,
      name: 'file',
      filePath: img_path,
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        token: token,
      },
      success: function (res) {
        resolve(res.data)
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}


//对象合并
const extent = (a,b)=>{
  for(let i in b){
    a[i] = b[i]
  }
}

//验证手机号码格式
const testPhone = (phone)=>{
  if (/^1[3|4|5|8][0-9]\d{8}$/.test(phone)){
    return true;
  }else{
    return false;
  }
}

const showToast = (cont)=>{
  wx.showToast({
    title:cont,
    icon:"none"
  })
}

const showModal = (cont,callback_success)=>{
  wx.showModal({
    title:"系统提示",
    content:cont,
    success:callback_success
  })
}

const showLoad = (title)=>{
  wx.showLoading({
    title:title?title:"数据加载中",
    mask:true
  })
}

const hideLoad = (title)=>{
  wx.hideLoading({})
}

module.exports = {
  formatTime: formatTime,
  ajax:ajax,
  promiseAjax: promiseAjax,
  uploadImg: uploadImg,
  extent:extent,
  toast:showToast,
  modal:showModal,
  showLoad:showLoad,
  hideLoad:hideLoad,
  testPhone:testPhone
}
