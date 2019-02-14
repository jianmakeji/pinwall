const { $Message } = require('../../dist/base/index');
var app = getApp();

Page({
   data: {
      visible: "hide",
      dataList:[]
   },
   bindtap(event) {
      this.setData({
         visible: "show"
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
               console.log(res.data);
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
})