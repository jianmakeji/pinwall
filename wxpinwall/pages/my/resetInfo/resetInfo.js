// pages/my/resetInfo/resetInfo.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      tabIndexNum:"2",
      statusHeight:false
   },
   tapBack(event){
      wx.navigateBack({
         data:1
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      console.log(options)
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
      let that = this;
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getUserInfoById + "?userId=" + wx.getStorageSync("myId"),
         success(res) {
            console.log(res)
            // if (res.data.status == 200) {
            //    wx.setStorageSync("openid", res.data.data.openId);
            //    wx.setStorageSync("myId", res.data.data.Id);
            //    wx.setStorageSync("myRole", res.data.data.roles[0].name);
            //    wx.setStorageSync("avatarUrl", res.data.data.avatarUrl);
            //    that.setData({
            //       userData: res.data.data
            //    })
            //    wx.showToast({
            //       title: '刷新成功！',
            //       type: "success"
            //    })
            // }
         }
      })
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