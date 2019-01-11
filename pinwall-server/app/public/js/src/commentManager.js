var index = new Vue({
    el: '.index',
    data(){
        return{
            aoData:{limit:12,offset:0,keyword:"",field:1},
            searchValue:"",
            groupModel:1,       //搜索筛选选项
            columns:[
                { title: '评论',key: 'content', align: 'center'},
                { title: '评论者',key: 'email', align: 'center',width:150,
                    render: (h, params) => {
                        return h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                attrs:{
                                    href:'/users/' + this.dataList[params.index].user.Id
                                },
                            }, params.row.user.fullname);
                    }
                },
                { title: '评论作品',key: 'email', align: 'center',width:250,
                    render: (h, params) => {
                        return h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                attrs:{
                                    target:'_blank',
                                    href:'/project/' + this.dataList[params.index].Id
                                },
                            }, params.row.artifact.name);
                    }
                },
                { title: '评论时间',key: 'email', align: 'center',width:150,
                    render:(h, params)=>{
                        return h('p',{

                        },this.dataList[params.index].commentAt.split("T")[0])
                    }
                },
                { title: '操作',key: 'opt', align: 'center',width:150,
            	   render: (h, params) => {
                       return h('div', [
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
                                       this.deleteComment(params.index)
                                   }
                               }
                           }, '删除')
                       ]);
                   }
               }
            ],
            dataList:[],
            currentPage:1,
            totalPage:"",
            drawerShow:false,
            containerStyle:{
                minHeight:"",
            },
        }
    },
    methods: {
        groupCheck(value){
            this.groupModel = value;
            this.aoData.field = value;
        },
        searchComment(){
            this.currentPage = 1;
            this.aoData.offset = 0;
            this.aoData.keyword = this.searchValue;
            console.log(this.aoData);
            getData(this, this.aoData);
        },
        pageChange(page){
            this.currentPage = page;
            this.aoData.offset = (page - 1) * 12;
            getData(this, this.aoData);
        },
        deleteComment(value){
            console.log(value);
        },

    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
        getData(this, this.aoData);
    }
})

function getData(that, aoData){
    that.$Loading.start();
    that.$http({
        url: config.ajaxUrls.searchComment,
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
