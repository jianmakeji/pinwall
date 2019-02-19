// pages/topics/mediaFileDetail/mediaFileDetail.js
Page({

   /**
    * 页面的初始数据
    */
   data: {
      videoUrl:"",
      videoVisible:false,
      mediaFileUrl: "",
      mediaFileVisible:false
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      console.log(options);
      let mediaFileUrl = unescape(options.mediaFileUrl);
      let that = this;
      wx.getSystemInfo({
         success: function (res) {
            if (res.system.indexOf("iOS") < 0){
               console.log("android")
               if (mediaFileUrl.indexOf("video") > 0){
                  that.setData({
                     videoUrl: mediaFileUrl,
                     videoVisible: true
                  })
               } else if (mediaFileUrl.indexOf("pdf") > 0){
                  that.setData({
                     mediaFileUrl: mediaFileUrl,
                     mediaFileVisible: true
                  })
               }
               
            }else{
               console.log("iOS")
               if (mediaFileUrl.indexOf("video") > 0) {
                  that.setData({
                     videoUrl: mediaFileUrl,
                     videoVisible: true
                  })
               } else if (mediaFileUrl.indexOf("pdf") > 0) {
                  that.setData({
                     mediaFileUrl: mediaFileUrl,
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