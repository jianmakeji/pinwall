var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                minHeight:"",
            },
            aoData:{limit:12,offset:0},
            userRoleData:{userId:"",operation:""},
            groupModel:0,       //搜索筛选选项
            columns:[
                { title: '用户名',key: 'fullname', align: 'center',minWidth:200,
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
                                        this.clickUserName(params.row.Id)
                                    }
                                }
                            }, params.row.fullname);
                    }
                },
                { title: '邮箱',key: 'email', align: 'center',minWidth:200},
                { title: '上传作品数',key: 'artifactCount', align: 'center'},
                { title: '点赞数',key: 'likeCount', align: 'center'},
                { title: '发表言论',key: 'commentCount', align: 'center'},
                { title: '获得奖章',key: 'medalCount', align: 'center'},
                { title: '状态',key: 'active', align: 'center',
                    render:(h, params) => {
                        return h('p', params.row.active ? "激活" : "未激活")
                    }
                },
                { title: '权限',key: 'name', align: 'center',
                    render:(h, params) => {
                        return h('p', {
                            props:{

                            }
                        },params.row.roles[0].name)
                    }
                },
                { title: '操作',key: 'opt', align: 'center',
                    render: (h, params) => {
                        if (params.row.roles[0].name == "user") {
                            return h('Button',{
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
                            },"设为VIP")
                        } else {
                            return h('Button',{
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
                            },"设为用户")
                        }
                    }
               }
            ],
            dataList:[],
            totalPage:"",
            drawerShow:false,
            searchValue:""
        }
    },
    methods: {
        /**
         * [groupCheck 用户搜索标签选择事件]
         */
        groupCheck(value){
            console.log(value);
        },
        /**
         * [pageChange 分页控件切换]
         */
        pageChange(page){
            let that = this;
            this.aoData.offset = (page - 1) * 12;
            this.$http({
                url: config.ajaxUrls.getUserData,
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
            window.location.href = "/users/" + id;
        },
        becomeVIP(index){
            let that = this;
            this.userRoleData.userId = this.dataList[index].Id;
            if(this.dataList[index].roles[0].name == "user"){
                this.userRoleData.operation = "vip";
            }else{
                this.userRoleData.operation = "user";
            }
            $.ajax({
                url: config.ajaxUrls.updateUserRole,
                type: 'PUT',
                data: this.userRoleData,
                success(res){
                    if (res.status == 200) {
                        that.$Notice.success({title:res.data});
                        that.$http({
                            url: config.ajaxUrls.getUserData,
                            method:"GET",
                            params:that.aoData
                        }).then(function(res){
                            if (res.body.status == 200) {
                                that.$Loading.finish();
                                that.totalPage = res.body.data.count;
                                that.dataList = res.body.data.rows;
                            }
                        },function(err){
                            that.$Loading.error();
                        })
                    } else {
                        that.$Notice.error({title:res.data});
                    }
                }
            });
        }
    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";

        var that = this;
        this.$http({
            url: config.ajaxUrls.getUserData,
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
