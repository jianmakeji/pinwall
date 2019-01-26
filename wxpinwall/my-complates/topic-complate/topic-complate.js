// my-complates/topic-complate.js
Component({
   /**
    * 组件的属性列表
    */
   properties: {
      userAvator:{
         type: String,
         value:"/images/photo_1.jpg"
      },
      userFullname:{
         type:String,
         value:"张军"
      },
      totalArtifact:{
         type:String,
         value:"包含67个作品"
      },
      createAt: {
         type: String,
         value: "2018-09-22 11:31:36 创建"
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
      tapTheArtifact(e){
         const {value:searchValue} = e.detail; // detail对象，提供给事件监听函数
         console.log(searchValue);
         this.triggerEvent('tapTheArtifact', { searchValue}, {});
      }
   }
})