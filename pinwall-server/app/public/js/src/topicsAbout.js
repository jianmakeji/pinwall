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




            userId:"1",
            searchValue:"",

            // 搜索弹出层
            searchModel:false,  /* 搜索弹出层model */
            searchModelValue:"",    /*搜索内容*/
            searchModelDataList:[],
            modelWidth:"",
            columns1:[
                {title:"搜索结果",key:"name"}
            ],
            // 注册弹出层
            loginModel:false,
            formItem:{
                username:"",
                email:"",
                password:""
            },
            // 忘记密码弹出层
            recoverPwdModel:false,
            // 注册弹出层
            registerModel:false,
            imgSrc:"user/getCode",	//图片验证码路径
            // 修改资料弹出层
            resetInfoModel:false,
            // 修改密码弹出层
            resetPwdModel:false,
            //右侧抽屉
            drawerShow:false,


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
            this.$Loading.start();
            this.aoData.status = -1;
            this.aoData.userId = -1;

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
            this.$Loading.start();
            this.aoData.status = 0;
            this.aoData.userId = -1;
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
            this.$Loading.start();
            this.aoData.status = 1;
            this.aoData.userId = -1;

            getData(this, this.aoData);
        },
        checkMy(){
            console.log("checkMy");
            this.checkAllType = "text";
            this.checkOpenType = "text";
            this.checkCloseType = "text";
            this.checkMyType = "default";
            this.aoData.status = -1;
            this.aoData.userId = 0;
            this.$Loading.start();
            getData(this, this.aoData);
        },
        /**
         * [checkThisTopic 查看该作业荚]
         * @param  {[type]}  id [作业荚id]
         */
        checkThisTopic(id){
            console.log("checkThisTopic",id);
            window.location.href = "/workFolder/" + id;
        },
        /**
         * 锁定该作业荚
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
         * [searchData description]
         * @return {[type]} [description]
         */
        settingThisTopic(id){
            console.log("settingThisTopic");
            window.location.href = '/topicsUpdate/' + id;
        },


    },
    created(){
        let that = this;

        initStyle(this);

        this.$Loading.start();

        getData(this, this.aoData);
    }
})
$(document).ready(function() {
    $('html,body').animate({scrollTop:0});                          //每次刷新界面滚动条置顶
    $(window).scroll(function() {                                   //滚动加载数据
        if ($(document).scrollTop() >= $(document).height() - $(window).height() && index.scrollModel) {
            index.aoData.offset += 10;
            index.$Loading.start();

            getMoreData(index, index.aoData);
        }
    })
});

/**
 * [getData 获取毕设展界面数据]
 */
function getData(that, aoData){
    that.$http({
        url: config.ajaxUrls.getTopicAboutData,
        method:"GET",
        params:aoData
    }).then(function(res){
        if( res.body.status == 200){
            that.$Loading.finish();
            console.log("初始化加载数据", res);
            that.dataList = res.body.data.rows;
            if (that.dataList.length == res.body.data.count) {
                that.scrollModel = false;
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
    that.$http({
        url: config.ajaxUrls.getTopicAboutData,
        method:"GET",
        params:aoData
    }).then(function(res){
        if( res.body.status == 200){
            that.$Loading.finish();
            console.log("初始化加载数据", res);
            that.dataList = that.dataList.concat(res.body.data.rows);
            if (that.dataList.length == res.body.data.count) {
                that.scrollModel = false;
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
 * [initStyle 初始化界面最小高度]
 * @param  {[type]} that [vue对象]
 */
function initStyle(that){
    that.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
    if(document.documentElement.clientWidth > 1200){
        that.modelWidth = "60%";
    }else if(document.documentElement.clientWidth < 1200){
        that.modelWidth = "70%";
    }else if(document.documentElement.clientWidth < 992){
        that.modelWidth = "80%";
    }
}
