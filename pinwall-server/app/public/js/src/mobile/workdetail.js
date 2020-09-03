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
  },
  methods: {

  },
  created() {
    let that = this;
    //获取作品信息
    $.ajax({
      url: '/wx/artifacts/getArtifactById/25645',
      type: 'get',
      dataType: 'json',

    })
    .done(function(responseData) {
      that.product = responseData.data;
      if( that.product.teamworker !=''){
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
        artifactId: 33918,
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
        artifactId: 25645,
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
