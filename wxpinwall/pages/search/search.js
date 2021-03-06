// pages/search/search.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      loadModel:false,

      searchTitle:"搜索作品",
      tabIndexNum:"2",
      typeActive:"1",

      focusModel:false,
      hasResult: false,
      gbData:new Object(),
      gbUrl: new String(),
      keyword: "",
      artifactDataList:[],
      topicDataList: [],
      userDataList:[]
   },
   // 界面返回
   tapBack(event){
      if(this.data.hasResult){
         this.setData({
            focusModel: false,
            hasResult: false,
            keyword: "",
            artifactDataList: [],
            topicDataList: [],
            userDataList: []
         })
      }else{
         wx.navigateBack({
            data:1
         })
      }
   },
   // 输入值变化
   inputChange(event) {
      this.setData({
         keyword: event.detail.value
      })
   },
   // 搜索类型修改
   searchTypeChange(event){
      let searchNum = event.currentTarget.dataset.searchNum;
      this.setData({
         focusModel:true,
         typeActive: searchNum
      })
      if (searchNum == "1"){
         this.setData({
            searchTitle: "搜索作品"
         })
      } else if (searchNum == "2") {
         this.setData({
            searchTitle: "搜索课程"
         })
      }else if (searchNum == "3"){
         this.setData({
            searchTitle: "搜索用户"
         })
      }
   },
   // 搜索提交
   searchSubmit(event) {
      let that = this;
      let aoData = new Object();
      let aoUrl = new String();
      if(this.data.typeActive == "1"){    //作品搜索
         aoData.limit = 10;
         aoData.offset = 0;
         aoData.keyword = this.data.keyword;
         aoUrl = app.globalData.baseUrl + app.globalData.searchByKeywords;
      }
      if (this.data.typeActive == "2"){   //课程搜索
         aoData.limit = 10;
         aoData.offset = 0;
         aoData.jobTag = 1;
         aoData.subLimit = 5;
         aoData.status = 0;
         aoData.keyword = this.data.keyword;
         aoUrl = app.globalData.baseUrl + app.globalData.searchByTopicName;
      }
      if (this.data.typeActive == "3"){   //用户搜索
         aoData.limit = 10;
         aoData.offset = 0;
         aoData.fullname = this.data.keyword;
         aoUrl = app.globalData.baseUrl + app.globalData.findByFullname;
      }
      this.setData({
         gbData:aoData,
         gbUrl:aoUrl
      })
      wx.request({
         url: aoUrl,
         data: aoData,
         success(res) {
            if (res.data.status == 200) {
               if(that.data.typeActive == "1"){
                  if (res.data.data.hits.length != 0) {
                     that.setData({
                        focusModel: false,
                        hasResult: true,
                        artifactDataList: res.data.data.hits
                     })
                  } else {
                     wx.showToast({
                        title: '暂无该名称的作品！',
                        icon: 'none',
                        duration: 2000,
                     })
                  }
               }
               if(that.data.typeActive == "2"){
                  if (res.data.data.rows.length != 0) {
                     that.setData({
                        focusModel: false,
                        hasResult: true,
                        topicDataList: res.data.data.rows
                     })
                  }else{
                     wx.showToast({
                        title: '暂无该名称的课程！',
                        icon: 'none',
                        duration: 2000,
                     })
                  }
               }
               if (that.data.typeActive == "3") {
                  if (res.data.data.rows.length != 0) {
                     that.setData({
                        focusModel: false,
                        hasResult: true,
                        userDataList: res.data.data.rows
                     })
                  } else {
                     wx.showToast({
                        title: '暂无该名称的用户！',
                        icon: 'none',
                        duration: 2000,
                     })
                  }
               }
            } else {
               wx.showToast({
                  title: '搜索失败！',
                  duration: 2000,
                  icon: "none"
               })
            }
         }
      })
   },
   // 主题搜索
   tapTheTheme(event){
      let that = this;
      let aoData = new Object();
      let aoUrl = new String();
      if (this.data.typeActive == "1"){
         aoData.limit = 10;
         aoData.offset = 0;
         aoData.keyword = event.currentTarget.dataset.themeFlag;
         aoUrl = app.globalData.baseUrl + app.globalData.searchByKeywords;
         this.setData({
            gbData: aoData,
            gbUrl: aoUrl,
            keyword: event.currentTarget.dataset.themeFlag
         })
      }else{
         aoData.limit = 10;
         aoData.offset = 0;
         aoData.jobTag = 1;
         aoData.subLimit = 5;
         aoData.status = 0;
         aoData.keyword = event.currentTarget.dataset.themeFlag;
         aoUrl = app.globalData.baseUrl + app.globalData.searchByTopicName;
         this.setData({
            gbData: aoData,
            gbUrl: aoUrl,
            keyword: event.currentTarget.dataset.themeFlag
         })
      }
      
      wx.request({
         url: aoUrl,
         data:aoData,
         success(res){
            if (res.data.status == 200) {
               if (that.data.typeActive == "1") {
                  if (res.data.data.hits.length != 0) {
                     that.setData({
                        hasResult: true,
                        artifactDataList: res.data.data.hits
                     })
                  } else {
                     wx.showToast({
                        title: '暂无该名称的作品！',
                        icon: 'none',
                        duration: 2000,
                     })
                  }
               }
               if (that.data.typeActive == "2") {
                  if (res.data.data.rows.length != 0) {
                     that.setData({
                        focusModel: false,
                        hasResult: true,
                        topicDataList: res.data.data.rows
                     })
                  } else {
                     wx.showToast({
                        title: '暂无该名称的课程！',
                        icon: 'none',
                        duration: 2000,
                     })
                  }
               }
            } else {
               wx.showToast({
                  title: '搜索失败！',
                  duration: 2000,
                  icon: "none"
               })
            }
         }
      })
   },
   // 点击作品
   artifactTap(event) {
      let artifactId = event.target.dataset.artifactId;
      wx.navigateTo({
         url: '/pages/topics/artifactDetail/artifactDetail?artifactId=' + artifactId,
      })
   },
   // 点击课程结果
   tapTheTopic(event){
      let topicId = event.currentTarget.dataset.topicId;
      wx.navigateTo({
         url: '/pages/topics/topicDetail/topicDetail' + "?topicId=" + topicId,
      });
   },
   // 点击用户结果
   tapUserInfo(event){
      let userId = event.currentTarget.dataset.userId;
      wx.navigateTo({
         url: '/pages/topics/showreelDetail/showreelDetail' + "?userId=" + userId + "&jobTag=0",
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
      if (app.globalData.statusBarHeight == 44) {
         this.setData({
            statusHeight: true
         })
      } else {
         this.setData({
            statusHeight: false
         })
      }
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
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {
      let that = this;
      this.setData({
         "gbData.offset": this.data.gbData.offset + 10
      })
      wx.request({
         url: this.data.gbUrl,
         data:this.data.gbData,
         success(res){
            if (res.data.status == 200) {
               if (that.data.typeActive == "1") {
                  if (res.data.data.hits.length != 0) {
                     that.setData({
                        focusModel: false,
                        hasResult: true,
                        artifactDataList: that.data.artifactDataList.concat(res.data.data.hits)
                     })
                  }
               }
               if (that.data.typeActive == "2") {
                  if (res.data.data.rows.length != 0) {
                     that.setData({
                        focusModel: false,
                        hasResult: true,
                        topicDataList: that.data.topicDataList.concat(res.data.data.rows)
                     })
                  }
               }
               if (that.data.typeActive == "3") {
                  if (res.data.data.rows.length != 0) {
                     that.setData({
                        focusModel: false,
                        hasResult: true,
                        userDataList: that.data.userDataList.concat(res.data.data.rows)
                     })
                  }
               }
            } else {
               wx.showToast({
                  title: '搜索失败！',
                  duration: 2000,
                  icon:"none"
               })
            }
         }
      })
   },
})