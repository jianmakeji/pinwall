new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{

  },
  data: {
    pwd1:'',
    pwd2:'',
  },
  methods: {

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
