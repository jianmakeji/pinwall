var index = new Vue({
    el: '.index',
    data(){
        return{
            userId:"1",

            // 数据请求
            aoData:{limit:10,jobTag:1,offset:0},
            dataList:[],
            scrollModel:true,
            spinShow:true,

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
        usersUrl(id){
            let obj = `usera/${id}`;
            return obj
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
        checkAll(){
            console.log("checkAll");
            this.checkAllType = "default";
            this.checkOpenType = "text";
            this.checkCloseType = "text";
            this.checkMyType = "text";
        },
        checkOpen(){
            console.log("checkOpen");
            this.checkAllType = "text";
            this.checkOpenType = "default";
            this.checkCloseType = "text";
            this.checkMyType = "text";
        },
        checkClose(){
            console.log("checkClose");
            this.checkAllType = "text";
            this.checkOpenType = "text";
            this.checkCloseType = "default";
            this.checkMyType = "text";
        },
        checkMy(){
            console.log("checkMy");
            this.checkAllType = "text";
            this.checkOpenType = "text";
            this.checkCloseType = "text";
            this.checkMyType = "default";
        },					// 打开search弹出层
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
        $.ajax({
            url: config.ajaxUrls.getTopicAboutData,
            type: "get",
            data:this.aoData,
            dataType: "json",
            success: function (res) {
                if( res.status == 200){
                    that.$Loading.finish();
                    that.spinShow = false;
                    console.log("初始化加载数据", res);
                    that.dataList = res.data.rows;
                    if (that.dataList.length == res.data.count) {
                        that.scrollModel = false;
                    }
                    for(let i=0; i < that.dataList.length; i++){
                        // 修改创建时间格式
                        that.dataList[i].createAt = that.dataList[i].createAt.replace("T"," ").replace("000Z","创建");
                        // 用户头像转换
                        if(that.dataList[i].user.avatarUrl == null){
                            that.dataList[i].user.avatarUrl = config.default_profile;
                        }
                    }
                }
            },
            error: function (err) {
                that.$Loading.error();
            }
        })
    }
})

$(document).ready(function() {

    $('html,body').animate({scrollTop:0});                          //每次刷新界面滚动条置顶

    $(window).scroll(function() {                                   //滚动加载数据

        if ($(document).scrollTop() >= $(document).height() - $(window).height() && index.scrollModel) {
            index.aoData.offset += 10;
            index.$Loading.start();
            index.spinShow = true;
            $.ajax({
                url: config.ajaxUrls.getTopicAboutData,
                type: "get",
                data:index.aoData,
                dataType: "json",
                success: function (res) {
                    if( res.status == 200){
                        index.$Loading.finish();
                        index.spinShow = false;

                        console.log("滚动至底加载数据", res);
                        index.dataList = index.dataList.concat(res.data.rows);
                        if (index.dataList.length == res.data.count) {
                            index.scrollModel = false;
                        }
                        for(let i=0; i < index.dataList.length; i++){
                            index.dataList[i].createAt = index.dataList[i].createAt.replace("T"," ").replace("000Z","创建");

                            if(index.dataList[i].user.avatarUrl == null){
                                index.dataList[i].user.avatarUrl =config.default_profile;
                            }
                        }
                    }
                },
                error: function (err) {
                    index.$Loading.error();
                }
            })
        }
    })
});
