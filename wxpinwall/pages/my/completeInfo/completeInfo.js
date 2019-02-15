// pages/my/completeInof/completeInof.js
const { $Toast } = require('../../../dist/base/index');
const app = getApp();
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
      username:"",
      email:"",
      password:"",
      bindemail:"",
      registerDisable: true,
      bindemailDisable: true,
      wxActiveDisable: false,
      bindWxDisable: true
   },
   radioChange({ detail = {} }) {
      this.setData({
         current: detail.value,
         username: "",
         email: "",
         password: "",
         bindemail: "",
         registerDisable: true,
         bindemailDisable: true,
         wxActiveDisable: true,
         bindWxDisable: true
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
      this.setData({
         bindemail: event.detail.detail.value
      });
      if (this.data.bindemail) {
         this.setData({
            bindemailDisable: false
         })
      } else {
         this.setData({
            bindemailDisable: true
         })
      }
   },
   //注册新用户
   register(){
      let that = this;
      let emailExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (this.data.username && emailExp.test(this.data.email) && this.data.password.length > 5){
         wx.request({
            url: app.globalData.baseUrl + app.globalData.createWxUser,
            method:"POST",
            data:{
               email: this.data.email,
               fullname: this.data.username,
               password:this.data.password,
               openid: wx.getStorageSync("openid"),
               nickname: wx.getStorageSync("nickName"),
               sex: wx.getStorageSync("gender"),
               city: wx.getStorageSync("city"),
               province: wx.getStorageSync("province"),
               country: wx.getStorageSync("country"),
               headimageurl: wx.getStorageSync("avatarUrl")
            },
            success(res){
               that.setData({
                  wxActiveDisable: false
               })
               if(res.data.status == 200){
                  $Toast({
                     content: res.data.data + "邮箱激活后，请点击“邮箱已激活”按钮！",
                     type: 'success',
                     duration: 3
                  });
               }
            }
         })
      } else if (!emailExp.test(this.data.email)){
         $Toast({
            content: '请输入正确邮箱格式!',
            type: 'error',
            duration: 3
         });
      }
   },
   wxActiveTap() {
      let emailExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (this.data.email && emailExp.test(this.data.email)){
         wx.request({
            url: app.globalData.baseUrl + app.globalData.getWxActiveCodeByEmail,
            data: {
               email: this.data.email
            },
            method: "GET",
            success(res) {
               if (res.data.status == 200) {
                  wx.setStorageSync("isLogin", "true");
                  wx.switchTab({
                     url: '/pages/my/my',
                  })
               }
            }
         })
      }else{
         $Toast({
            content: '请输入正确邮箱格式!',
            type: 'error',
            duration: 3
         });
      }
      
   },
   //绑定现有用户
   bindEmail(){
      let that = this;
      let emailExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (emailExp.test(this.data.bindemail)){
         wx.request({
            url: app.globalData.baseUrl + app.globalData.bindWeixinInfoByEmail,
            method: "POST",
            data: {
               email: this.data.bindemail,
               openid: wx.getStorageSync("openid"),
               nickname: wx.getStorageSync("nickName"),
               sex: wx.getStorageSync("gender"),
               city: wx.getStorageSync("city"),
               province: wx.getStorageSync("province"),
               country: wx.getStorageSync("country"),
               headimageurl: wx.getStorageSync("avatarUrl")
            },
            success(res) {
               if (res.data.status == 200) {
                  that.setData({
                     bindWxDisable: false
                  })
                  $Toast({
                     content: res.data.data + "邮箱激活后，请点击“邮箱已激活”按钮！",
                     type: 'success',
                     duration: 3
                  });
               }else{
                  $Toast({
                     content: res.data.data,
                     type: 'error',
                     duration: 3
                  });
               }
            }
         })
      } else{
         $Toast({
            content: '请输入正确邮箱格式!',
            type: 'error',
            duration: 3
         });
      }
   },
   bindWx(){
      let emailExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (this.data.bindemail && emailExp.test(this.data.bindemail)){
         wx.request({
            url: app.globalData.baseUrl + app.globalData.getWxActiveCodeByEmail,
            data: {
               email: this.data.bindemail
            },
            method: "GET",
            success(res) {
               if (res.data.status == 200) {
                  wx.setStorageSync("isLogin", "true");
                  wx.switchTab({
                     url: '/pages/my/my',
                  })
               }
            }
         })
      }else{
         $Toast({
            content: '请输入正确邮箱格式!',
            type: 'error',
            duration: 3
         });
      }
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