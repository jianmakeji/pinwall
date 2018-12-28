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
            this.aoData.userId = 1;
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




        searchData(){
            console.log("searchData");
        },
        searchModelData(){
            console.log("searchModelData");
            this.searchModelDataList = [
                {id:1,name:"11111111111"},
                {id:2,name:"22222222222"},
                {id:3,name:"33333333333"},
                {id:4,name:"44444444444"},
                {id:5,name:"55555555555"}
            ]
        },


        // 打开search弹出层
        openModel(){
            console.log("openModel");
            this.searchModel = true;
        },
        // 打开search弹出层
        openModel(){
            console.log("openModel");
            this.searchModel = true;
        },
        // 修改密码弹出层
        openResetInfoModel(){
            this.resetInfoModel = true;
        },
        // 修改密码弹出层
        openResetPwdModel(){
            this.resetPwdModel = true;
        },
        // 回车搜索
        searchModelData(){
            console.log("searchModelData");
            this.searchModelDataList = [
                {id:1,name:"11111111111"},
                {id:2,name:"22222222222"},
                {id:3,name:"33333333333"},
                {id:4,name:"44444444444"},
                {id:5,name:"55555555555"}
            ]
        },
        // 搜索结果字段选择
        selectItem(index){
            console.log("selectItem",index);
        },
        // 打开登陆弹出层
        openLogin(){
            this.loginModel = true;
        },
        // 忘记密码
        onRecoverPwd(){
            this.loginModel = false;
            this.recoverPwdModel = true;
        },
        // 注册
        onRegister(){
            this.loginModel = false;
            this.registerModel = true;
        },
        userManager(){

        },
        workManager(){

        },
        commentManager(){

        }
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
