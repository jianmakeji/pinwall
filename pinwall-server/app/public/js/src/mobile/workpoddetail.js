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
  },
  methods: {
    searchBtnClick:function(){

    }
  },
  created() {
    let that = this;
    $.ajax({
      url: '/website/topics/getTopicAndArtifactById',
      type: 'get',
      dataType: 'json',
      data: {
        limit: 10,
        offset: 0,
        topicId: 747,
        score: 1,
      }
    })
    .done(function(responseData) {
      if(responseData.success == true){
        that.product_count = responseData.data.count;
        that.work_info = responseData.data.rows;
      }else{

      }

    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  }
})
