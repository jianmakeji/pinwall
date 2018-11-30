var users = new Vue({
    el: '.users',
    data(){
        return{
            screenWidth:"",
            containerStyle:{
                minHeight:""
            },
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
        }
    },
    methods: {
        usersUrl(id){
            let obj = `users/${id}`;
            return obj
        },
        openModel(){
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
        // 右侧字段搜索
        toSearch(value){
            console.log("toSearch",value);
        },
        openMenu(){

        },
        // 登陆弹出层
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
    },
    created(){
        this.screenWidth = document.documentElement.clientWidth;
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "60%";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }
    }
})
