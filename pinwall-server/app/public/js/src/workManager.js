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
                                        this.clickWorkName(params.index)
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
                                        this.clickUserName(params.index)
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
        clickWorkName(index){
            window.location.href = "/project/" + this.dataList[index].Id;
        },
        clickUserName(index){
            window.location.href = "/users/" + this.dataList[index].user.Id;
        },
        editWork(index){
            console.log(this.dataList[index]);
            window.location.href = "/editUploadWork?id=" + this.dataList[index].Id + "&jobTag=2";
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
