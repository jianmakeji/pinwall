// my-components/search-user/search-user.js
Component({
   /**
    * 组件的属性列表
    */
   properties: {
      fullname:{
         type:String,
         value:""
      },
      avatarUrl:{
         type:String,
         value:""
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
      }
   }
})
