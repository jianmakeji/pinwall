// pages/topics/myTopics/myTopics.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      tabIndexNum: "2",
      userId:"",
      jobTag: "",
      subLimit: 5,
      status: -1,
      limit:10,
      offset:0
   },
   tapBack(event){
      wx.navigateBack({
         data:1
      })
   },
   tapTheTopic(event){
      let topicId = event.currentTarget.dataset.topicId;
      wx.navigateTo({
         url: '/pages/topics/topicDetail/topicDetail' + "?topicId=" + topicId,
      });
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      let that = this;
      if (app.globalData.statusBarHeight == 44) {
         that.setData({
            statusHeight: true
         })
      } else {
         that.setData({
            statusHeight: false
         })
      }
      this.setData({
         userId: options.userId,
         jobTag: options.jobTag
      })
      getData(this, "init");
   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function () {
      let that = this;
      this.setData({
         offset: 0,
      })
      getData(this, "init");
   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {
      let that = this;
      this.setData({
         offset: this.data.offset + 10,
         loading: true
      })
      getData(this, "more");
   }
})
// 数据请求
function getData(that, type) {
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
            if (type == "init") {
               that.setData({
                  dataList: res.data.data.rows
               })
               wx.stopPullDownRefresh();
            } else if (type == "more") {
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