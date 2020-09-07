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
  },
  methods: {
    moreClick:function(){
      if(this.shrink_or_grow == 1){
        $('.medal').removeClass('medal_grow');
        $('.score').removeClass('score_grow');
        $('.comment').removeClass('comment_grow');
        $('.share').removeClass('share_grow');
        $('.more').removeClass('more_grow');
        $('.medal').addClass('medal_shrink');
        $('.score').addClass('score_shrink');
        $('.comment').addClass('comment_shrink');
        $('.share').addClass('share_shrink');
        $('.more').addClass('more_shrink');
        this.shrink_or_grow = 0;
      }else{
        $('.medal').removeClass('medal_shrink');
        $('.score').removeClass('score_shrink');
        $('.comment').removeClass('comment_shrink');
        $('.share').removeClass('share_shrink');
        $('.more').removeClass('more_shrink');
        $('.medal').addClass('medal_grow');
        $('.score').addClass('score_grow');
        $('.comment').addClass('comment_grow');
        $('.share').addClass('share_grow');
        $('.more').addClass('more_grow');
        this.shrink_or_grow = 1;
      }
    },
    commentClick:function(){
      $(".send_comment_area").css('visibility','visible');
      $(".comment_input").focus();
      $(".mask").show();
    },
    sendComment:function(){
      $(".send_comment_area").css('visibility','hidden');
      $(".mask").hide();
    }

  },
  created() {
    this.artifactId = getUrlKey('artifactId');

    let that = this;
    //获取作品信息
    $.ajax({
      url: '/wx/artifacts/getArtifactById/' + this.artifactId,
      type: 'get',
      dataType: 'json',

    })
    .done(function(responseData) {
      that.product = responseData.data;
      if( that.product.teamworker !='' && that.product.teamworker != null){
        let teamworkerArray = JSON.parse(that.product.teamworker);
        teamworkerArray.forEach((elem)=>{
          that.teamworker = that.teamworker + elem.fullname + ',';
        });
      }
      if(that.product.artifact_scores.length > 0)
      that.score = that.product.artifact_scores[0].score;
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

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
