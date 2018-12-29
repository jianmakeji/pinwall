var index = new Vue({
    el: '.index',
    data(){
        return{
            userId:"1",

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

            imgSrc:"user/getCode",	//图片验证码路径
        }
    },
    methods: {
        checkAll(){
            this.checkAllType = "default";
            this.checkOpenType = "text";
            this.checkCloseType = "text";
            this.checkMyType = "text";

            let that = this;
            this.$Loading.start();
            this.aoData.status = -1;
            this.aoData.userId = -1;
            this.$http({
                url: config.ajaxUrls.getTopicAboutData,
                method:"GET",
                params:this.aoData
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
        },
        checkOpen(){
            this.checkAllType = "text";
            this.checkOpenType = "default";
            this.checkCloseType = "text";
            this.checkMyType = "text";
            let that = this;
            this.$Loading.start();
            this.aoData.status = 0;
            this.aoData.userId = -1;
            this.$http({
                url: config.ajaxUrls.getTopicAboutData,
                method:"GET",
                params:this.aoData
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
        },
        checkClose(){
            this.checkAllType = "text";
            this.checkOpenType = "text";
            this.checkCloseType = "default";
            this.checkMyType = "text";

            let that = this;
            this.$Loading.start();
            this.aoData.status = 1;
            this.aoData.userId = -1;
            this.$http({
                url: config.ajaxUrls.getTopicAboutData,
                method:"GET",
                params:this.aoData
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
        },
        /**
         * 由我创建
         * @return {[type]} [description]
         */
        checkMy(){
            console.log("checkMy");
            this.checkAllType = "text";
            this.checkOpenType = "text";
            this.checkCloseType = "text";
            this.checkMyType = "default";

            let that = this;
            this.$Loading.start();
            this.aoData.status = -1;
            this.aoData.userId = 0;
            this.$http({
                url: config.ajaxUrls.getTopicAboutData,
                method:"GET",
                params:this.aoData
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
        },
        /**
         * [checkThisTopic 查看该作业荚]
         * @param  {[type]}  id [作业荚id]
         */
        checkThisTopic(id){
            console.log("checkThisTopic",id);
            window.location.href = "/topicsUpdate/" + id;
        },
        /**
         * [uploadToTopic 上传作品至该作业荚]
         */
        uploadToTopic(id){
            console.log("uploadToTopic",id);
            window.location.href = "/uploadWork/1?topicId=" + id;
        },
        /**
         * 锁定该作业荚
         */
        cockThisTopic(id){

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
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "60%";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }

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

        this.$Loading.start();
        this.$http({
            url: config.ajaxUrls.getTopicAboutData,
            method:"GET",
            params:that.aoData
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

                    console.log("滚动至底加载数据", res);
                    index.dataList = index.dataList.concat(res.body.data.rows);
                    if (index.dataList.length == res.body.data.count) {
                        index.scrollModel = false;
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

// function getData(that, that.aoData){
//     this.$Loading.start();
//     this.$http({
//         url: config.ajaxUrls.getTopicAboutData,
//         method:"GET",
//         params:that.aoData
//     }).then(function(res){
//         if( res.body.status == 200){
//             that.$Loading.finish();
//             console.log("初始化加载数据", res);
//             that.dataList = res.body.data.rows;
//             if (that.dataList.length == res.body.data.count) {
//                 that.scrollModel = false;
//             }
//             for(let i=0; i < that.dataList.length; i++){
//                 that.dataList[i].createAt = that.dataList[i].createAt.replace("T"," ").replace("000Z","创建");
//                 if(that.dataList[i].user.avatarUrl == null){
//                     that.dataList[i].user.avatarUrl = config.default_profile;
//                 }
//             }
//         }
//     },function(err){
//         that.$Loading.error();
//     })
// }
