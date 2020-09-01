new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{
    'header-menu': HeaderMenu,
  },
  data: {
    pageNum:1,
    dataList:[],
  },
  methods: {
      loadData:function(){
        let that = this;
        $.ajax({
          url: '/website/topics',
          type: 'get',
          dataType: 'json',
          data: {
            limit: 10,
            offset: (that.pageNum - 1) * 10,
            jobTag: 1,
            subLimit: 5,
            status: 1,
            userId: -1,
          }
        })
        .done(function(responseData) {
          if(responseData.data.rows.length > 0){
            that.dataList.push(...responseData.data.rows);
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
      }
  },
  created() {
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
      if(scrollTop+windowHeight==scrollHeight){
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
