
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
            drawerShow:false,

            // 注册弹出层
            userName:"甘四球", //用户的名称
        }
    },
    methods: {

    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 140 + "px";
        this.dataItem.jobTag = window.location.href.split("uploadWork/")[1];
    }
})
