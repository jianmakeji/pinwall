const { $Toast } = require('../../../dist/base/index');
Page({

   /**
    * 页面的初始数据
    */
   data: {
      commentVisible: "hide",
      commentEditVisible:false,
      commentEditValue:"",
      artifactScoreVisible: false,
      artifactScoreValue: "",
      animationModal:"close",
      likeAnimationData: "",
      commentAnimationData: "",
      scoreAnimationData: ""
   },
   creatLike(){
      console.log("creatLike")
   },
   creatScore() {
      this.setData({
         artifactScoreVisible: true
      })
   },
   /**
    * 打开菜单
    */
   openOpt(){
      var likeAnimation = wx.createAnimation({
         duration: 400,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      var commentAnimationData = wx.createAnimation({
         duration: 400,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      var scoreAnimationData = wx.createAnimation({
         duration: 400,
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
   /**
    * 关闭菜单
    */
   closeOpt(){
      var likeAnimation = wx.createAnimation({
         duration: 400,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      var commentAnimationData = wx.createAnimation({
         duration: 400,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      var scoreAnimationData = wx.createAnimation({
         duration: 400,
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
   /*
      点击菜单评论按钮
    */
   openComment(){
      this.setData({
         commentVisible: "show"
      })
   },
   closeComment(){
      this.setData({
         commentVisible: "hide"
      })
   },
   /**
    * 点击评论按钮弹出评论弹窗
    */
   whiteComment(){
      this.setData({
         commentVisible: "hide",
         commentEditVisible: true
      })
   },
   /**
    * 点击评论弹窗发表
    */
   submitComment(){
      console.log("发表评论");
      this.setData({
         commentEditVisible: false
      });
      $Toast({
         content: '评论成功！',
         // type: 'success',
         image: '/images/photo_2.jpg',
         duration: 200,
         selector:"#toast"
      });
      setTimeout(() => {
         $Toast.hide();
      }, 2000);
   },
   /**
    * 点击评论弹窗取消
    */
   cancelComment(){
      this.setData({
         commentEditVisible: false
      })
   },
   /***
    * 点击分数保存
    */
   submitScore(){
      console.log("保存分数");
      this.setData({
         artifactScoreVisible: false
      });
      $Toast({
         content: '打分成功！',
         // type: 'success',
         image: '/images/photo_2.jpg',
         duration: 200,
         selector: "#toast"
      });
      setTimeout(() => {
         $Toast.hide();
      }, 2000);
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