//app.js
App({
   globalData: {
      // baseUrl: "https://beta.pinwall.design-engine.org",
      baseUrl:"http://127.0.0.1:7001",
      // baseUrl:"192.168.3.93:7001",
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

      userInfo: null
   },
   onLaunch: function() {
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