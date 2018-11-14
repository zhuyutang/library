//app.js
const utils = require("utils/util.js");
let that; 
App({
  data:{
    appid: "wx5438739c177bbea7",//小程序appid
    AppSecret: "df1d8be33a0443286f2f7168e5bbe5c1",//小程序appsecret
    utils: utils,
    iconUrl:"/assets/icon/",
    imgUrl: "http://img.yutangmeng.com/",
    userInfo:{}//用户信息
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    that = this;
    
    that.getCode()// 获取用户code
    .then((res)=>{//获取openid
      var param = {
        code: res.code,
        appid: that.data.appid,
        AppSecret: that.data.AppSecret,
      }
      return utils.promiseAjax("tool/openid", "GET", param)
    })
    .then((res)=>{//获取用户信息
      var result = JSON.parse(res);
      if (result.openid){
        that.getUserinfo(result.openid);
      }else{
        utils.toast(res.msg)
      }
    })
    .catch((res)=>{
      utils.toast(res.message)
    })

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  //获取微信code
  getCode:()=>{
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res);
        }
      })
    });
  },

  //获取用户信息
  getUserinfo:(openid)=>{
    var param={
      openid:openid
    }
    utils.ajax("user/WxUser", "GET", param, (res) => {
      if(res){
        that.setData({
          userInfo:res
        })
      }else{
        that.data.userInfo.openid = openid;
      }
    })
  },

  globalData: {
    userInfo: null
  }
})