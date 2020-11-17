function getUrlKey(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{
    'header-menu': HeaderMenu,
  },
  data: {
    spin_show:false,
    dataList:[],
    pageNum:1,
    userId:-1,
    userInfo:{},
  },
  methods: {
    isWeixin () {
      let wx = navigator.userAgent.toLowerCase()
      if (wx.match(/micromessenger/i) === 'micromessenger') {
        return true
      } else {
        return false
      }
    },
    loadData:function(){
      let that = this;
      //that.spin_show = true;
      let url = "";
      if(this.userId == 0){
        url = "/website/artifacts/getPersonalJobH5"
      }
      else{
        url = "/website/artifacts/getPersonalJobByUserIdH5";
      }
      $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data: {
          limit: 10,
          offset: (that.pageNum - 1) * 10,
          userId: that.userId,
          jobTag: 0,
        }
      })
      .done(function(responseData) {
        if(responseData.data.rows.length > 0){
          that.dataList.push(...responseData.data.rows);
          that.userInfo = responseData.data.rows[0].user;
          if(that.userInfo.createAt){
              that.userInfo.createAt = that.userInfo.createAt.substring(0,10);
          }

        }else{
          that.pageNum = -1;
        }
      })
      .fail(function() {
        that.$Message.warning("操作失败!");
      })
      .always(function() {
        that.spin_show = false;
      });
    },
    cardClick:function(id){
      window.localStorage.setItem("fromDetailPath", window.location.pathname + window.location.search);
      window.location.href = "/mobile/workdetail?artifactId=" + id;
    }
  },
  created() {
    this.userId = getUrlKey('userId');

    let that = this;

    if(this.userId > 0){
      this.loadData();
    }
    else{
      this.$Message.warning("无该用户信息!");
      return;
    }

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
