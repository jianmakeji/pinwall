// pages/my/completeInof/completeInof.js
Page({

   /**
    * 页面的初始数据
    */
   data: {
      current: "新用户",
      radioData: [
         { id: 0,name: '新用户' },
         { id: 1,name: '图钉墙用户' }
      ],
      username:"111111",
      email:"1223720954@qq.com",
      password:"111111",
      bindemail:"",
      registerDisable:false,
      bindemailDisable:true
   },
   radioChange({ detail = {} }) {
      this.setData({
         current: detail.value,
         username: "",
         email: "",
         password: "",
         bindemail: ""
      });
   },
   //username输入
   usernameChange(event){
      this.setData({
         username: event.detail.detail.value
      })
      if (this.data.username && this.data.email && this.data.password) {
         this.setData({
            registerDisable: false
         })
      }else{
         this.setData({
            registerDisable: true
         })
      }
   },
   //email输入
   emailChange(event){
      this.setData({
         email : event.detail.detail.value
      });
      if (this.data.username && this.data.email && this.data.password) {
         this.setData({
            registerDisable: false
         })
      } else {
         this.setData({
            registerDisable: true
         })
      }
   },
   //password输入
   passwordChange(event) {
      this.setData({
         password: event.detail.detail.value
      });
      if (this.data.username && this.data.email && this.data.password) {
         this.setData({
            registerDisable: false
         })
      } else {
         this.setData({
            registerDisable: true
         })
      }
   },
   //bindemial输入
   bindemailChange(event){

   },
   register(){
      console.log("register", this.data);
      let usernameExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (this.data.username && usernameExp.test(this.data.email) && this.data.password.length > 5){
         this.setData({
            registerDisable:false
         })
      } else if (this.data.username.length == 0){
         console.log("2")
      } else if (this.data.email.length == 0) {
         console.log("3")
      } else if (this.data.password.length < 6) {
         console.log("4")
      }
   },
   bindEmail(){
      console.log("bindEmail");
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