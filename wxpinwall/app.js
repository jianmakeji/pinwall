//app.js
App({
   globalData: {
      // baseUrl: "https://beta.pinwall.design-engine.org",
      baseUrl:"http://127.0.0.1:7001",
      getMedalDataByRandom: "/wx/artifacts/getMedalDataByRandom/12",

      //users
      createWxUser: "/wx/users/createWxUser",
      bindWeixinInfoByEmail: "/wx/users/bindWeixinInfoByEmail",
      getWxActiveCodeByEmail: "/wx/users/getWxActiveCodeByEmail",
      userInfo: null
   },
   onLaunch: function() {
      
   }
})