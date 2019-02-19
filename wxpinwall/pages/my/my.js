// pages/my/my.js
const { $Toast } = require('../../dist/base/index');
const { $Message } = require('../../dist/base/index');
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      isLogin: "",
      username: "",
      password: "",
      checked: true,

      modalVisible: false,

      userData:""
   },
   //记住我选择
   handleAnimalChange({ 
      detail = {} 
   }) {
      this.setData({
         checked: detail.current
      });
   },
   handleClick() {
      this.setData({
         modalVisible: true
      })
   },
   //点击微信登录
   tapWxLogin(){
      let that = this;
      wx.login({
         success: function(res) {
            let code = res.code;
            wx.getUserInfo({
               success(res){
                  setStorageWithUserInfo(res.userInfo);
               }
            })
            wx.request({
               url: app.globalData.baseUrl + "/wx/users/getWxCode",
               data: {
                  jscode: code
               },
               header: {
                  'content-type': 'application/json'
               },
               success(res){
                  if (res.data.openid){
                     if (res.data.user != null && res.data.user.email != null) {
                        wx.setStorageSync("openid", res.data.openid);
                        wx.setStorageSync("myId", res.data.user.Id);
                        wx.setStorageSync("myRole", res.data.user.roles[0].name);
                        wx.setStorageSync("isLogin", "true");
                        wx.setTabBarItem({
                           index: 3,
                           text:"我的"
                        })
                        that.setData({
                           isLogin:"true"
                        });
                        that.onShow();
                     } else {
                        wx.setStorageSync("openid", res.data.openid);
                        $Message({
                           content: '由于您的微信未绑定图钉墙,无法进行相关操作，3秒后跳转到绑定界面！',
                           type: 'error',
                           duration: 3,
                           selector: "#message"
                        });
                        setTimeout(function () {
                           wx.redirectTo({
                              url: '/pages/my/completeInfo/completeInfo',
                           })
                        }, 3000);
                     }
                  }else{
                     $Message({
                        content: '微信登录失败！',
                        type: 'error',
                        duration: 3,
                        selector: "#message"
                     });                   
                  }
               }
            })
         }
      })
   },
   //解除绑定
   bindOk() {
      wx.removeStorageSync('openid');
      wx.removeStorageSync('myRole');
      wx.setStorageSync('isLogin', "false");
      this.setData({
         modalVisible: false,
         isLogin:"false"
      })
   },
   bindCancel(){
      this.setData({
         modalVisible: false
      })
   },
   //我的作品集
   zuopinjiTap(event){
      let userId = event.currentTarget.dataset.userId;
      wx.navigateTo({
         url: '/pages/topics/showreelDetail/showreelDetail' + "?userId=" + userId + "&jobTag=0",
      })
   },
   // 我的作业荚
   zuoyejiaTap(event) {
      let userId = event.currentTarget.dataset.userId;
      wx.navigateTo({
         url: '/pages/topics/showreelDetail/showreelDetail' + "?userId=" + userId + "&jobTag=1",
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
      
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function() {
      
   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {
      let that = this;
      this.setData({
         isLogin: wx.getStorageSync("isLogin")
      })
      if (this.data.isLogin == "true") {
         wx.setTabBarItem({
            index: 3,
            text: "我的"
         })
         let myId = wx.getStorageSync("myId");
         wx.request({
            url: app.globalData.baseUrl + app.globalData.refreshUserInfo + myId,
            success(res) {
               if (res.data.status == 200) {
                  that.setData({
                     userData: res.data.data
                  })
               }
            }
         })
      } else {
         this.setData({
            isLogin: "false"
         })
         wx.setTabBarItem({
            index: 3,
            text: "绑定"
         })
      }
   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function() {

   },

   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function() {

   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function() {

   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function() {

   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   }
})

function setStorageWithUserInfo(userInfo) {
   wx.setStorageSync("nickName", userInfo.nickName);
   wx.setStorageSync("avatarUrl", userInfo.avatarUrl);
   wx.setStorageSync("gender", userInfo.gender);
   wx.setStorageSync("province", userInfo.province);
   wx.setStorageSync("city", userInfo.city);
   wx.setStorageSync("country", userInfo.country);
}