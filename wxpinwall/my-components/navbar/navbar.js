// my-components/navbar.js
Component({
   /**
    * 组件的属性列表
    */
   properties: {
      tabIndex:{
         type: String,
         value: "3"
      },
      backDes:{
         type:String,
         value:""
      },
      topicTitle:{
         type:String,
         value:""
      },
      statusHeight:{
         type:Boolean,
         value:false
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
      _tapSearchBar(event) {
         this.triggerEvent("tapSearchBar", event, {});
      },
      _tapBack(event){
         this.triggerEvent("tapBack", event, {});
      }
   }
})
