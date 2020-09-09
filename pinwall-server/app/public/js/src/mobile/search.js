new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{
    'header-menu': HeaderMenu,
  },
  data: {
    dataList:[],
    type: '',
    condition:'',
    search_panel_show:1,
    user_result_show:0,
    product_result_show:0,
    workset_result_show:0,
    pageNum:1,
    limit:10,
    productArray:[],
  },
  methods: {
    searchBtnClick:function(){
      if(this.condition != ''){
        if(this.type != ''){
          if(this.type == 'course'){
            this.search_panel_show = 0;
            this.workset_result_show = 1;
          }else if (this.type == 'product'){
            this.search_panel_show = 0;
            this.product_result_show = 1;
          }else if (this.type == 'user'){
            this.search_panel_show = 0;
            this.user_result_show = 1;
          }
          this.pageNum = 1;
          this.loadData();
        }else{
          this.$Message.warning('请选择搜索类别！');
        }
      }else{
        this.$Message.warning('请输入关键词！');
      }
    },
    workpodCardClick:function(topicId){
      window.location.href = "/mobile/workpoddetail?topicId=" +  topicId;
    },
    artifactClick:function(id){
      window.location.href = "/mobile/workdetail?artifactId=" + id;
    },
    loadData:function(){
      let data = {
        limit: this.limit,
        offset: (this.pageNum - 1) * this.limit,
      }
      let url = '/website/search/searchByKeywords';

      if(this.type == 'course'){
        data.jobTag = 1;
        data.subLimit = 5;
        data.status = -1;
        data.userId = -1;
        data.keyword = this.condition;
        url = '/wx/topics/searchByTopicName';
      }else if(this.type == 'product'){
        data.jobTag = 1;
        data.subLimit = 5;
        data.status = -1;
        data.userId = -1;
        data.keyword = this.condition;
        url = '/website/search/searchByKeywords';
      }else if(this.type == 'user'){
        url = "/wx/users/findByFullname";
        data.fullname = this.condition;
        this.limit = 50;
        data.offset = (this.pageNum - 1) * this.limit;
      }

      let that = this;
      $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data: data
      })
      .done(function(responseData) {
        if(that.type == 'course'){
          that.dataList = responseData.data.rows;
        }else if(that.type == 'product'){
          that.productArray = responseData.data.hits;
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


  }
})
