// my-complates/artifact-complate.js
Component({
   /**
    * 组件的属性列表
    */
   properties: {
      profileImage:{
         type:String,
         value:""
      },
      userAvator:{
         type: String,
         value: ""
      },
      userName: {
         type: String,
         value: ""
      },
      userId:{
         type: String,
         value:""
      },
      createAt:{
         type: String,
         value: ""
      },
      artifactTitle: {
         type: String,
         value: ""
      },
      role:{
         type:String,
         value:"ZYJ"
      },
      teacherId:{
         type:String,
         value:""
      },
      // 登录者Id
      myId:{
         type:Number,
         value: wx.getStorageSync("myId")
      },
      artifactScore:{
         type:String,
         value:'未打分'
      },
      medalCount: {
         type: String,
         value: ""
      },
      likeCount: {
         type: String,
         value: ""
      },
      commentCount: {
         type: String,
         value: ""
      },
   },

   /**
    * 组件的初始数据
    */
   data: {

   },

   /**
    * 组件的方法列表
    */
   methods: {
      // _tapUserAvator(event){
      //    this.triggerEvent("tapUserAvator", event, {});
      // }
   }
})
