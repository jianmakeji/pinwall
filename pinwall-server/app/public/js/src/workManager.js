var index = new Vue({
    el: '.index',
    data(){
        return{
            aoData:{limit:12,offset:0,visible:-1,jobTag:1},
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
            searchData:{keyword:"",limit:12,offset:0},
            searchValue:""
        }
    },
    methods: {
        searchWork(){
            if (this.searchValue) {
                this.searchData.offset = 0;
                this.searchData.keyword = this.searchValue;
                searchArtifactsByNameOrTermName(this, this.searchData);
            } else {
                this.aoData.offset = 0;
                initData(this, this.aoData)；
            }
        },
        pageChange(page){
            if (this.searchValue) {
                this.searchData.offset = (page - 1) * 12;
                searchArtifactsByNameOrTermName(this, this.searchData);
            } else {
                this.aoData.offset = (page-1) * 12;
                initData(this, this.aoData);
            }
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
        initData(this, this.aoData);
    }
})

function initData(that, aoData){
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.getArtifacts,
        method:"GET",
        params:aoData
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

function searchArtifactsByNameOrTermName(that, searchData){
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.searchArtifactsByNameOrTermName,
        method:"GET",
        params:searchData
    }).then(function(res){
        if (res.body.status == 200) {
            console.log(res);
            that.$Loading.finish();
            that.dataList = res.body.data.hits;
            that.totalPage = res.body.data.count;
        }
    },function(err){
        that.$Loading.error();
    })
}
