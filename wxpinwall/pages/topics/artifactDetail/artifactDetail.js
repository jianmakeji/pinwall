Page({

   /**
    * 页面的初始数据
    */
   data: {
      animationModal:"close",
      likeAnimationData: "",
      commentAnimationData: "",
      scoreAnimationData: ""
   },
   creatLike(){
      console.log("creatLike")
   },
   creatComment() {
      console.log("creatComment")
   },
   creatScore() {
      console.log("creatScore")
   },
   openOpt(){
      var likeAnimation = wx.createAnimation({
         duration: 200,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      var commentAnimationData = wx.createAnimation({
         duration: 200,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      var scoreAnimationData = wx.createAnimation({
         duration: 200,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      likeAnimation.translate(10, -60).step();
      commentAnimationData.translate(-50, -50).step();
      scoreAnimationData.translate(-60, 10).step();
      this.setData({
         animationModal:"open",
         likeAnimationData: likeAnimation.export(),
         commentAnimationData: commentAnimationData.export(),
         scoreAnimationData: scoreAnimationData.export(),
      })
   },
   closeOpt(){
      var likeAnimation = wx.createAnimation({
         duration: 200,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      var commentAnimationData = wx.createAnimation({
         duration: 200,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      var scoreAnimationData = wx.createAnimation({
         duration: 200,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      likeAnimation.translate(0, 0).step();
      commentAnimationData.translate(0, 0).step();
      scoreAnimationData.translate(0, 0).step();
      this.setData({
         animationModal: "open",
         likeAnimationData: likeAnimation.export(),
         commentAnimationData: commentAnimationData.export(),
         scoreAnimationData: scoreAnimationData.export(),
      })
      this.setData({
         animationModal: "close"
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {

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