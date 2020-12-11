new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{
    'header-menu': HeaderMenu,
  },
  data: {
    dataList:[],
    type: 'product',
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
    searchInputClick:function(){
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
    tagClick:function(tagValue){
      this.type = 'product';
      this.pageNum = 1;
      this.condition = tagValue;
      this.search_panel_show = 0;
      this.product_result_show = 1;
      this.loadData();
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
          if(responseData.data.rows.length > 0){
            that.dataList.push(...responseData.data.rows);
          }else{
            that.pageNum = -1;
          }
        }
        else if(that.type == 'product'){
          if(responseData.data.hits.length > 0){
            that.productArray.push(...responseData.data.hits);
          }
          else{
            that.pageNum = -1;
          }
        }
        else if(that.type == 'user'){
          if(responseData.data.artifacts.rows.length > 0){
            that.userObject = responseData.data.user;
            that.artifactsList.push(...responseData.data.artifacts.rows);
            that.artifactsCount = responseData.data.artifacts.count;
          }
          else{
            that.pageNum = -1;
          }

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
      //this.condition = "";
    },

  },
  created() {
    let search_tag = window.localStorage.getItem("search_tag");

    if(search_tag != 0){
      window.localStorage.setItem("search_tag",1);
      let search_type = window.localStorage.getItem("search_type");
      let search_condition = window.localStorage.getItem("search_condition");
      this.type = search_type;
      this.condition = search_condition;
      this.searchInputClick();
    }

    let that = this;
    window.onscroll = function(){
      var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
      if(scrollTop+windowHeight==scrollHeight){
          if(that.pageNum != -1){
            that.pageNum = that.pageNum + 1;
            that.loadData();
          }else{
            that.$Message.warning("无更多数据!");
          }
      }
    }
  }
})
