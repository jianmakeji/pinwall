var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                minHeight:""
            },
            topicsId:"",
            formItem:{
                name:"",
                description:"",
                status:""
            },


            spinShow:false,

            screenWidth:"",
            userId:"1",

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
        updateTopicStatus(){
            console.log(this.topicsId);
            let that = this;
            $.ajax({
                url: '/website/topics/updateTopicStatus',
                type: 'PUT',
                data: {topicId:this.topicsId,status:this.formItem.status},
                success:function(res){
                    console.log(res);
                }
            });

        },





        deleteLabel(index){

        },
        openModel(){
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
        let that = this;
        this.screenWidth = document.documentElement.clientWidth;
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
        this.topicsId = window.location.href.split("topicsUpdate/")[1];
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "60%";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }

        $.ajax({
            url: '/website/topics/' + this.topicsId,
            type: 'GET',
            success:function(res){
                console.log(res);
                if(res.status == 200){
                    that.formItem = res.data;
                }
            }
        });

    }
})

$(document).ready(function() {
    $('#label_formitem button').each(function() {
        $(this).hover(function(event) {
            $(this).addClass("ivu-btn-error").removeClass("ivu-btn-success");
            $(this).children("i").addClass("ivu-icon-md-close").removeClass("ivu-icon-ios-brush");
        });
        $(this).mouseleave(function(event) {
            $(this).addClass("ivu-btn-success").removeClass("ivu-btn-error");
            $(this).children("i").addClass("ivu-icon-ios-brush").removeClass("ivu-icon-md-close");
        });
    });
});
