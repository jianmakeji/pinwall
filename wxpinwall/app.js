//app.js
const mtjwxsdk = require('./utils/mtj-wx-sdk.js');
App({
   globalData: {
      baseUrl: "https://pinwall.design-engine.org",
      // baseUrl:"http://127.0.0.1:7001",
      // baseUrl:"192.168.3.129:7001",
      
      // index
      getMedalDataByRandom: "/wx/artifacts/getMedalDataByRandom/12",

      // topics
      topics: "/wx/topics",
      getTopicAndArtifactById:"/wx/topics/getTopicAndArtifactById",
      findArtifactByTopicId: "/wx/topics/findArtifactByTopicId",

      //artifact
      getArtifactById:"/wx/artifacts/getArtifactById/",
      findCommentsByArtifactIdWithPage:"/wx/artifacts/findCommentsByArtifactIdWithPage",
      getMedalLikeDataByUserIdAndArtifactsId:"/wx/artifacts/getMedalLikeDataByUserIdAndArtifactsId",
      createComment:"/wx/artifacts/createComment",
      createScore:"/wx/artifacts/createScore",
      createLike:"/wx/artifacts/createLike",
      getPersonalJobByUserId:"/wx/artifacts/getPersonalJobByUserId",

      //users
      createWxUser: "/wx/users/createWxUser",
      bindWeixinInfoByEmail: "/wx/users/bindWeixinInfoByEmail",
      getWxActiveCodeByEmail: "/wx/users/getWxActiveCodeByEmail",
      refreshUserInfo:"/wx/users/refreshUserInfo/",
      countTopicsByUserId:"/wx/topics/countTopicsByUserId",
      getUserInfoById:"/wx/users/getUserInfoById",
      updateUserIntro: "/wx/users/updateUserIntro/:id",
      updatePwdWithMobile: "/website/users/updatePwdWithMobile",

      //手机短信接口
      sendMessage: "/website/sms/sendMessage?mobile=",
      vertifySms: "/website/sms/vertifySms",

      //searchs 
      searchByKeywords: '/website/search/searchByKeywords', //作品搜索
      suggestKeyWords: '/website/search/suggestKeyWords',
      findByFullname:"/wx/users/findByFullname",            //用户搜索
      searchByTopicName:"/wx/topics/searchByTopicName",     //课程搜索

      statusBarHeight:""
   },
   onLaunch: function() {
      wx.getSystemInfo({
         success: (res) => {
            this.globalData.statusBarHeight = res.statusBarHeight
         }
      })
      if(wx.getStorageSync("isLogin") == "true"){
         wx.setTabBarItem({
            index: 3,
            text:"我的"
         })
      }else{
         wx.setTabBarItem({
            index: 3,
            text: "绑定"
         })
      }
   }
})