// pages/user/register.js
const app = getApp();
const G = app.data;
const $ = app.data.utils;
const U = app.data.ajaxUrl;
let that;
Page({
  data: {
    userInfo:{}//用户信息 
  },
  onLoad: function (options) {
    that = this;
    var userInfo = G.userInfo;
  },

  //提交用户信息
  submitRegister:(e)=>{
    var param = {
      realname: e.detail.value.realname.trim(),
      phone: e.detail.value.phone.trim(),
      openid:G.userInfo.openid,
      appid:G.appid
    }
    if (!that.validate(param)){
      return;
    }
    
    $.promiseAjax("user/WxUser","POST",param)
    .then((res)=>{
      if (res.success){
        $.totas("注册用户成功");
        wx.navigateBack({
          delta:1
        })
      }else{
        $.totas(res.msg)
      }
    })
    .catch((res)=>{

    })

  },

  //验证参数
  validate:(param)=>{
    if (!param.realname || !param.phone){
      $.toast("请把信息填写完整");
      return false;
    } else if (!$.testPhone(param.phone)){
      $.toast("手机号码格式不对");
      return false;
    }
    return true;
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },





})