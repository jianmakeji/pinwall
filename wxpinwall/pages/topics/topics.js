// pages/topics/topics.js
const { $Message } = require('../../dist/base/index');
const app = getApp();
Page({
   data: {
      tabIndex: 0,
      tabs: [{
            title: '全部'
         },
         {
            title: '开放中'
         },
         {
            title: '已关闭'
         },
         {
            title: '由我创建'
         }
      ],
      loading:false,
      //请求参数
      limit: 10,
      offset: 0,
      jobTag: 0,
      subLimit: 5,
      status: -1,
      userId: -1,
      //数据数组
      dataList: []
   },
   tabchange: function(e) {
      let tab_index = e.detail.key;
      if (tab_index == 0) {
         this.setData({
            offset: 0,
            status: -1,
            userId: -1
         })
         getData(this,"init");
      } else if (tab_index == 1){
         this.setData({
            offset: 0,
            status: 0,
            userId: -1
         })
         getData(this, "init");
      } else if (tab_index == 2) {
         this.setData({
            offset: 0,
            status: 1,
            userId: -1
         })
         getData(this, "init");
      } else if (tab_index == 3) {
         this.setData({
            offset: 0,
            status: -1,
            userId: wx.getStorageSync("myId")
         })
         getData(this, "init");
      }
   },
   tapTheTopic(event) {
      let topicId = event.currentTarget.dataset.topicId;
      wx.navigateTo({
         url: '/pages/topics/topicDetail/topicDetail' + "?topicId=" + topicId,
      });
   },
   /*
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      getData(this, "init");
   },
   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function() {
      let that = this;
      this.setData({
         offset: 0,
      })
      getData(this,"init");
   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function() {
      let that = this;
      this.setData({
         offset: this.data.offset + 10,
         loading:true
      })
      getData(this, "more");
   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   }
})

// 数据请求
function getData(that, type){
   wx.request({
      url: app.globalData.baseUrl + app.globalData.topics,
      data: {
         limit: that.data.limit,
         offset: that.data.offset,
         jobTag: that.data.jobTag,
         subLimit: that.data.subLimit,
         status: that.data.status,
         userId: that.data.userId,
      },
      method: "GET",
      success(res) {
         if (res.data.status == 200) {
            if(type == "init"){
               that.setData({
                  dataList: res.data.data.rows
               })
               wx.stopPullDownRefresh();
            } else if (type == "more"){
               that.setData({
                  dataList: that.data.dataList.concat(res.data.data.rows),
                  loading: false
               })
            }
         } else {
            $Message({
               content: '获取数据出错！',
               type: 'error',
               duration: 3,
               selector: "#message"
            });
         }
      }
   })
}