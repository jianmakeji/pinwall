// my-complates/topic-complate.js
Component({
   /**
    * 组件的属性列表
    */
   properties: {
      userAvator: {
         type: String,
         value: ""
      },
      userFullname: {
         type: String,
         value: ""
      },
      totalArtifact: {
         type: String,
         value: ""
      },
      createAt: {
         type: String,
         value: ""
      },
      topicName: {
         type: String,
         value: ""
      },
      des: {
         type: String,
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
      _tapTheTopic(event) {
         this.triggerEvent("tapTheTopic", event, {});
      }
   }
})