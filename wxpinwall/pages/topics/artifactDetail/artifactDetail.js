const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      tabIndexNum:"2",
      vipRole: false,
      zanModal: false,

      //作品信息
      artifactUserId: "", //作品作者id
      userAvatarUrl: "",
      userFullname: "",
      teamworker:"",
      artifactScores: "",
      artifactTitle: "",
      createAt: "",
      topicName: "",
      artifactDes: "",
      artifact_assets: [],
      medalCount:"",
      likeCount:"",
      commentCount:"",
      //作品评论
      commentLimit: 10000,
      commentOffset: 0,
      artifactId: "",
      commentList: [],
      //新建评论
      commentVisible: false,
      commentEditValue: "",
      content: "",
      commenterId: "",
      //新建分数
      scoreFocus:false,
      artifactScoreVisible: false,
      artifactScoreValue: null,

      artifactInfoHeight:"",
      artifactAssetsPadding:""
   },
   // 返回
   tapBack(event){
      wx.navigateBack({
         data:1
      })
   },
   // 点击用户头像
   tapUserAvator(event){
      let userId = event.currentTarget.dataset.userId;
      wx.navigateTo({
         url: '/pages/topics/showreelDetail/showreelDetail' + "?userId=" + userId + "&jobTag=0",
      })
   },
   // 点赞
   creatLike() {
      let that = this;
      if (wx.getStorageSync("openid")) {
         wx.request({
            url: app.globalData.baseUrl + app.globalData.createLike,
            method: "POST",
            data: {
               roleName: wx.getStorageSync("myRole"),
               userId: wx.getStorageSync("myId"),
               artifactId: this.data.artifactId,
               artifactUserId: this.data.artifactUserId
            },
            success(res) {
               if (res.data.status == 200) {
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
                  wx.showToast({
                     title: '操作成功！',
                     icon:"success"
                  })
               } else {
                  wx.showToast({
                     title: '操作失败！',
                     icon:"none"
                  })
               }
            }
         })
      } else {
         wx.showToast({
            title: '需先登录才能操作！',
            icon: "none"
         })
      }
   },
   // 点击菜单评论按钮
   openComment() {
      if (wx.getStorageSync("openid")){
         let that = this;
         this.setData({
            commentVisible: true,
            artifactScoreVisible:false
         })
         wx.request({
            url: app.globalData.baseUrl + app.globalData.findCommentsByArtifactIdWithPage,
            data: {
               limit: this.data.commentLimit,
               offset: this.data.commentOffset,
               artifactId: this.data.artifactId
            },
            success(res) {
               if (res.data.status == 200) {
                  that.setData({
                     commentList: res.data.data.rows
                  })
               }
            }
         })
      }else{
         wx.showToast({
            title: '需先登录才能操作！',
            icon: "none"
         })
      }      
   },
   // 关闭评论框
   closeComment() {
      this.setData({
         commentVisible: false
      })
   },
   /**
    * 点击评论按钮弹出评论弹窗
    */
   whiteComment() {
      this.setData({
         commentVisible: false
      })
   },
   // 评论内容值变化
   commentValueChange(event) {
      this.setData({
         commentEditValue: event.detail.value
      })
   },
   /**
    * 点击评论发表
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
               if (res.data.status == 200) {
                  that.setData({
                     commentVisible: false,
                     commentEditValue:""
                  });
                  wx.showToast({
                     title: '评论成功！',
                     icon:"success"
                  })
               } else {
                  that.setData({
                     commentVisible: false
                  });
                  wx.showToast({
                     title: '评论失败！',
                     icon: "none"
                  })
               }
            }
         })
      } else if (wx.getStorageSync("openid") == "") {
         wx.showToast({
            title: '需先登录才能操作！',
            icon: "none"
         })
      } else {
         wx.showToast({
            title: '评论内容为空！',
            icon: "none"
         })
      }
   },
   // 打开打分菜单按钮
   creatScore() {
      if (wx.getStorageSync("openid")){
         this.setData({
            scoreFocus:true,
            artifactScoreVisible: true,
            commentVisible:false
         })
      }else{
         wx.showToast({
            title: '需先登录才能操作！',
            icon: "none"
         })
      }
   },
   // 分数值变化
   artifactScoreValueChange(event) {
      this.setData({
         artifactScoreValue: parseInt(event.detail.value)
      })
   },
   // 关闭分数框
   closeScore() {
      this.setData({
         artifactScoreVisible: false
      });
   },
   fileTap(event) {
      let mediaFileUrl = escape(event.currentTarget.dataset.mediaFile);
      wx.navigateTo({
         url: "/pages/topics/mediaFileDetail/mediaFileDetail?mediaFileUrl=" + mediaFileUrl
      })
   },
   /***
    * 点击分数保存
    */
   submitScore() {
      let that = this;
      if (this.data.vipRole && wx.getStorageSync("openid")) {
         if (this.data.artifactScoreValue >= 0 && this.data.artifactScoreValue <= 100) {
            wx.request({
               url: app.globalData.baseUrl + app.globalData.createScore,
               data: {
                  userId: wx.getStorageSync("myId"),
                  artifactId: this.data.artifactId,
                  score: this.data.artifactScoreValue
               },
               method: "POST",
               success(res) {
                  if (res.data.status == 200) {
                     that.setData({
                        artifactScoreVisible: false
                     });
                     wx.showToast({
                        title: '打分成功！',
                        icon: "success"
                     })
                     that.onShow();
                  } else {
                     wx.showToast({
                        title: '打分失败！',
                        icon: "none"
                     })
                  }

               }
            })
         }
      } else {
         wx.showToast({
            title: '打分失败！未登陆或者不是该作业荚创建者！',
            icon: "none"
         })
         this.setData({
            artifactScoreVisible: false
         });
      }
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
      let that = this;
      this.setData({
         artifactId: options.artifactId
      })
      if (app.globalData.statusBarHeight == 44) {
         that.setData({
            statusHeight: true
         })
      } else {
         that.setData({
            statusHeight: false
         })
      }
      wx.getSystemInfo({
         success: function(res) {
            that.setData({
               optTop:res.screenHeight/2 - 50
            })
         },
      })
   },
   onShow() {
      let that = this;
      // 获取作业信息
      wx.request({
         url: app.globalData.baseUrl + app.globalData.getArtifactById + this.data.artifactId,
         data:{
            role:wx.getStorageSync("myRole"),
            userId:wx.getStorageSync("myId")
         },
         success(res) {
            if (res.data.status == 200) {
               let teamworkerData = new Array();
               if (res.data.data.teamworker != "" && res.data.data.teamworker != null){
                  teamworkerData = JSON.parse(res.data.data.teamworker);
               }else{
                  teamworkerData = [];
               }
               that.setData({
                  artifactUserId: res.data.data.userId,
                  userAvatarUrl: res.data.data.user.avatarUrl,
                  userFullname: res.data.data.user.fullname,
                  artifactScores: res.data.data.artifact_scores,
                  artifactTitle: res.data.data.name,
                  createAt: res.data.data.createAt,
                  artifactDes: res.data.data.description,
                  artifact_assets: res.data.data.artifact_assets,
                  medalCount: res.data.data.medalCount,
                  likeCount: res.data.data.likeCount,
                  commentCount: res.data.data.commentCount
               })
               if (teamworkerData.length == 0) {
                  that.setData({
                     teamworker : ''
                  })
               } else {
                  for(let i=0;i<teamworkerData.length;i++){
                     that.setData({
                        teamworker: that.data.teamworker == "" ? that.data.teamworker + teamworkerData[i].fullname : that.data.teamworker + "," + teamworkerData[i].fullname
                     })
                  }
               }
               let query = wx.createSelectorQuery();
               query.select('#artifact').boundingClientRect();
               query.exec(function (res) {
                  let artifactDecH = res[0].height;
                  if (app.globalData.statusBarHeight == 44) {
                     that.setData({
                        artifactInfoHeight: 160 + artifactDecH,
                        artifactAssetsPadding: 200 + artifactDecH
                     })
                  } else {
                     that.setData({
                        artifactInfoHeight: 160 + artifactDecH,
                        artifactAssetsPadding: 180 + artifactDecH
                     })
                  }
               })
               
               if (res.data.data.topics.length) {
                  that.setData({
                     topicName: res.data.data.topics[0].name,
                  })
               } else {
                  that.setData({
                     topicName: res.data.data.user.fullname + "的作品集",
                  })
               }
               let myRole = wx.getStorageSync("myRole");
               let myId = wx.getStorageSync("myId");
               if (myRole == 'vip' && res.data.data.topics.length) {
                  if (myId == res.data.data.topics[0].userId) {
                     that.setData({
                        vipRole: true
                     })
                  }
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
   }
})