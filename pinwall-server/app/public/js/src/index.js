var index = new Vue({
    el: '.index',
    data:function(){
        return{
            containerStyle:{
                width: "100%",
                height: "",
                margin:"",
                overflow: "hidden",
                position: "relative",
                background:"#EFEFEF"
            },
            screenType:"PC",
            drawerShow:false,
            dataList:[]
        }
    },
    methods:{
        tapArtifact(id){
            window.open("/project/" + id);
        },
        isWeixin() {
          let wx = navigator.userAgent.toLowerCase()
          if (wx.match(/MicroMessenger/i) === 'micromessenger') {
            return true
          } else {
            return false
          }
        },
        IsPC() {
          var userAgentInfo = navigator.userAgent;
          var Agents = ["Android", "iPhone",
                      "SymbianOS", "Windows Phone",
                      "iPad", "iPod"];
          var flag = true;
          for (var v = 0; v < Agents.length; v++) {
              if (userAgentInfo.indexOf(Agents[v]) > 0) {
                  flag = false;
                  break;
              }
          }
          return flag;
      }
    },
    created:function(){
        this.$Loading.start();
        if(this.isWeixin() || !this.IsPC()){
          window.location.href = '/mobile';
          return;
        }

        if(document.documentElement.clientWidth < 450){
            this.containerStyle.height = 1190 + "px";
            this.screenType = "mobile";
        }else{
            this.containerStyle.margin = (document.documentElement.clientHeight - 100 - 460 - 50 ) / 2 + "px auto";
            this.containerStyle.height = 500 + "px";
            this.screenType = "PC";
        }
        var that = this;
        isChorme(this);
        this.$http({
            url: config.ajaxUrls.getIndexData,
            method:"GET",
            params:{
                num:12
            }
        }).then(function(res){
            if (res.status == 200) {
                that.$Loading.finish();
                that.dataList = res.body;
                for(var i=0; i < that.dataList.length; i++){
                    that.dataList[i].createAt = that.dataList[i].createAt.split("T")[0];
                }
            }
        },function(err){
            that.$Loading.error();
        })
    }
})
function isChorme(that){
	if(navigator.userAgent.toLowerCase().indexOf("chrome") == -1 && navigator.userAgent.toLowerCase().indexOf("firefox") == -1){
		that.$Message.error({content:"为了有更好的使用体验，推荐使用谷歌或者火狐浏览器！",closable:true,duration:0});
	}
}
