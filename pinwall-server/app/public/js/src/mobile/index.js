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
    cardClick:function(id){
      window.location.href = "/mobile/workdetail?artifactId=" + id;
    }
  },
  created() {
    if(window.localStorage){
      let loginPrePath = window.localStorage.getItem("loginPrePath");
      if (loginPrePath && loginPrePath != ''){
        window.localStorage.setItem("loginPrePath",'');
        window.location.href = loginPrePath;
      }
    }
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
