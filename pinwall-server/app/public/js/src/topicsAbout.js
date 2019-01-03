var index = new Vue({
    el: '.index',
    data(){
        return{
            // 选择按键显示类型
            checkAllType:"default",
            checkOpenType:"text",
            checkCloseType:"text",
            checkMyType:"text",
            containerStyle:{
                minHeight:""
            },
            // 数据请求
            aoData:{limit:10,jobTag:2,offset:0,status:-1,userId:-1},
            dataList:[],
            scrollModel:true,
            //右侧抽屉
            drawerShow:false,
            searchValue:""          //搜索值
        }
    },
    methods: {
        /**
         * [checkAll 点击全部]
         * @return {[type]} [description]
         */
        checkAll(){
            console.log("checkAll");
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
        /**
         * [checkOpen 点击开放中]
         */
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
        /**
         * [checkOpen 点击已关闭]
         */
        checkClose(){
            console.log("checkClose");
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
         * [checkOpen 点击由我创建]
         */
        checkMy(){
            console.log("checkMy");
            this.checkAllType = "text";
            this.checkOpenType = "text";
            this.checkCloseType = "text";
            this.checkMyType = "default";
            this.aoData.status = -1;
            this.aoData.userId = 0;
            this.aoData.offset = 0;
            getData(this, this.aoData);
        },
        /**
         * [checkThisTopic 查看该作业荚]
         * @param  {[type]}  id [作业荚id]
         */
        checkThisTopic(id){
            window.location.href = "/workFolder/" + id;
        },
        /**
         * 锁定/解锁该作业荚
         */
        cockThisTopic(id){

        },
        /**
         * [uploadToTopic 上传作品至该作业荚]
         */
        uploadToTopic(id){
            console.log("uploadToTopic",id);
            window.location.href = "/uploadWork/1?topicId=" + id;
        },
        /**
         * [searchData 设置作业荚]
         * @return {[type]} [description]
         */
        settingThisTopic(id){
            console.log("settingThisTopic");
            window.location.href = '/topicsUpdate/' + id;
        },


    },
    created(){
        let that = this;
        that.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
        getData(this, this.aoData);
    }
})
$(document).ready(function() {
    $('html,body').animate({scrollTop:0});                          //每次刷新界面滚动条置顶
    $(window).scroll(function() {                                   //滚动加载数据
        if ($(document).scrollTop() >= $(document).height() - $(window).height() && index.scrollModel) {
            index.aoData.offset += 10;
            getMoreData(index, index.aoData);
        }
    })
});

/**
 * [getData 获取毕设展界面数据]
 */
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
/**
 * 获取更多数据（滚动条触底）
 */
function getMoreData(that, aoData){
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.getTopicAboutData,
        method:"GET",
        params:aoData
    }).then(function(res){
        if( res.body.status == 200){
            that.$Loading.finish();
            that.dataList = that.dataList.concat(res.body.data.rows);
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
