// pages/my/completeInof/completeInof.js
const { $Toast } = require('../../../dist/base/index');
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      current: "new",
      username:"",
      email:"",
      password:"",
      bindemail:"1223720954@qq.com",
      registerDisable: true,
      bindemailDisable: true,
      wxActiveDisable: false,
      bindWxDisable: false
   },
   radioChange(event) {
      let type = event.currentTarget.dataset.type;
      if(type == "new"){
         this.setData({
            current: type,
            bindemail: "",
            registerDisable: true,
            bindemailDisable: true,
            wxActiveDisable: false,
            bindWxDisable: false
         });
      }else{
         this.setData({
            current: type,
            username: "",
            email: "",
            password: "",
            registerDisable: true,
            bindemailDisable: true,
            wxActiveDisable: false,
            bindWxDisable: false
         });
      }
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
               headimageurl: wx.getStorageSync("avatarUrl"),

               encryptedData: wx.getStorageSync("encryptedData"),
               iv: wx.getStorageSync("iv"),
               sessionKey: wx.getStorageSync("sessionKey"),
            },
            success(res){
               wx.setStorageSync("myId", res.data.data.user.Id);
               wx.setStorageSync("myRole", res.data.data.roleName);
               that.setData({
                  wxActiveDisable: false
               })
               if(res.data.status == 200){
                  $Toast({
                     content: res.data.data.message + "邮箱激活后，请点击“邮箱已激活”按钮！",
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
      } else if (this.data.password.length < 6) {
         $Toast({
            content: '密码长度至少6位!',
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
               } else {
                  $Toast({
                     content: res.data.data,
                     type: 'error',
                     duration: 3
                  });
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
               headimageurl: wx.getStorageSync("avatarUrl"),

               encryptedData: wx.getStorageSync("encryptedData"),
               iv: wx.getStorageSync("iv"),
               sessionKey: wx.getStorageSync("sessionKey"),
            },
            success(res) {
               if (res.data.status == 200) {
                  wx.setStorageSync("myId", res.data.data.user.Id);
                  wx.setStorageSync("myRole", res.data.data.user.roles[0].name);
                  that.setData({
                     bindWxDisable: false
                  })
                  $Toast({
                     content: res.data.data.message + "邮箱激活后，请点击“邮箱已激活”按钮！",
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
               }else{
                  $Toast({
                     content: res.data.data,
                     type: 'error',
                     duration: 3
                  }); 
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
   }
})