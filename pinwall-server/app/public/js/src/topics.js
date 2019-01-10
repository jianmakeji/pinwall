var index = new Vue({
    el: '.index',
    data(){
        return{
            // 数据请求
            aoData:{limit:10,jobTag:1,offset:0,status:-1,userId:-1},
            dataList:[],
            scrollModel:true,
            searchValue:"",
            containerStyle:{
                minHeight:""
            },
            checkAllType:"default",
            checkOpenType:"text",
            checkCloseType:"text",
            checkMyType:"text",
            dataList:[],
            //右侧抽屉
            drawerShow:false

        }
    },
    methods: {
        checkAll(){
            this.checkAllType = "default";
            this.checkOpenType = "text";
            this.checkCloseType = "text";
            this.checkMyType = "text";

            let that = this;
            this.aoData.status = -1;
            this.aoData.userId = -1;
            this.aoData.offset = 0;
            getData(this, this.aoData);
        },
        checkOpen(){
            this.checkAllType = "text";
            this.checkOpenType = "default";
            this.checkCloseType = "text";
            this.checkMyType = "text";
            let that = this;
            this.aoData.status = 0;
            this.aoData.userId = -1;
            this.aoData.offset = 0;
            getData(this, this.aoData);
        },
        checkClose(){
            this.checkAllType = "text";
            this.checkOpenType = "text";
            this.checkCloseType = "default";
            this.checkMyType = "text";

            let that = this;
            this.aoData.status = 1;
            this.aoData.userId = -1;
            this.aoData.offset = 0;
            getData(this, this.aoData);
        },
        /**
         * 由我创建
         * @return {[type]} [description]
         */
        checkMy(){
            this.checkAllType = "text";
            this.checkOpenType = "text";
            this.checkCloseType = "text";
            this.checkMyType = "default";

            let that = this;
            this.aoData.status = -1;
            this.aoData.userId = 0;
            this.aoData.offset = 0;
            getData(this, this.aoData);
        },
        /**
         * [checkThisTopic 查看该作业荚]
         */
        checkThisTopic(id){
            window.location.href = config.viewUrl.workFolder.replace(":id",id);
        },
        /**
         * [uploadToTopic 上传作品至该作业荚]
         */
        uploadToTopic(id){
            window.location.href = config.viewUrl.uploadWork.replace(":id",id);
        },
        /**
         * 锁定该作业荚
         */
        cockThisTopic(id){

        },
        /**
         * [searchData 设置作业荚]
         */
        settingThisTopic(id){
            window.location.href = config.viewUrl.uploadWork.replace(":id",id);
        },
    },
    created(){
        let that = this;
        //老师点击我的作业荚
        let myTopics = new String();
        if (window.location.href.split("?")[1]) {
            myTopics = window.location.href.split("=")[1];
            this.aoData.userId = 0;
            this.checkAllType = "text";
            this.checkOpenType = "text";
            this.checkCloseType = "text";
            this.checkMyType = "default";
        }

        getData(this, this.aoData);
    }
})

$(document).ready(function() {
    //每次刷新界面滚动条置顶
    $('html,body').animate({scrollTop:0});
    /**
     * 滚动条滚动监听
     */
    $(window).scroll(function() {
        if ($(document).scrollTop() >= $(document).height() - $(window).height() && index.scrollModel) {
            index.aoData.offset += 10;
            index.$Loading.start();
            index.$http({
                url: config.ajaxUrls.getTopicAboutData,
                method:"GET",
                params:index.aoData
            }).then(function(res){
                if( res.body.status == 200){
                    index.$Loading.finish();
                    index.dataList = index.dataList.concat(res.body.data.rows);
                    if (index.dataList.length == res.body.data.count) {
                        index.scrollModel = false;
                    }else{
                        index.scrollModel = true;
                    }
                    for(let i=0; i < index.dataList.length; i++){
                        index.dataList[i].createAt = index.dataList[i].createAt.replace("T"," ").replace("000Z","创建");
                        if(index.dataList[i].user.avatarUrl == null){
                            index.dataList[i].user.avatarUrl = config.default_profile;
                        }
                    }
                }
            },function(err){
                index.$Loading.error();
            })
        }
    })
});

function getData(that, aoData){
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.getTopicAboutData,
        method:"GET",
        params:aoData
    }).then(function(res){
        if( res.body.status == 200){
            that.$Loading.finish();
            that.dataList = res.body.data.rows;
            if (that.dataList.length == res.body.data.count) {
                that.scrollModel = false;
            }else{
                that.scrollModel = true;
            }
            for(let i=0; i < that.dataList.length; i++){
                that.dataList[i].createAt = that.dataList[i].createAt.replace("T"," ").replace("000Z","创建");
                if(that.dataList[i].user.avatarUrl == null){
                    that.dataList[i].user.avatarUrl = config.default_profile;
                }
            }
        }
    },function(err){
        that.$Loading.error();
    })
}
