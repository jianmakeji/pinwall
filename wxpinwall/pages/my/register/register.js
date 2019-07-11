// pages/my/register/register.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      statusHeight: false,
      fullname: "",
      mobile: "",
      smscode: "",
      smscodeText: "获取验证码",
      disableCodeBtn: false,
      password: "",
      confirmPassword: ""
   },
   tapBack(event) {
      wx.navigateBack({
         data: 1
      })
   },
   fullnameChange(event) {
      this.setData({
         fullname: event.detail.detail.value
      })
   },
   mobileChange(event) {
      this.setData({
         mobile: event.detail.detail.value
      })

   },
   getSmsCode(event) {
      let that = this;
      let mobileReg = new RegExp("^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$");
      if (mobileReg.test(this.data.mobile)) {
         wx.request({
            url: app.globalData.baseUrl + app.globalData.sendMessage + this.data.mobile,
            method: "GET",
            success(res) {
               if (res.data.status == 200) {
                  clock(that);
                  wx.showToast({
                     title: '发送成功',
                     icon: "success"
                  })
               } else {
                  wx.showToast({
                     title: '获取验证码失败',
                     icon: "none"
                  })
               }
            }
         })
      } else {
         wx.showToast({
            title: '请输入正确的手机格式',
            icon: "none"
         })
      }
   },
   smscodeChange(event) {
      let that = this;
      this.setData({
         smscode: event.detail.detail.value
      })
      if (event.detail.detail.value.length == 6) {
         wx.request({
            url: app.globalData.baseUrl + app.globalData.vertifySms,
            method: "GET",
            data: {
               mobile: this.data.mobile,
               smsCode: this.data.smscode
            },
            success(res) {
               if (res.data.status == 200) {
                  wx.showToast({
                     title: '验证成功！',
                     icon: "success"
                  })
               } else {
                  wx.showToast({
                     title: '验证失败！',
                     icon: "none"
                  })
               }
            }
         })
      }
   },
   passwordChange(event) {
      this.setData({
         password: event.detail.detail.value
      })
   },
   pconfirmPasswordChange(event) {
      this.setData({
         pconfirmPassword: event.detail.detail.value
      })
   },
   submit() {
      let that = this;
      if (this.data.password == this.data.confirmPassword && this.data.password.length >= 6) {
         if ( this.data.smscode.length == 6 && this.data.mobile.length == 11) {
            if (this.data.fullname){
               wx.request({
                  url: app.globalData.baseUrl + app.globalData.createWxUser,
                  method: "POST",
                  data: {
                     fullname: this.data.fullname,
                     mobile: this.data.mobile,
                     password: this.data.password,
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
                     wx.setStorageSync("myId", res.data.data.user.Id);
                     wx.setStorageSync("myRole", res.data.data.roleName);
                     if (res.data.status == 200) {
                        wx.showToast({
                           title: '注册成功',
                           icon: "success"
                        });
                        that.setData({
                           fullname: "",
                           mobile: "",
                           smscode: "",
                           password: "",
                           confirmPassword: ""
                        })
                     } else {
                        wx.showToast({
                           title: '注册失败',
                           icon: "none"
                        });
                     }
                  }
               })
            }else{
               wx.showToast({
                  title: '请输入用户名',
                  icon: "none"
               });
            }
         } else {
            wx.showToast({
               title: '请填入正确手机号',
               icon: "none"
            })
         }
      } else {
         wx.showToast({
            title: '密码不一致，或密码位数少于6位',
            icon:"none"
         })
      }

   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
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
   onReady: function() {

   }
})
function clock(that) {
   var num = 60;
   var int = setInterval(function() {
      num > 0 ? num-- : clearInterval(int);
      that.setData({
         smscodeText: num + "秒后重试",
         disableCodeBtn: true
      })
      if (num == 0) {
         that.setData({
            smscodeText: "获取验证码",
            disableCodeBtn: false
         })
      }
   }, 1000);
}