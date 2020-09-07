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
    type: '',
    condition:'',
    product_count:0,
    work_info:null,
    pageNum:1,
    dataList:[],
    topicId:0,
  },
  methods: {
    loadData:function(){
      let that = this;
      $.ajax({
        url: '/website/topics/getTopicAndArtifactById',
        type: 'get',
        dataType: 'json',
        data: {
          limit: 10,
          offset: (that.pageNum - 1) * 10,
          topicId: that.topicId,
          score: 1,
        }
      })
      .done(function(responseData) {
        if(that.pageNum == 1){
          that.work_info = responseData.data.rows;
          that.product_count = responseData.data.count;
        }
        if(responseData.data.rows.artifacts.length > 0){
          that.dataList.push(...responseData.data.rows.artifacts);
        }else{
          that.pageNum = -1;
        }
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
    },
    cardClick:function(id){
      window.location.href = "/mobile/workdetail?artifactId=" + id;
    }
  },
  created() {
    this.topicId = getUrlKey('topicId');
    this.loadData();
    let that = this;
    window.onscroll = function(){
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
      //变量windowHeight是可视区的高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      //变量scrollHeight是滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
      //滚动条到底部的条件
      if(scrollHeight - (scrollTop + windowHeight) <= 50){
          //写后台加载数据的函数
          if(that.pageNum != -1){
            that.pageNum = that.pageNum + 1;
            that.loadData();
          }else{
            //无更多数据
          }
      }
    }
  }
})
