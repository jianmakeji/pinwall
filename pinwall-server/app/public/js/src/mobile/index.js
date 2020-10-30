
new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{
    'header-menu': HeaderMenu,
  },
  data: {
    spin_show:false,
    dataList:[],
  },
  methods: {
    cardClick:function(id){
      window.localStorage.setItem("fromDetailPath", window.location.pathname + window.location.search);
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
    this.spin_show = true;
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
      that.$Message.warning("操作失败!");
    })
    .always(function() {
      that.spin_show = false;
    });

  }
})
