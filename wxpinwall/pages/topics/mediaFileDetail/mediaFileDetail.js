// pages/topics/mediaFileDetail/mediaFileDetail.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      statusHeight: false,
      videoUrl:"",
      videoVisible:false,
      mediaFileUrl: "",
      mediaFileVisible:false
   },
   tapBack(){
      wx.navigateBack({
         data:1
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      let mediaFileUrl = unescape(options.mediaFileUrl);
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
      wx.getSystemInfo({
         success: function (res) {
            if (res.system.indexOf("iOS") < 0){
               if (mediaFileUrl.indexOf("video") > 0){
                  that.setData({
                     videoUrl: mediaFileUrl,
                     mediaFileVisible:false,
                     videoVisible: true
                  })
               } else if (mediaFileUrl.indexOf("pdf") > 0 || mediaFileUrl.indexOf("h5") > 0){
                  that.setData({
                     mediaFileUrl: mediaFileUrl,
                     videoVisible: false,
                     mediaFileVisible: true
                  })
               }
               
            }else{
               if (mediaFileUrl.indexOf("video") > 0 ) {
                  that.setData({
                     videoUrl: mediaFileUrl,
                     mediaFileVisible: false,
                     videoVisible: true
                  })
               } else if (mediaFileUrl.indexOf("pdf") > 0 || mediaFileUrl.indexOf("h5") > 0) {
                  that.setData({
                     mediaFileUrl: mediaFileUrl,
                     videoVisible: false,
                     mediaFileVisible: true
                  })
               }
            }
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