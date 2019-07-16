// pages/my/forgetPwd/forgetPwd.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      statusHeight:false,
      smscodeText:"获取验证码",
      disableCodeBtn:false,
      mobile:"",
      smscode:"",
      password:"",
      confirmPassword:""
   },
   // 返回
   tapBack(){
      wx.navigateBack({
         data:1
      })
   },
   // 手机号值变化
   mobileChange(event){
      this.setData({
         mobile: event.detail.detail.value
      });
   },
   getSmsCode(){
      let that = this;
      let mobileReg = new RegExp("^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$");
      if(mobileReg.test(this.data.mobile)){
         wx.request({
            url: app.globalData.baseUrl + app.globalData.sendMessage + this.data.mobile,
            method: "GET",
            success(res) {
               if(res.data.status == 200){
                  clock(that);
                  wx.showToast({
                     title: '发送成功',
                     icon:"success"
                  })
               }else{
                  wx.showToast({
                     title: '获取验证码失败',
                     icon:"none"
                  })
               }
            }
         })
      }else{
         wx.showToast({
            title: '请输入正确的手机格式',
            icon:"none"
         })
      }
   },
   smscodeChange(event){
      this.setData({
         smscode: event.detail.detail.value
      })
      let that = this;
      if (event.detail.detail.value.length == 6){
         wx.request({
            url: app.globalData.baseUrl + app.globalData.vertifySms,
            method:"GET",
            data:{mobile:this.data.mobile,smsCode:this.data.smscode},
            success(res){
               if(res.data.status == 200){
                  wx.showToast({
                     title: '验证成功！',
                     icon:"success"
                  })
               }else{
                  wx.showToast({
                     title: '验证失败！',
                     icon:"none"
                  })
               }
            }
         })
      }
   },
   passwordChange(event){
      this.setData({
         password:event.detail.detail.value
      })
   },
   submit(event){
      let mobileReg = new RegExp("^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$");
      let that = this;
      if(this.data.password == this.data.confirmPassword && this.data.password.length >= 6){
         if (mobileReg.test(this.data.mobile)){
            if( this.data.smscode.length == 6){
               
               wx.request({
                  url: app.globalData.baseUrl + app.globalData.updatePwdWithMobile,
                  method: "PUT",
                  data: { mobile: this.data.mobile, smsCode: this.data.smscode,newPwd:this.data.password },
                  success(res){
                     if(res.data.status == 200){
                        wx.showToast({
                           title: res.data.data,
                           icon:"success"
                        })
                        that.setData({
                           mobile:"",
                           smscode:"",
                           password:"",
                           confirmPassword:""
                        })
                     }else{
                        wx.showToast({
                           title: res.data.data,
                           icon:"none"
                        })
                     }
                  }
               })

            }else{
               wx.showToast({
                  title: '请输入正确短信验证码',
                  icon: "none"
               }) 
            }
         }else{
            wx.showToast({
               title: '请输入正确手机格式',
               icon: "none"
            }) 
         }
      }else{
         wx.showToast({
            title: '密码输入不一致！',
            icon:"none"
         })
      }
   },
   /**
    * 生命周期函数--监听页面加载
    */
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
function clock(that) {
   var num = 60;
   var int = setInterval(function () {
      num > 0 ? num-- : clearInterval(int);
      that.setData({
         smscodeText : num + "秒后重试",
         disableCodeBtn : true
      })
      if (num == 0) {
         that.setData({
            smscodeText: "获取验证码",
            disableCodeBtn: false
         })
      }
   }, 1000);
}