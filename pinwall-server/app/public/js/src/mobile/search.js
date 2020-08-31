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
  },
  methods: {
    searchBtnClick:function(){
      this.search_panel_show = 0;
      this.user_result_show = 1;
    }
  },
  created() {
    let that = this;
    $.ajax({
      url: '',
      type: 'get',
      dataType: 'json',
      data: {
        limit: 10,
        offset: 0,
        status: 1,
        userId: -1,
      }
    })
    .done(function(responseData) {
      that.dataList = responseData.data.rows;
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  }
})
