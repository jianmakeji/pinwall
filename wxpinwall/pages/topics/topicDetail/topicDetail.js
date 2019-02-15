// pages/topics/topicDetail.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      //请求参数
      limit:10,
      offset: 0,
      topicId: "",
      // 数据数组
      dataList:""
   },
   tapTheArtifact(event){
      console.log(event);
      wx.navigateTo({
         url: '/pages/topics/artifactDetail/artifactDetail',
      })
   },
   artifactTap(event){
      console.log(event);
      wx.navigateTo({
         url: '/pages/topics/artifactDetail/artifactDetail',
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      let that = this;
      this.setData({
         topicId:options.topicId
      })
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getTopicAndArtifactById,
         data:{
            limit: this.data.limit,
            offset: this.data.offset,
            topicId: this.data.topicId,
         },
         method:"GET",
         success(res){
            console.log(res);
            if(res.data.status == 200){
               that.setData({
                  dataList:res.data.data
               })
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
      wx.showTabBar({
         animation:true
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