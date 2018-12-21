var index = new Vue({
    el: '.index',
    data(){
        return{
            aoData:{limit:12,offset:0,topicId:0},
            headDataList:[],
            uploadTotal:"",
            dataList:[],
            headInfo:{fullname:"",date:"",name:"",count:""},
            containerStyle:{
                minHeight:""
            },
            spinShow:true,
            scrollModel:true,


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
        usersUrl(id){
            let obj = `users/${id}`;
            return obj
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
        this.screenWidth = document.documentElement.clientWidth;
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
        this.aoData.topicId = window.location.href.split("workFolder/")[1];
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "60%";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }
        this.$Loading.start();
        let that = this;
        $.ajax({
            url: '/website/topics/getTopicAndArtifactById',
            type: 'GET',
            data: this.aoData,
            success:function(res){
                console.log(res.data);
                if (res.status == 200) {
                    that.$Loading.finish();
                    that.spinShow = false;

                    that.dataList = res.data.rows.artifacts;
                    that.headDataList = res.data.rows.artifacts;
                    that.uploadTotal = res.count;

                    that.headInfo.avatarUrl = res.data.rows.user.avatarUrl;
                    that.headInfo.fullname = res.data.rows.user.fullname;
                    that.headInfo.date = res.data.rows.createAt.split("T")[0] + " 发布";
                    that.headInfo.name = res.data.rows.name;
                    that.headInfo.count = res.data.count;

                    if (that.dataList.length == res.data.count) {
                        that.scrollModel = false;
                    }
                }
            }
        })
    }
})

$(document).ready(function() {
    $('html,body').animate({scrollTop:0});                          //每次刷新界面滚动条置顶
    $(window).scroll(function() {                                   //滚动加载数据
        if ($(document).scrollTop() >= $(document).height() - $(window).height() && index.scrollModel) {
            index.aoData.offset += 12;
            index.$Loading.start();
            index.spinShow = true;
            $.ajax({
                url: '/website/topics/getTopicAndArtifactById',
                type: 'GET',
                data: index.aoData,
                success:function(res){
                    console.log("--------------",res.data.rows);
                    if (res.status == 200) {
                        index.$Loading.finish();
                        index.spinShow = false;
                        index.dataList = index.dataList.concat(res.data.rows.artifacts);
                        console.log(index.dataList);
                        if (index.dataList.length == res.data.count) {
                            index.scrollModel = false;
                        }
                    }
                }
            })
        }
    })
});
