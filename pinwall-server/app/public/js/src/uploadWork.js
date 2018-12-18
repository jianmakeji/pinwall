var index = new Vue({
    el: '.index',
    data(){
        return{
            userId:"1",
            drawerShow:false,
            modelWidth:"",
            containerStyle:{
                minHeight:"",
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
            // step1
            buttonType:"success",	//error
            iconImg:"ios-brush",	//md-close
            // stepNum:0,
            stepOneActive:true,
            stepTwoActive:false,
            stepThreeActive:false,
            // step1:true,
            // step2:false,
            // step3:false,
            containerStyle:{
                minHeight:""
            },
            userName:"甘四球", //用户的名称
            formItem:{
                title:""
            }
        }
    },
    methods: {
        /* 步骤调整事件 */
        goStep1(){
            this.stepOneActive = true;
            this.stepTwoActive = false;
            this.stepThreeActive = false;
            // this.stepNum = 0;
        },
        goStep2(){
            this.stepOneActive = false;
            this.stepTwoActive = true;
            this.stepThreeActive = false;
            // this.stepNum = 1;
        },
        goStep3(){
            this.stepOneActive = false;
            this.stepTwoActive = false;
            this.stepThreeActive = true;
            // this.stepNum = 2;
        },
        /* step1 事件 */
        // 标签点击删除
        deleteLabel(index){
            console.log("deleteLabel",index);

        },


        // 弹出层
        openModel(){

        },
        // 登录
        openLogin(){

        },
        // 登录
        openMenu(){

        },
        selectLi(index){
            console.log("selectLi",index);
        },
        deleteUploadImg(index){
            console.log("deleteUploadImg",index);
        },
        step1_upload_change(){

        },
        step2_upload_change(){

        },
        step3_upload_change(){
            console.log("++++++++++");
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
        this.containerStyle.minHeight = document.documentElement.clientHeight - 140 + "px";
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "768px";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }
    }
})

$(document).ready(function(){
    $('#step1_upload_btn').click(function(){
        $('#step1_upload_input').click();
    });
    $('#step2_upload_btn').click(function(){
        $('#step2_upload_input').click();
    });
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
