var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                width: "100%",
                height: "500px",
                marginTop:"",
                overflow: "hidden",
                position: "relative",
            },
            drawerShow:false,
            dataList:[]
        }
    },
    methods: {

    },
    created(){
        this.$Loading.start();
        this.containerStyle.marginTop = (document.documentElement.clientHeight - 100 - 500 - 50 ) / 2 + "px";

        var that = this;
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
                for(let i=0; i < that.dataList.length; i++){
                    that.dataList[i].createAt = that.dataList[i].createAt.split("T")[0];
                }
            }
        },function(err){
            that.$Loading.error();
        })
    }
})
