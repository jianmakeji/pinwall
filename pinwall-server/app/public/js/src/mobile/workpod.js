var contentVue = new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{
    'header-menu': HeaderMenu,
  },
  data: {
    pageNum:1,
    dataList:[],
    status:0,
    userId:-1,
    spin_show:false,
  },
  methods: {
      workpodCardClick:function(topicId){
        window.location.href = "/mobile/workpoddetail?topicId=" +  topicId;
      },
      allBtnClick:function(){
        $("#all_btn").removeClass('condition_btn_noraml');
        $("#all_btn").addClass('condition_btn_selected');
        $("#open_btn").removeClass('condition_btn_selected');
        $("#open_btn").addClass('condition_btn_noraml');
        $("#save_btn").removeClass('condition_btn_selected');
        $("#save_btn").addClass('condition_btn_noraml');
        $("#create_by_me_btn").removeClass('condition_btn_selected');
        $("#create_by_me_btn").addClass('condition_btn_noraml');
        this.status = -1;
        this.pageNum = 1;
        this.dataList = [];
        this.userId = -1;
        this.loadData();
      },
      openBtnClick:function(){
        $("#open_btn").removeClass('condition_btn_noraml');
        $("#open_btn").addClass('condition_btn_selected');
        $("#all_btn").removeClass('condition_btn_selected');
        $("#all_btn").addClass('condition_btn_noraml');
        $("#save_btn").removeClass('condition_btn_selected');
        $("#save_btn").addClass('condition_btn_noraml');
        $("#create_by_me_btn").removeClass('condition_btn_selected');
        $("#create_by_me_btn").addClass('condition_btn_noraml');
        this.status = 0;
        this.pageNum = 1;
        this.dataList = [];
        this.userId = -1;
        this.loadData();
      },
      saveBtnClick:function(){
        $("#open_btn").removeClass('condition_btn_selected');
        $("#open_btn").addClass('condition_btn_noraml');
        $("#all_btn").removeClass('condition_btn_selected');
        $("#all_btn").addClass('condition_btn_noraml');
        $("#save_btn").removeClass('condition_btn_noraml');
        $("#save_btn").addClass('condition_btn_selected');
        $("#create_by_me_btn").removeClass('condition_btn_selected');
        $("#create_by_me_btn").addClass('condition_btn_noraml');
        this.status = 1;
        this.pageNum = 1;
        this.dataList = [];
        this.userId = -1;
        this.loadData();
      },
      createByMeBtnClick:function(){
        $("#open_btn").removeClass('condition_btn_selected');
        $("#open_btn").addClass('condition_btn_noraml');
        $("#all_btn").removeClass('condition_btn_selected');
        $("#all_btn").addClass('condition_btn_noraml');
        $("#save_btn").removeClass('condition_btn_selected');
        $("#save_btn").addClass('condition_btn_noraml');
        $("#create_by_me_btn").removeClass('condition_btn_noraml');
        $("#create_by_me_btn").addClass('condition_btn_selected');
        this.status = 2;
        this.pageNum = 1;
        this.dataList = [];
        this.userId = 0;
        this.loadData();
      },
      loadData:function(){
        let that = this;
        this.spin_show = true;
        $.ajax({
          url: '/website/topics',
          type: 'get',
          dataType: 'json',
          data: {
            limit: 10,
            offset: (that.pageNum - 1) * 10,
            jobTag: 1,
            subLimit: 5,
            status: that.status,
            userId: that.userId,
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
          that.$Message.warning("操作失败!");
        })
        .always(function() {
          that.spin_show = false;
        });
      },
      artifactClick:function(id){
        window.location.href = "/mobile/workdetail?artifactId=" + id;
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
