// pages/search/search.js
const {
   $Toast
} = require('../../dist/base/index');
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      hasResult: false,
      searchResult: [],
      limit: 10,
      offset: 0,
      keyword: "",
      dataList: [],
   },
   inputChange(event) {
      let that = this;
      this.setData({
         keyword: event.detail.value
      })
      wx.request({
         url: app.globalData.baseUrl + app.globalData.suggestKeyWords,
         data: {
            keyword: this.data.keyword
         },
         success(res) {
            if (res.data.status == 200) {
               that.setData({
                  hasResult: true,
                  searchResult: res.data.data
               })
            } else {
               $Toast({
                  content: '搜索失败！',
                  type: "error",
                  duration: 1,
                  selector: "#toast"
               });
            }
         }
      })
   },
   bindCell(event) {
      let artifactId = event.currentTarget.dataset.id
      wx.navigateTo({
         url: '/pages/topics/artifactDetail/artifactDetail?artifactId=' + artifactId,
      })
   },
   onClear(){
      this.setData({
         keyword:"",
         searchResult: [],
         hasResult:false
      })
   },
   searchSubmit(event) {
      let that = this;
      wx.request({
         url: app.globalData.baseUrl + app.globalData.searchByKeywords,
         data: {
            limit: this.data.limit,
            offset: this.data.offset,
            keyword: this.data.keyword,
         },
         success(res) {
            if (res.data.status == 200){
               that.setData({
                  hasResult: true,
                  dataList: res.data.data.hits
               })
            }else{
               $Toast({
                  content: '搜索失败！',
                  type: "error",
                  duration: 1,
                  selector: "#toast"
               });
            }
         }
      })
   },
   artifactTap(event) {
      let artifactId = event.target.dataset.artifactId;
      wx.navigateTo({
         url: '/pages/topics/artifactDetail/artifactDetail?artifactId=' + artifactId,
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
      
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function() {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {
      wx.setNavigationBarTitle({
         title: '探索',
      })
   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function() {
      
   },

   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function() {

   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function() {
      this.setData({
         offset: 0
      })
      getData(this, "init");
   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function() {
      this.setData({
         offset: this.data.offset + 10
      })
      getData(this, "more")
   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   }
})
// 数据请求
function getData(that, type) {
   wx.request({
      url: app.globalData.baseUrl + app.globalData.searchByKeywords,
      data: {
         limit: that.data.limit,
         offset: that.data.offset,
         keyword: that.data.keyword,
      },
      method: "GET",
      success(res) {
         if (res.data.status == 200) {
            if (type == "init") {
               that.setData({
                  hasResult: false,
                  dataList: res.data.data.hits
               })
               wx.stopPullDownRefresh();
            } else if (type == "more") {
               that.setData({
                  dataList: that.data.dataList.concat(res.data.data.hits)
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