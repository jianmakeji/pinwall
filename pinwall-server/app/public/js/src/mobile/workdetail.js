function getUrlKey(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{

  },
  data: {
    product:null,
    comments:null,
    medal:null,
    score:0,
    teamworker:"",
    spin_show:false,
    shrink_or_grow:0,
    artifactId:0,
    comment_or_score:0,
    placeholder:"发表你的评论...",
    comment_or_score_value:'',
    showmore:0,
    show_model:false,
  },
  methods: {
    isWeixin() {
      let wx = navigator.userAgent.toLowerCase()
      if (wx.match(/micromessenger/)) {
        return true
      } else {
        return false
      }
    },
    moreClick:function(){
      if(this.shrink_or_grow == 1){
        $('.like').removeClass('like_grow');
        $('.medal').removeClass('medal_grow');
        $('.score').removeClass('score_grow');
        $('.comment').removeClass('comment_grow');
        $('.share').removeClass('share_grow');
        $('.more').removeClass('more_grow');
        $('.like').addClass('like_shrink');
        $('.medal').addClass('medal_shrink');
        $('.score').addClass('score_shrink');
        $('.comment').addClass('comment_shrink');
        $('.share').addClass('share_shrink');
        $('.more').addClass('more_shrink');
        this.shrink_or_grow = 0;
      }else{
        $('.like').removeClass('like_shrink');
        $('.medal').removeClass('medal_shrink');
        $('.score').removeClass('score_shrink');
        $('.comment').removeClass('comment_shrink');
        $('.share').removeClass('share_shrink');
        $('.more').removeClass('more_shrink');
        $('.like').addClass('like_grow');
        $('.medal').addClass('medal_grow');
        $('.score').addClass('score_grow');
        $('.comment').addClass('comment_grow');
        $('.share').addClass('share_grow');
        $('.more').addClass('more_grow');
        this.shrink_or_grow = 1;
      }
    },
    commentClick:function(){
      let userId = $(".mask").attr('id');
      if(userId > 0){
        this.comment_or_score_value = '';
        this.comment_or_score = 1;
        this.placeholder = "发表你的评论...";
        $(".send_comment_area").css('visibility','visible');
        $(".comment_input").focus();
        $(".mask").show();
      }
      else{
        if(window.localStorage){
          window.localStorage.setItem("loginPrePath",window.location.pathname + window.location.search);
        }
        window.location.href = '/mobile/login';
      }

    },
    sendResult:function(userId){
      let that = this;
      if(that.comment_or_score_value == ''){
        this.$Message.warning("请填写内容!");
        return;
      }
      if(this.comment_or_score == 1){
        let that = this;
        $.ajax({
          url: '/website/artifactComment',
          type: 'post',
          dataType: 'json',
          data: {
            content: that.comment_or_score_value,
            commenterId: userId,
            artifactId: that.artifactId,
          }
        })
        .done(function(responseData) {
          if(responseData.status == 200){
            $(".send_comment_area").css('visibility','hidden');
            $(".mask").hide();
            window.location.reload();
          }
          else{
            that.$Message.warning("操作失败!");
          }
        })
        .fail(function() {
          that.$Message.warning("操作失败!");
        })
      }
      else if (this.comment_or_score == 2){
        let that = this;
        $.ajax({
          url: '/website/artifactScores',
          type: 'post',
          dataType: 'json',
          data: {
            content: that.comment_or_score_value,
            scorerId: userId,
            artifactId: that.artifactId,
          }
        })
        .done(function(responseData) {
          if(responseData.status == 200){
            $(".send_comment_area").css('visibility','hidden');
            $(".mask").hide();
          }
        })
        .fail(function() {
          that.$Message.warning("操作失败!");
        })
      }
    },
    maskClick:function(){
      $(".send_comment_area").css('visibility','hidden');
      $(".mask").hide();
      $(".share_panel").hide();
    },
    scoreClick:function(){
      let userId = $(".mask").attr('id');
      if(userId > 0){
        this.comment_or_score_value = '';
        this.comment_or_score = 2;
        this.placeholder = "请输入分数...";
        $(".send_comment_area").css('visibility','visible');
        $(".comment_input").focus();
        $(".mask").show();
      }
      else{
        if(window.localStorage){
          window.localStorage.setItem("loginPrePath",window.location.pathname + window.location.search);
        }
        window.location.href = '/mobile/login';
      }
    },
    medalClick:function(){
      let that = this;
      let userId = $(".mask").attr('id');
      let artifactUserId = $(".author").attr('id');
      if(userId > 0){
        $.ajax({
          url: '/website/artifactMedalLike',
          type: 'post',
          dataType: 'json',
          data: {
            artifactUserId: artifactUserId,
            artifactId: this.artifactId,
          }
        })
        .done(function(responseData) {
          if(responseData.status == 200){
            that.$Message.success(responseData.data);
            document.location.reload();
          }
          else{
            that.$Message.warning(responseData.data);
          }
        })
        .fail(function() {
          that.$Message.warning("操作失败!");
        })
        .always(function() {

        });
      }
      else{
        if(window.localStorage){
          window.localStorage.setItem("loginPrePath",window.location.pathname + window.location.search);
        }
        window.location.href = '/mobile/login';
      }
    },
    likeClick:function(){
      let that = this;
      let userId = $(".mask").attr('id');
      let artifactUserId = $(".author").attr('id');
      if(userId > 0){
        $.ajax({
          url: '/website/artifactMedalLike',
          type: 'post',
          dataType: 'json',
          data: {
            artifactUserId: artifactUserId,
            artifactId: this.artifactId,
          }
        })
        .done(function(responseData) {
          if(responseData.status == 200){
            that.$Message.success(responseData.data);
            document.location.reload();
          }
          else{
            that.$Message.warning(responseData.data);
          }
        })
        .fail(function() {
          that.$Message.warning("操作失败!");
        })
        .always(function() {
          console.log("complete");
        });
      }
      else{
        if(window.localStorage){
          window.localStorage.setItem("loginPrePath",window.location.pathname + window.location.search);
        }
        window.location.href = '/mobile/login';
      }
    },
    shareClick:function(){
      let that = this;
      if(this.isWeixin()){
        that.$Message.success('请点击右上角进行分享!');
      }
      else{
        $(".mask").show();
        $(".share_panel").show();
        $(".share_img").attr('src','/wx/share/createShareImage/' + this.artifactId);
        this.spin_show = true;
        let that = this;
        $("#share_img").load(function(){
          that.spin_show = false;
        });
      }
    },
    saveShareBtnClick:function(){
      $(".mask").hide();
      $(".share_panel").hide();

      saveAs('/wx/share/createShareImage/' + this.artifactId, 'image.png');
    },
    fullnameClick:function(userId){
      window.location.href = "/mobile/workset?userId=" + userId;
    },
    backClick:function(){
      let path = window.localStorage.getItem("fromDetailPath");

      if(path){
        window.location.href = path;
      }
      else{
        window.history.back(-1);
      }

    },
    topicClick:function(topicId){
      window.location.href = "/mobile/workpoddetail?topicId=" + topicId;
    },
    randomString:function(len){
      len = len || 32;
  　　var $chars = 'abcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
 　   var maxPos = $chars.length;
  　　 var str = '';
  　　for (i = 0; i < len; i++) {
      str += $chars.charAt(Math.floor(Math.random() * maxPos));
  　　}
 　　return str;
    },
    moreClick:function(){
      this.show_model = true;
    }
  },
  mounted() {
    let that = this;
    let timestamp = new Date().getTime();
    if(timestamp.toString().length > 10){
      timestamp = timestamp.toString().substring(0,10);
    }
    let nonceStr = this.randomString(12);
    $.ajax({
      url: '/wx/share/getSingnature',
      type: 'get',
      dataType: 'json',
      data: {
        noncestr: nonceStr,
        timestamp: timestamp,
        Id: that.artifactId,
      }
    })
    .done(function(responseData) {
      if(responseData.status == 200){
        wx.config({
          debug: false,
          appId: 'wx72c619c97837ad21',
          timestamp: timestamp,
          nonceStr: nonceStr,
          signature: responseData.data,// 必填，签名
          jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
        });
        let link = 'https://pinwall.cn/mobile/workdetail?artifactId=' + that.artifactId;
        let imgUrl = $('#thumbUrl').text();
        let title = $('.title').text();
        wx.ready(function(){
          wx.onMenuShareTimeline({
            title: title,
            link: link,
            imgUrl: imgUrl, // 分享图标
            success: function () {
              that.$Message.success('分享成功!');
            }
          });
          wx.onMenuShareAppMessage({
            title:title,
            link: link,
            imgUrl: imgUrl, // 分享图标
            success: function () {
                that.$Message.success('分享成功!');
            },
            cancel: function () {
            }
           });
        });
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

    var rowNum = Math.round($(".introduce").height()/parseFloat($(".introduce").css('line-height')));

    if(rowNum == 3){
      this.showmore = 1;
      let charCount = Math.round((document.body.clientWidth - 20) / 14) * 3;
      let description = $(".introduce").text();
      let temp = description.substring(0,charCount);
      var p = /[0-9a-z]/i;
      let count = 0;
      for (let i = 0; i < temp.length; i++){
        if(p.test(temp[i])){
          count++
        }
      }
      if(description.length > (charCount + (count /3))){
         $(".introduce").text(description.substring(0, (charCount + count / 3)));
      }
    }
  },
  created() {
    this.artifactId = getUrlKey('artifactId');
    let userId = $(".mask").attr('id');
    let artifactUserId = $(".author").attr('id');

    let that = this;

    //获取评论信息
    $.ajax({
      url: '/wx/artifacts/findCommentsByArtifactIdWithPage',
      type: 'get',
      dataType: 'json',
      data: {
        limit: 10,
        offset: 0,
        artifactId: that.artifactId,
      }
    })
    .done(function(responseData) {
      that.comments = responseData.data;
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

    //查看是否已经点赞

    if(userId > 0){
      $.ajax({
        url: '/website/artifactMedalLike/getMedalLikeDataByUserIdAndArtifactsId',
        type: 'get',
        dataType: 'json',
        data: {
          artifactId: this.artifactId,
        }
      })
      .done(function(responseData) {
        if(responseData.status == 200){
          //已经点赞
          if($('.medal').length > 0){
            $('.medal').css('background-image','url(/public/images/mobile/medal_white.png)');
            $('.medal').css('background-color','#07BC72');
          }
          else{
            $('.like').css('background-image','url(/public/images/mobile/like.png)');
            $('.like').css('background-color','#07BC72');
          }
        }
        else{
          //未点赞
          if($('.medal').length > 0){
            $('.medal').css('background-image','url(/public/images/mobile/medal_white_transparent.png)');
            $('.medal').css('background-color','#FFFFFF');
          }
          else{
            $('.like').css('background-image','url(/public/images/mobile/like_select.png)');
            $('.like').css('background-color','#FFFFFF');
          }
        }
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
    }


  }
})
