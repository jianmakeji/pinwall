var index = new Vue({
    el: '.index',
    data(){
        return{
            aoData:{limit:12,offset:0},
            groupModel:0,       //搜索筛选选项
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
                                on: {
                                    click: () => {
                                        this.clickUserName(params.row.id)
                                    }
                                }
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
                                on: {
                                    click: () => {
                                        this.clickUserName(params.row.id)
                                    }
                                }
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
            totalPage:"",
            drawerShow:false,
            containerStyle:{
                minHeight:"",
            },
        }
    },
    methods: {
        groupCheck(value){
            console.log(value);
        },
        pageChange(page){
            var that = this;
            this.aoData.offset = (page - 1) * 12;
            getData(that);
        },
        clickUserName(id){
            console.log(id);
        },
        deleteComment(value){
            console.log(value);
        },

    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";

        var that = this;

        getData(that);
    }
})

function getData(that){
    that.$Loading.start();
    that.$http({
        url: "/website/artifactComment",
        method:"GET",
        params:that.aoData
    }).then(function(res){
        if (res.body.status == 200) {
            that.$Loading.finish();
            that.totalPage = res.body.data.count;
            that.dataList = res.body.data.rows;
        }else if (res.body.status == 999) {
            that.$Notice.error({
                title:"没有操作权限，请登录",
                onClose(){
                    window.location.href = "/login";
                }
            })
        }
    },function(err){
        that.$Loading.error();
    })
}
