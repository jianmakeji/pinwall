var index = new Vue({
    el: '.index',
    data(){
        return{
            aoData:{limit:12,offset:0,visible:-1,jobTag:1},
            groupModel:0,       //搜索筛选选项
            columns:[
                { title: '作品名',key: 'name', align: 'center',
                    render: (h, params) => {
                        return h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.clickUserName(params.row.id)
                                    }
                                }
                            }, params.row.name);
                    }
                },
                { title: '上传者',key: 'filename', align: 'center',
                    render: (h, params) => {
                        return h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.clickUserName(params.row.id)
                                    }
                                }
                            }, this.dataList[params.index].user.fullname);
                    }
                },
                { title: '上传时间',key: 'createAt', align: 'center',
                    render:(h,params)=>{
                        return h('p',{

                        },this.dataList[params.index].createAt.split("T")[0])
                    }
                },
                { title: '评论数',key: 'commentCount', align: 'center'},
                { title: '获赞数',key: 'likeCount', align: 'center'},
                { title: '奖章数',key: 'medalCount', align: 'center'},
                { title: '操作',key: 'opt', align: 'center',
            	    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.becomeVIP(params.index)
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.becomeVIP(params.index)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            dataList:[],
            totalPage:"",



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

        }
    },
    methods: {
        groupCheck(value){
            console.log(value);
        },
        pageChange(page){
            this.aoData.offset = (page-1) * 12;
            var that = this;
            this.$Loading.start();
            this.$http({
                url: "/website/artifacts",
                method:"GET",
                params:this.aoData
            }).then(function(res){
                if (res.body.status == 200) {
                    that.$Loading.finish();
                    that.totalPage = res.body.data.count;
                    that.dataList = res.body.data.rows;
                }
            },function(err){
                that.$Loading.error();
            })
        },
        clickUserName(id){
            console.log(id);
        },
        becomeVIP(value){
            console.log(value);
        },
    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "768px";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }

        var that = this;
        this.$Loading.start();
        this.$http({
            url: "/website/artifacts",
            method:"GET",
            params:this.aoData
        }).then(function(res){
            if (res.body.status == 200) {
                that.$Loading.finish();
                that.totalPage = res.body.data.count;
                that.dataList = res.body.data.rows;
            }
        },function(err){
            that.$Loading.error();
        })
    }
})
