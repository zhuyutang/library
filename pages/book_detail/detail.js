// pages/book_detail/detail.js
const app = getApp();
const G = app.data;
const $ = app.data.utils;
const U = app.data.ajaxUrl;
let that;

Page({
  data: {
    book_id:"",
    bookInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      book_id:options.id
    })
    that.getBookInfo();
  },

  getBookInfo:()=>{
    var param = {
      id:that.data.book_id,
    }
    $.ajax("book/bookDetail", "GET", param, (res) => {
      if (res.success) {
        that.setData({
          bookInfo: res.data
        })
      } else {
        $.toast(res.msg)
      }
    })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})