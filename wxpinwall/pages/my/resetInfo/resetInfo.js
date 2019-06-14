// pages/my/resetInfo/resetInfo.js
// const {
//    $Toast
// } = require('../../../dist/base/index');
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      tabIndexNum:"2",
      statusHeight:false,
      userInfo:"",

      introVisible:false,
      introFocus:false
   },
   tapBack(event){
      wx.navigateBack({
         data:1
      })
   },
   resetIntro(event){
      console.log("resetIntro")
      let that = this;
      this.setData({
         introVisible: true,
         introFocus:true
      })
   },
   introValueChange(event){
      this.setData({
         introValue: event.detail.value
      })
   },
   submitIntro(event){
      let that = this;
      wx.request({
         url: app.globalData.baseUrl + app.globalData.updateUserIntro.replace(":id", wx.getStorageSync("myId")),
         data: {
            intro: this.data.introValue
         },
         method: "PUT",
         success(res) {
            if (res.data.status == 200) {
               that.setData({
                  introVisible: false
               });
               wx.showToast({
                  title: '发布成功！',
               })
               that.onShow();
            } else {
               wx.showToast({
                  title: '发布成功！',
                  icon:"error"
               })
            }

         }
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      let that = this;
      if (app.globalData.statusBarHeight == 44) {
         that.setData({
            statusHeight: true
         })
      } else {
         that.setData({
            statusHeight: false
         })
      }
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
      let that = this;
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getUserInfoById + "?userId=" + wx.getStorageSync("myId"),
         success(res) {
            if (res.data.status == 200) {
               that.setData({
                  userInfo: res.data.data[0]
               })
            }
         }
      })
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