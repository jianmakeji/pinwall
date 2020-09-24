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
  },
  methods: {
    isWeixin () {
      let wx = navigator.userAgent.toLowerCase()
      if (wx.match(/MicroMessenger/i) === 'micromessenger') {
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
      $(".mask").show();
      $(".share_panel").show();
      $(".share_img").attr('src','/wx/share/createShareImage/' + this.artifactId);
      this.spin_show = true;
      let that = this;
      $("#share_img").load(function(){
        that.spin_show = false;
      });
    },
    saveShareBtnClick:function(){
      $(".mask").hide();
      $(".share_panel").hide();

      var eleLink = document.createElement('a');
      eleLink.download = this.artifactId;
      eleLink.style.display = 'none';
      var canvas = document.createElement('canvas');
      canvas.width = 520;
      canvas.height = 820;
      var context = canvas.getContext('2d');
      var img = document.getElementById("share_img");
      context.drawImage(img, 0, 0, 520, 820);
      eleLink.href = canvas.toDataURL('image/png');
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);

    },
    fullnameClick:function(userId){
      window.location.href = "/mobile/workset?userId=" + userId;
    },
    backClick:function(){
      window.history.back(-1);
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
