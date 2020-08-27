new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  data: {
    dataList:[],
  },
  methods: {

  },
  created() {
    let that = this;
    $.ajax({
      url: '/website/artifacts/getMedalDataByRandom/12',
      type: 'get',
      dataType: 'json',
      data: {}
    })
    .done(function(responseData) {
      that.dataList = responseData;
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  }
})
