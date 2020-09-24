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
    userObject:{},
    artifactsList:[],
    artifactsCount:0,
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
      window.localStorage.setItem("search_type",this.type);
      window.localStorage.setItem("search_condition",this.condition);
      window.localStorage.setItem("search_tag",1);
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
        url = "/website/artifacts/getPersonalJobByFullname";
        data.fullname = this.condition;
        data.limit = 1000;
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
        }
        else if(that.type == 'product'){
          that.productArray = responseData.data.hits;
        }
        else if(that.type == 'user'){
          that.userObject = responseData.data.user;
          that.artifactsList = responseData.data.artifacts.rows;
          that.artifactsCount = responseData.data.artifacts.count;
        }
      })
      .fail(function() {
        this.$Message.warning('查找失败！');
      })
      .always(function() {
        console.log("complete");
      });
    },
    searchClose:function(){
      if(this.type == 'course'){
        this.search_panel_show = 1;
        this.workset_result_show = 0;
      }else if (this.type == 'product'){
        this.search_panel_show = 1;
        this.product_result_show = 0;
      }else if (this.type == 'user'){
        this.search_panel_show = 1;
        this.user_result_show = 0;
      }
      window.localStorage.setItem("search_type", '');
      window.localStorage.setItem("search_condition", '');
      window.localStorage.setItem("search_tag", 0);
    },
    selectOption:function(){
      this.condition = "";
    }
  },
  created() {
    let search_tag = window.localStorage.getItem("search_tag");
    if(search_tag){
      window.localStorage.setItem("search_tag",1);
      let search_type = window.localStorage.getItem("search_type");
      let search_condition = window.localStorage.getItem("search_condition");
      this.type = search_type;
      this.condition = search_condition;
      this.searchBtnClick();
    }


  }
})
