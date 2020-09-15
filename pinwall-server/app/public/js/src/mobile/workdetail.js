function getUrlKey(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{
    'header-menu': HeaderMenu,
  },
  data: {
    product:null,
    comments:null,
    medal:null,
    score:0,
    teamworker:"",
    shrink_or_grow:0,
    artifactId:0,
    comment_or_score:0,
    placeholder:"发表你的评论...",
    comment_or_score_value:'',
  },
  methods: {
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
          window.localStorage.setItem("detailPrePath",window.location.pathname + window.location.search);
        }
        window.location.href = '/mobile/login';
      }

    },
    sendResult:function(userId){
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
          }
          else{
            this.$Message.warning("操作失败!");
          }
        })
        .fail(function() {
          this.$Message.warning("操作失败!");
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
          this.$Message.warning("操作失败!");
        })
      }
    },
    maskClick:function(){
      $(".send_comment_area").css('visibility','hidden');
      $(".mask").hide();
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
          window.localStorage.setItem("detailPrePath",window.location.pathname + window.location.search);
        }
        window.location.href = '/mobile/login';
      }

    },
    shareClick:function(){
      $(".mask").show();
      $(".share_panel").show();
    },
    saveShareBtnClick:function(){
      $(".mask").hide();
      $(".share_panel").hide();
    }
  },
  created() {
    this.artifactId = getUrlKey('artifactId');

    let that = this;

    //获取评论信息
    $.ajax({
      url: '/wx/artifacts/findCommentsByArtifactIdWithPage',
      type: 'get',
      dataType: 'json',
      data: {
        limit: 10,
        offset: 0,
        artifactId: this.artifactId,
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

    //获取
    $.ajax({
      url: '/wx/artifacts/getMedalLikeDataByUserIdAndArtifactsId',
      type: 'get',
      dataType: 'json',
      data: {
        limit: 10,
        offset: 0,
        artifactId: this.artifactId,
      }
    })
    .done(function(responseData) {

    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  }
})
