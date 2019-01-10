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
                                    size: 'small',
                                    target:'_blank'
                                },
                                attrs:{
                                    target:'_blank',
                                    href:'/project/' + this.dataList[params.index].Id
                                },
                                style: {
                                    marginRight: '5px'
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
                                attrs:{
                                    href:'/users/' + this.dataList[params.index].user.Id
                                },
                                style: {
                                    marginRight: '5px'
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
                                        this.editWork(params.index)
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
                                        this.deleteWork(params.index)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            dataList:[],
            totalPage:"",
            drawerShow:false,
            containerStyle:{
                minHeight:"",
            },
            searchValue:""
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
                url: config.ajaxUrls.getArtifacts,
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
        editWork(index){
            window.location.href = "/editUploadWork?id=" + this.dataList[index].Id + "&jobTag=" + this.dataList[index].jobTag;
        },
        deleteWork(value){
            console.log(value);
        },
    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";

        var that = this;
        this.$Loading.start();
        this.$http({
            url: config.ajaxUrls.getArtifacts,
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
