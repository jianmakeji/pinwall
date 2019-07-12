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
      artifactScore:{
         type:Array,
         value:[]
      },
      searchFlag:{
         type:String,
         value:""
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
