// pages/topics/topics.js
Page({
      data: {
         tabIndex: 0,
         tabs: [
            { title: '全部'},
            { title: '开放中'},
            { title: '已关闭' },
            { title: '由我创建'}
         ],
         topics:[
            { profileImage: "/images/photo_1.jpg" },
            { profileImage: "/images/photo_1.jpg" },
            { profileImage: "/images/photo_1.jpg" }
         ]
      },
      tabchange: function (e) {
         console.log(e.detail.key);
         let tab_index = e.detail.key;
         if (tab_index == 1){
               this.setData({
                  topics : [
                     { profileImage: "/images/photo_2.jpg" },
                     { profileImage: "/images/photo_2.jpg" },
                     { profileImage: "/images/photo_2.jpg" },
                     { profileImage: "/images/photo_2.jpg" },
                     { profileImage: "/images/photo_2.jpg" }
                  ]
               })
         }
      },
      tapTheTopic(event){
         wx.navigateTo({
            url: '/pages/topics/topicDetail/topicDetail',
         });
      },
    /*
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})