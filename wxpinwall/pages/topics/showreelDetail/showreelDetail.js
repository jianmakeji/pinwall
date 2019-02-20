// pages/topics/topicDetail.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      //请求参数
      limit: 10,
      offset: 0,
      userId: "",
      jobTag:"",
      // 数据数组
      dataList: [],
      loading: false,
      avatarUrl: "",
      fullname: "",
      atrifactCount: "",
      topicName: ""
   },
   tapTheArtifact(event) {
      let artifactId = event.detail.target.dataset.artifactId;
      wx.navigateTo({
         url: '/pages/topics/artifactDetail/artifactDetail?artifactId=' + artifactId,
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
   onLoad: function (options) {
      let that = this;
      this.setData({
         userId: options.userId,
         jobTag:options.jobTag
      })
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getPersonalJobByUserId,
         data: {
            limit: this.data.limit,
            offset: this.data.offset,
            userId: this.data.userId,
            jobTag:this.data.jobTag
         },
         method: "GET",
         success(res) {
            if (res.data.status == 200) {
               if (res.data.data.rows.length){
                  that.setData({
                     dataList: res.data.data.rows,
                     avatarUrl: res.data.data.rows[0].user.avatarUrl,
                     fullname: res.data.data.rows[0].user.fullname,
                     atrifactCount: res.data.data.count,
                     createAt: res.data.data.rows[0].user.createAt,
                     topicName: res.data.data.rows[0].user.fullname + "的作品集",
                  })
                  if (that.data.jobTag == 0) {
                     that.setData({
                        topicName: res.data.data.rows[0].user.fullname + "的作品集",
                     })
                  } else {
                     that.setData({
                        topicName: res.data.data.rows[0].user.fullname + "的作业荚",
                     })
                  }
               }
            }
         }
      })
   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function () {
      let that = this;
      this.setData({
         offset: 0
      })
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getPersonalJobByUserId,
         data: {
            limit: this.data.limit,
            offset: this.data.offset,
            userId: this.data.userId,
            jobTag: this.data.jobTag
         },
         method: "GET",
         success(res) {
            if (res.data.status == 200) {
               wx.stopPullDownRefresh();
               that.setData({
                  dataList: res.data.data.rows,
                  avatarUrl: res.data.data.rows[0].user.avatarUrl,
                  fullname: res.data.data.rows[0].user.fullname,
                  atrifactCount: res.data.data.count,
                  createAt: res.data.data.rows[0].user.createAt
               })
               if(that.data.jobTag == 0){
                  that.setData({
                     topicName: res.data.data.rows[0].user.fullname + "的作品集",
                  })
               }else{
                  that.setData({
                     topicName: res.data.data.rows[0].user.fullname + "的作业荚",
                  })
               }
            }
         }
      })
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
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getPersonalJobByUserId,
         data: {
            limit: this.data.limit,
            offset: this.data.offset,
            userId: this.data.userId,
            jobTag: this.data.jobTag
         },
         method: "GET",
         success(res) {
            if (res.data.status == 200) {
               that.setData({
                  dataList: that.data.dataList.concat(res.data.data.rows),
                  loading: false
               })
            }
         }
      })
   }
})