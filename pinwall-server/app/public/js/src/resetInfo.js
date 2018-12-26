
var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                minHeight:"",
            },
            step1_upload_fengmian_src:"",   //封面图片路径(阿里返回路径)
            step2_upload_neirong_src:[],    //列表图片上传列表
            yulan_img:"",                   //步骤二图片预览img的src
            dataItem:{
                name:"",                    //作品名
                description:"",             //描述
                profileImage:"",            //封面图
                jobTag:"",                  //0 作品集 1 作业荚
                artifact_assets:[],         //详情数组
                terms:[]                    //标签数组
            },
            step2_between_arr:[],           //存放step2的数据数组 最后赋值给dataitem
            which_artifact_assets:0,
            file_otherinof_arr:[],         //附加信息
            neirong_truename_arr:[],
            terms_value:"",
            terms_arr:[],




            formItem:{
                username:"",
                email:"",
                password:""
            },
            userId:"1",
            drawerShow:false,
            modelWidth:"",
            // 搜索弹出层
            searchModel:false,  /* 搜索弹出层model */
            searchModelValue:"",    /*搜索内容*/
            searchModelDataList:[],
            columns1:[
                {title:"搜索结果",key:"name"}
            ],
            // 注册弹出层
            loginModel:false,
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
            userName:"甘四球", //用户的名称
        }
    },
    methods: {
        
    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 140 + "px";
        this.dataItem.jobTag = window.location.href.split("uploadWork/")[1];
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "768px";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }
    }
})
