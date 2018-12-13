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

            dataList:[
                {id:1,name:"1111111",content:'fgasdfasdfasdfasdfa',time:"2018-1-1",src:"http://pinwall.fzcloud.design-engine.org/5329/7703198392760.jpg?imageMogr2/thumbnail/400x400"},
                {id:2,name:"2222222",content:'asdfasdfasdfasdfasd',time:"2018-1-1",src:"http://pinwall.fzcloud.design-engine.org/5330/6162447272844.jpg?imageMogr2/thumbnail/400x400"},
                {id:3,name:"2222222",content:'asdfasdfasdfasdfasd',time:"2018-1-1",src:"http://pinwall.fzcloud.design-engine.org/5112/10784533438329.png?imageMogr2/thumbnail/400x400"},
                {id:4,name:"2222222",content:'asdfasdfasdfasdfasd',time:"2018-1-1",src:"http://pinwall.fzcloud.design-engine.org/5480/9183531151812.png?imageMogr2/thumbnail/400x400"},
                {id:5,name:"2222222",content:'asdfasdfasdfasdfasd',time:"2018-1-1",src:"http://pinwall.fzcloud.design-engine.org/4863/9177059372340.jpg?imageMogr2/thumbnail/400x400"},
                {id:6,name:"2222222",content:'asdfasdfasdfasdfasd',time:"2018-1-1",src:"http://pinwall.fzcloud.design-engine.org/5480/12245454459312.jpg?imageMogr2/thumbnail/400x400"},
                {id:7,name:"2222222",content:'asdfasdfasdfasdfasd',time:"2018-1-1",src:"http://pinwall.fzcloud.design-engine.org/5837/13780046984490.jpg?imageMogr2/thumbnail/400x400"},
                {id:8,name:"2222222",content:'asdfasdfasdfasdfasd',time:"2018-1-1",src:"http://pinwall.fzcloud.design-engine.org/5354/15405721054080.png?imageMogr2/thumbnail/400x400"},
                {id:9,name:"2222222",content:'asdfasdfasdfasdfasd',time:"2018-1-1",src:"http://pinwall.fzcloud.design-engine.org/5354/15405721054080.png?imageMogr2/thumbnail/400x400"},
                {id:10,name:"2222222",content:'asdfasdfasdfasdfasd',time:"2018-1-1",src:"http://pinwall.fzcloud.design-engine.org/5354/15405721054080.png?imageMogr2/thumbnail/400x400"},
                {id:11,name:"2222222",content:'asdfasdfasdfasdfasd',time:"2018-1-1",src:"http://pinwall.fzcloud.design-engine.org/5354/15405721054080.png?imageMogr2/thumbnail/400x400"},
                {id:12,name:"2222222",content:'asdfasdfasdfasdfasd',time:"2018-1-1",src:"http://pinwall.fzcloud.design-engine.org/5354/15405721054080.png?imageMogr2/thumbnail/400x400"}
            ]
        }
    },
    methods: {
        setClass(index){
            let obj = {}
            obj[`item-${index}`] = true;
            return obj
        },
        setUserId(id){
            let obj = `users/${id}`;
            return obj
        },
        setTopicId(id){
            let obj = `topics/${id}`;
            return obj
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
    },
    created(){
        this.containerStyle.marginTop = (document.documentElement.clientHeight - 100 - 500 - 50 ) / 2 + "px";
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "768px";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }
    }
})
