var index = new Vue({
    el: '.index',
    data(){
        return{
            userId:"1",

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
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "60%";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }
    }
})

$(document).ready(function() {
    $("#index").addClass('text').removeClass('dashed');
    $("#topicsAbout").addClass('text').removeClass('dashed');
    $("#topics").addClass('dashed').removeClass('text');
});
