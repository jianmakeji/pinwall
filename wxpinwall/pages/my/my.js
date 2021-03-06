const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      tabIndexNum: "3",
      statusHeight: false,
      isLogin: "",
      username: "",
      password: "",
      checked: true,

      modalVisible: false,

      userData: "",
      myTopicNum:0,
      myTopicsData:[]
   },
   handleClick() {
      this.setData({
         modalVisible: true
      })
   },
   //点击微信登录
   tapWxLogin() {
      let that = this;
      wx.login({
         success: function (loginRes) {
            let code = loginRes.code;
            wx.getUserInfo({
               success(userInfoRes) {
                  setStorageWithUserInfo(userInfoRes.userInfo);
                  wx.setStorageSync("encryptedData", userInfoRes.encryptedData);
                  wx.setStorageSync("iv", userInfoRes.iv);
                  wx.request({
                     url: app.globalData.baseUrl + "/wx/users/getWxCode",
                     data: {
                        jscode: code,
                        encryptedData: userInfoRes.encryptedData,
                        iv: userInfoRes.iv
                     },
                     header: {
                        'content-type': 'application/json'
                     },
                     success(wxCodeRes) {
                        if (wxCodeRes.data.openid) {
                           wx.setStorageSync("openid", wxCodeRes.data.openid);
                           wx.setStorageSync("sessionKey", wxCodeRes.data.sessionKey);
                           if (wxCodeRes.data.user != null && (wxCodeRes.data.user.email != null || wxCodeRes.data.user.mobile != null)) {
                              wx.setStorageSync("openid", wxCodeRes.data.openid);
                              wx.setStorageSync("sessionKey", wxCodeRes.data.sessionKey);
                              wx.setStorageSync("myId", wxCodeRes.data.user.Id);
                              wx.setStorageSync("myRole", wxCodeRes.data.user.roles[0].name);
                              wx.setStorageSync("isLogin", "true");
                              wx.setTabBarItem({
                                 index: 3,
                                 text: "我的"
                              })
                              that.setData({
                                 isLogin: "true"
                              });
                              that.onShow();
                           } else {
                              wx.setStorageSync("openid", wxCodeRes.data.openid);
                              wx.showToast({
                                 title: '您的微信未绑定图钉墙,无法进行相关操作',
                                 icon:"none"
                              })
                              setTimeout(function() {
                                 wx.navigateTo({
                                    url: '/pages/my/completeInfo/completeInfo',
                                 })
                              }, 1000);
                           }
                        } else {
                           wx.showToast({
                              title: '微信登录失败！',
                              icon:"none"
                           })
                        }
                     }
                  })
               }
            })

         }
      })
   },
   //解除绑定
   bindOk() {
      wx.removeStorageSync('openid');
      wx.removeStorageSync('myRole');
      wx.removeStorageSync('myId');
      wx.setStorageSync('isLogin', "false");
      this.setData({
         modalVisible: false,
         isLogin: "false"
      })
   },
   bindCancel() {
      this.setData({
         modalVisible: false
      })
   },
   refreshUserInfo(event) {
      let that = this;
      let userId = event.currentTarget.dataset.userId;
      wx.request({
         url: app.globalData.baseUrl + app.globalData.refreshUserInfo + userId,
         success(res) {
            if (res.data.status == 200) {
               wx.setStorageSync("openid", res.data.data.openId);
               wx.setStorageSync("myId", res.data.data.Id);
               wx.setStorageSync("myRole", res.data.data.roles[0].name);
               wx.setStorageSync("avatarUrl", res.data.data.avatarUrl);
               that.setData({
                  userData: res.data.data
               })
               wx.showToast({
                  title: '刷新成功！',
                  type: "success"
               })
            }
         }
      })
   },
   //我的作品集
   zuopinjiTap(event) {
      let userId = event.currentTarget.dataset.userId;
      wx.navigateTo({
         url: '/pages/topics/showreelDetail/showreelDetail' + "?userId=" + userId + "&jobTag=0",
      })
   },
   // 我的作业荚
   zuoyejiaTap(event) {
      let userId = event.currentTarget.dataset.userId;
      wx.navigateTo({
         url: '/pages/topics/myTopics/myTopics' + "?userId=" + userId + "&jobTag=1",
      })
   },
   // 修改个人信息
   userInfoChange(event){
      wx.navigateTo({
         url: '/pages/my/resetInfo/resetInfo' + "?userId=" + wx.getStorageSync("myId"),
      })
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
         wx.request({
            url: app.globalData.baseUrl + app.globalData.getPersonalJobByUserId,
            data: { limit: 5,offset: 0,userId: myId,jobTag: 0 },
            method: "GET",
            success(res) {
               if (res.data.status == 200) {
                  if (res.data.data.rows.length) {
                     that.setData({
                        myTopicsData: res.data.data.rows
                     })
                  }
               }
            }
         })
         wx.request({
            url: app.globalData.baseUrl + app.globalData.countTopicsByUserId + "?userId=" + myId,
            method: "GET",
            success(res) {
               if (res.statusCode == 200) { 
                  that.setData({
                     myTopicNum: res.data
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