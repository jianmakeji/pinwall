// my-complates/topic-complate.js
Component({
   /**
    * 组件的属性列表
    */
   properties: {
      userAvator:{
         type: String,
         value:"/images/default_profile.jpg"
      },
      userFullname:{
         type:String,
         value:""
      },
      totalArtifact:{
         type:String,
         value:""
      },
      createAt: {
         type: String,
         value: ""
      },
      topicName: {
         type: String,
         value: "2016秋-2013级《可持续设计》课程"
      },
      artifacts:{
         type:Array,
         value:[]
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
      _tapTheArtifact(event){
         // const topic_complate_detail = event; // detail对象，提供给事件监听函数
         // console.log(event);
         this.triggerEvent("tapTheArtifact", event, {});
      },
      _tapTheTopic(event){
         console.log(event)
         this.triggerEvent("tapTheTopic", event, {});
      }
   }
})