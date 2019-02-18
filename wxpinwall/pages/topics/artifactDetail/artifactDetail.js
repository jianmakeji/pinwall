const {
   $Toast
} = require('../../../dist/base/index');
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {     
      vipRole:false, 
      animationModal: "close",
      zanModal:false,
      likeAnimationData: "",
      commentAnimationData: "",
      scoreAnimationData: "",
      //作品信息
      artifactUserId:"",      //作品作者id
      userAvatarUrl: "",
      userFullname: "",
      artifactScores: "",
      artifactTitle: "",
      createAt: "",
      topicName: "",
      artifactDes: "",
      artifact_assets:[],
      //作品评论
      commentLimit:10000,
      commentOffset:0,
      artifactId:"",
      commentList:[],
      //新建评论
      commentVisible: "hide",
      commentEditVisible: false,
      commentEditValue: "",
      content: "afsdfasdf",
      commenterId: "",
      //新建分数
      artifactScoreVisible: false,
      artifactScoreValue: 100,
   },
   creatLike() {
      let that = this;
      if(wx.getStorageSync("openid")){
         wx.request({
            url: app.globalData.baseUrl + app.globalData.createLike,
            method:"POST",
            data:{
               roleName:wx.getStorageSync("myRole"),
               userId:wx.getStorageSync("myId"),
               artifactId:this.data.artifactId,
               artifactUserId: this.data.artifactUserId
            },
            success(res){
               console.log("点赞",res);
               if(res.data.status == 200){
                  that.closeOpt();
                  wx.request({
                     url: app.globalData.baseUrl + app.globalData.getMedalLikeDataByUserIdAndArtifactsId,
                     data: {
                        artifactId: that.data.artifactId,
                        roleName: wx.getStorageSync("myRole"),
                        userId: wx.getStorageSync("myId")
                     },
                     method: "GET",
                     success(res) {
                        //未点赞
                        if (res.data.status == 500) {
                           that.setData({
                              zanModal: false
                           })
                           //已经点赞
                        } else if (res.data.status == 200) {
                           that.setData({
                              zanModal: true
                           })
                        }
                     }
                  })
                  $Toast({
                     content: '操作成功！',
                     type: "success",
                     duration: 2,
                     selector: "#toast"
                  });
               }else{
                  $Toast({
                     content: '操作失败！',
                     type: "error",
                     duration: 2,
                     selector: "#toast"
                  });
               }
            }
         })
      }else{
         $Toast({
            content: '需先登录才能操作！',
            type:"error",
            duration: 2,
            selector: "#toast"
         });
      }
   },
   /**
    * 打开菜单
    */
   openOpt() {
      var likeAnimation = wx.createAnimation({
         duration: 400,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      var commentAnimationData = wx.createAnimation({
         duration: 400,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      var scoreAnimationData = wx.createAnimation({
         duration: 400,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      likeAnimation.translate(10, -60).step();
      commentAnimationData.translate(-50, -50).step();
      scoreAnimationData.translate(-60, 10).step();
      this.setData({
         animationModal: "open",
         likeAnimationData: likeAnimation.export(),
         commentAnimationData: commentAnimationData.export(),
         scoreAnimationData: scoreAnimationData.export(),
      })
   },
   /**
    * 关闭菜单
    */
   closeOpt() {
      var likeAnimation = wx.createAnimation({
         duration: 400,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      var commentAnimationData = wx.createAnimation({
         duration: 400,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      var scoreAnimationData = wx.createAnimation({
         duration: 400,
         timingFunction: "linear",
         delay: 0,
         transformOrigin: "0 0 0"
      });
      likeAnimation.translate(0, 0).step();
      commentAnimationData.translate(0, 0).step();
      scoreAnimationData.translate(0, 0).step();
      this.setData({
         animationModal: "open",
         likeAnimationData: likeAnimation.export(),
         commentAnimationData: commentAnimationData.export(),
         scoreAnimationData: scoreAnimationData.export(),
      })
      this.setData({
         animationModal: "close"
      })
   },
   /*
      点击菜单评论按钮
    */
   openComment() {
      let that = this;
      this.setData({
         commentVisible: "show"
      })
      this.closeOpt();
      wx.request({
         url: app.globalData.baseUrl + app.globalData.findCommentsByArtifactIdWithPage,
         data:{
            limit:this.data.commentLimit,
            offset:this.data.commentOffset,
            artifactId: this.data.artifactId
         },
         success(res){
            if(res.data.status == 200){
               that.setData({
                  commentList:res.data.data.rows
               })
            }
         }
      })
   },
   closeComment() {
      this.setData({
         commentVisible: "hide"
      })
   },
   /**
    * 点击评论按钮弹出评论弹窗
    */
   whiteComment() {
      this.setData({
         commentVisible: "hide",
         commentEditVisible: true
      })
   },
   commentValueChange(event){
      this.setData({
         commentEditValue: event.detail.detail.value
      })
   },
   /**
    * 点击评论弹窗发表
    */
   submitComment() {
      let that = this;
      if (this.data.commentEditValue && wx.getStorageSync("openid")) {
         wx.request({
            url: app.globalData.baseUrl + app.globalData.createComment,
            data: {
               content: this.data.commentEditValue,
               commenterId: wx.getStorageSync("myId"),
               artifactId: this.data.artifactId
            },
            method: "POST",
            success(res) {
               if (res.status == 200) {
                  that.setData({
                     commentEditVisible: false
                  });
                  $Toast({
                     content: '评论成功！',
                     image: '/images/photo_2.jpg',
                     duration: 2,
                     selector: "#toast"
                  });
                  setTimeout(() => {
                     $Toast.hide();
                  }, 2000);
               }
            }
         })
      }else{
         $Toast({
            content: '请输入评论内容！',
            type: 'error',
            duration: 2,
            selector: "#toast"
         });
      }
   },
   /**
    * 点击评论弹窗取消
    */
   cancelComment() {
      this.setData({
         commentEditVisible: false
      })
   },
   // 打开打分菜单按钮
   creatScore() {
      this.setData({
         artifactScoreVisible: true
      })
      this.closeOpt();
   },
   artifactScoreValueChange(event){
      this.setData({
         artifactScoreValue: event.detail.detail.value
      })
   },
   closeScore(){
      this.setData({
         artifactScoreVisible: false
      });
   },
   /***
    * 点击分数保存
    */
   submitScore() {
      let that = this;
      if (this.data.vipRole && wx.getStorageSync("openid")){
         if (this.data.artifactScoreValue >= 0 && this.data.artifactScoreValue <= 100){
            wx.request({
               url: app.globalData.baseUrl + app.globalData.createScore,
               data: {
                  openid: wx.getStorageSync("openid"),
                  artifactId: this.data.artifactId,
                  score: this.data.artifactScoreValue
               },
               method: "POST",
               success(res) {
                  that.setData({
                     artifactScoreVisible: false
                  });
                  $Toast({
                     content: '打分成功！',
                     image: '/images/photo_2.jpg',
                     duration: 2,
                     selector: "#toast"
                  });
                  setTimeout(() => {
                     $Toast.hide();
                  }, 2000);
               }
            })
         }
      }else{
         $Toast({
            content: '无权限此操作',
            type: 'error',
            duration: 2,
            selector: "#toast"
         });
         this.setData({
            artifactScoreVisible: true
         });
      }
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
      let that = this;
      let artifactId = options.artifactId;
      this.setData({
         artifactId: options.artifactId
      })
      // 获取作业信息
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getArtifactById + artifactId,
         success(res) {
            if (res.data.status == 200) {
               that.setData({
                  artifactUserId: res.data.data.userId,
                  userAvatarUrl: res.data.data.user.avatarUrl,
                  userFullname: res.data.data.user.fullname,
                  artifactTitle: res.data.data.name,
                  createAt: res.data.data.createAt,
                  topicName: res.data.data.topics[0].name,
                  artifactDes: res.data.data.description,
                  artifact_assets: res.data.data.artifact_assets
               })
               if (res.data.data.artifact_scores.length){
                  that.setData({
                     artifactScores: res.data.data.artifact_scores[0].score
                  })
               }else{
                  that.setData({
                     artifactScores:""
                  })
               }
               let myRole = wx.getStorageSync("myRole");
               let myId = wx.getStorageSync("myId");
               if (myRole == 'vip' && myId == res.data.data.topics[0].userId) {
                  that.setData({
                     vipRole:true
                  })
               }
            }
         }
      })
      // 获取作品点赞参数
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getMedalLikeDataByUserIdAndArtifactsId,
         data: { 
            artifactId: this.data.artifactId,
            roleName: wx.getStorageSync("myRole"),
            userId:wx.getStorageSync("myId")
         },
         method:"GET",
         success(res){
            //未点赞
            if (res.data.status == 500){
               that.setData({
                  zanModal:false
               })
            //已经点赞
            } else if (res.data.status == 200){
               that.setData({
                  zanModal: true
               })
            }
         }
      })
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