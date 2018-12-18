var index = new Vue({
    el: '.index',
    data(){
        return{
            userId:"1",
            drawerShow:false,
            modelWidth:"",
            containerStyle:{
                // background: "#2DB7F5",
                width: "100%",
                height: "500px",
                marginTop:"",
                overflow: "hidden",
                position: "relative",
            },
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

            dataList:[]
        }
    },
    methods: {
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
        tapClick() {
            var timeStamp = '?' + new Date().getTime() + 'r' + Math.random();
            this.imgSrc = "user/getCode"+timeStamp;
        },
        userManager(){

        },
        workManager(){

        },
        commentManager(){

        }
    },
    created(){
        this.$Loading.start();
        this.containerStyle.marginTop = (document.documentElement.clientHeight - 100 - 500 - 50 ) / 2 + "px";
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "768px";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }

        var that = this;
        this.$http({
            url: config.ajaxUrls.getIndexData,
            method:"GET",
            params:{
                num:12
            }
        }).then(function(res){
            // console.log("--------",res);
            if (res.status == 200) {
                that.$Loading.finish();
                that.dataList = res.body;
                for(let i=0; i < that.dataList.length; i++){
                    that.dataList[i].createAt = that.dataList[i].createAt.split("T")[0];
                    if(that.dataList[i].user.avatarUrl == null){
                        that.dataList[i].user.avatarUrl = "http://pinwall.design-engine.org/images/default_profile.jpg";
                    }
                }
            }
        },function(err){
            that.$Loading.error();
        })
    }
})
