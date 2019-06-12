// my-components/index-bigwork/index-bigworks.js
Component({
   /**
    * 组件的属性列表
    */
   properties: {
      avatarUrl:{
         type:String,
         value:'/images/default_profile.jpg'
      },
      fullname:{
         type:String,
         value:''
      },
      createAt:{
         type: String,
         value: ''
      },
      profileImage:{
         type:String,
         value:'/images/logo_white.png'
      },
      name: {
         type: String,
         value: ''
      },
      topicsName: {
         type: String,
         value: ''
      },
      medalCount:{
         type: String,
         value: '0'
      },
      likeCount: {
         type: String,
         value: '0'
      },
      commentCount: {
         type: String,
         value: '0'
      }
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
      _tapUserInfo(event){
         this.triggerEvent("tapUserInfo", event, {});
      },
      _tapArtifical(event){
         this.triggerEvent('tapArtifical',event,{})
      }
   }
})
