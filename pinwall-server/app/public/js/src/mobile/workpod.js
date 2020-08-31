new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{
    'header-menu': HeaderMenu,
  },
  data: {

    dataList:[],
  },
  methods: {

  },
  created() {
    let that = this;
    $.ajax({
      url: '/website/topics',
      type: 'get',
      dataType: 'json',
      data: {
        limit: 10,
        offset: 0,
        jobTag: 1,
        subLimit: 5,
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
