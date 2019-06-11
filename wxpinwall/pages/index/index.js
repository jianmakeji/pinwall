const { $Message } = require('../../dist/base/index');
var app = getApp();

Page({
   data: {
      tabIndex:"1",
      statusHeight:false,
      createAtData:[],
      //数据数组
      dataList:[]
   },
   tapArtifical(event) {
      let artifactId = event.currentTarget.dataset.artifactId;
      wx.navigateTo({
         url: '/pages/topics/artifactDetail/artifactDetail?artifactId=' + artifactId,
      })
   },
   //点击用户头像
   tapUserInfo(event){
      let userId = event.currentTarget.dataset.userId;
      wx.navigateTo({
         url: '/pages/topics/showreelDetail/showreelDetail' + "?userId=" + userId + "&jobTag=0",
      })
   },
   tapSearchBar(event){
      wx.navigateTo({
         url: '/pages/search/search',
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
      let that = this;
      this.setData({
         tabIndex:"1"
      })
      if (app.globalData.statusBarHeight == 44){
         that.setData({
            statusHeight:true
         })
      }else{
         that.setData({
            statusHeight: false
         })
      }
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getMedalDataByRandom,
         method:"GET",
         success(res){
            if (res.statusCode == 200) {
               that.setData({
                  dataList : res.data
               })
               let arr = new Array();
               for(let i=0;i<res.data.length;i++){
                  let create = new String();
                  create = res.data[i].createAt;
                  arr.push(create.split('T')[0]);
               }
               that.setData({
                  createAtData: arr
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
   onPullDownRefresh: function () {
      let that = this;
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getMedalDataByRandom,
         method: "GET",
         success(res) {
            if (res.statusCode == 200) {
               that.setData({
                  dataList: res.data
               })
               let arr = new Array();
               for (let i = 0; i < res.data.length; i++) {
                  let create = new String();
                  create = res.data[i].createAt;
                  arr.push(create.split('T')[0]);
               }
               that.setData({
                  createAtData: arr
               })
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