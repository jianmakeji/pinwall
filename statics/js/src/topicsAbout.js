var topicsAbout = new Vue({
    el: '.topicsAbout',
    data(){
        return{
            searchValue:"",
            containerStyle:{
                minHeight:""
            },
            checkAllType:"default",
            checkOpenType:"text",
            checkCloseType:"text",
            checkMyType:"text",

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

            dataList:[{}]
        }
    },
    methods: {
        usersUrl(id){
            let obj = `users/${id}`;
            return obj
        },
        searchData(){
            console.log("searchData");
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
        },
        // 打开search弹出层
        openModel(){
            console.log("openModel");
            this.searchModel = true;
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
        onRecoverPwd(){
            this.loginModel = false;
            this.recoverPwdModel = true;
        },
        onRegister(){
            this.loginModel = false;
            this.registerModel = true;
        },
        tapClick() {
            var timeStamp = '?' + new Date().getTime() + 'r' + Math.random();
            this.imgSrc = "user/getCode"+timeStamp;
        },
        // 打开右侧栏弹出层
        openMenu(){
            console.log("openMenu");
        }
    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 130 + "px";
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "60%";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }
    }
})
