const { $Message } = require('../../dist/base/index');
var app = getApp();

Page({
   data: {
      visible: "hide",
      //弹出层数据
      artifactId:"",
      userId:"",
      userAvator:"",
      username:"",
      createAt:"",
      title:"",
      descript:"",
      topic_title:"",
      medalCount:"",
      likeCount:"",
      commentCount:"",
      //数据数组
      dataList:[]
   },
   bindtap(event) {
      let index = event.currentTarget.dataset.artificatNum;
      this.setData({
         visible: "show",
         artifactId: this.data.dataList[index].Id,
         userId: this.data.dataList[index].user.Id,
         userAvator: this.data.dataList[index].user.avatarUrl,
         username: this.data.dataList[index].user.fullname,
         createAt: this.data.dataList[index].createAt.split("T")[0],
         name: this.data.dataList[index].name,
         descript: this.data.dataList[index].description,
         topic_title: this.data.dataList[index].topics[0] ? this.data.dataList[index].topics[0].name : "无",
         medalCount: this.data.dataList[index].medalCount,
         likeCount: this.data.dataList[index].likeCount,
         commentCount: this.data.dataList[index].commentCount,
      })
   },
   //点击用户头像
   tapTopicTitle(event){
      let artifactId = event.currentTarget.dataset.artifactId;
      this.setData({
         visible: "hide"
      })
      wx.navigateTo({
         url: '/pages/topics/artifactDetail/artifactDetail' + "?artifactId=" + artifactId,
      })
   },
   unsubmit() {
      this.setData({
         visible: "hide"
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
      let that = this;
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getMedalDataByRandom,
         method:"GET",
         success(res){
            if (res.statusCode == 200) {
               that.setData({
                  dataList : res.data
               })
            } else {
               $Message({
                  content: '获取数据出错！',
                  duration: 2,
                  type: 'error'
               });
            }
         }
      })
   },
   onShow(){
      wx.setNavigationBarTitle({
         title: '设计廊',
      })
   },
   onHide(){
      this.setData({
         visible: "hide"
      })
   },
   onPullDownRefresh: function () {
      let that = this;
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getMedalDataByRandom,
         method: "GET",
         success(res) {
            if (res.statusCode == 200) {
               that.setData({
                  dataList: res.data
               });
               wx.stopPullDownRefresh();
            } else {
               $Message({
                  content: '获取数据出错！',
                  duration: 2,
                  type: 'error'
               });
            }
         }
      })
   },
})