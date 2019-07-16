// pages/my/completeInof/completeInof.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      statusHeight:false,
      bindemail:"",
      bindPwd:""
   },
   tapBack(){
      wx.navigateBack({
         data:1
      })
   },
   //bindemial输入
   bindemailChange(event){
      this.setData({
         bindemail: event.detail.detail.value
      });
   },
   // bindPwd输入
   bindPwdChange(event){
      this.setData({
         bindPwd: event.detail.detail.value
      });
   },
   //绑定现有用户
   bindEmail(){
      let that = this;
      let emailExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      let phoneExp = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
      if (emailExp.test(this.data.bindemail) || phoneExp.test(this.data.bindemail)){
         if(this.data.bindPwd.length >= 6){
            wx.request({
               url: app.globalData.baseUrl + app.globalData.bindWeixinInfoByEmail,
               method: "POST",
               data: {
                  email: this.data.bindemail,
                  password: this.data.bindPwd,
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
                     wx.showToast({
                        title: res.data.data.message,
                        icon:"success",
                        duration:2000,
                        success(){
                           wx.switchTab({
                              url: '/pages/my/my',
                           })
                        }
                     })
                  } else {
                     wx.showToast({
                        title: res.data.data,
                        icon: "none"
                     })
                  }
               }
            })
         }else{
            wx.showToast({
               title: '密码长度不少于6！',
               icon: "none"
            })
         }
         
      } else{
         wx.showToast({
            title: '请输入正确邮箱或手机号!',
            icon: "none"
         });
      }
   },
   // 点击忘记密码
   tapForgetPwd(){
      wx.navigateTo({
         url: "/pages/my/forgetPwd/forgetPwd",
      })
   },
   // 点击手机注册
   tapRegister() {
      wx.navigateTo({
         url: "/pages/my/register/register",
      })
   },
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
   }
})