var projects = new Vue({
    el: '.projects',
    delimiters: ['${', '}'],
    data(){
        return{
            aoData:{limit:10,offset:0,artifactId:0},
            scrollModel:true,
            dataList:[],
            success:"1",
            projectStyle:{
                width: "100%",
                minHeight:""
            },
            commentValue:"",
            userId:"1"
        }
    },
    methods: {
        closeThePage(){
            console.log("closeThePage");
        },
        zan(event){
            console.log(event);
        },
        deleteComment(id){
            console.log("deleteComment",id);
        },
        addComment(){
            console.log("addComment");
        },
        login(){
            console.log("goLogin!");
        }
    },
    created(){
        this.projectStyle.minHeight = document.documentElement.clientHeight + "px";
        this.aoData.artifactId = window.location.href.split("project/")[1];
        let that = this;
        this.$Loading.start();
        $.ajax({
            url: '/website/artifactComment/findByArtifactIdWithPage',
            type: 'GET',
            data: this.aoData,
            success:function(res){
                if (res.status == 200) {
                    that.dataList = res.data.rows;
                    if (that.dataList.length == res.data.count) {
                        that.scrollModel = false;
                    }
                    console.log(that.dataList);
                }
                console.log(res);
            }
        })
    }
})

$(document).ready(function() {
    $('html,body').animate({scrollTop:0});                          //每次刷新界面滚动条置顶
    $(window).scroll(function() {                                   //滚动加载数据
        if ($(document).scrollTop() >= $(document).height() - $(window).height() && projects.scrollModel) {
            projects.aoData.offset += 10;
            projects.$Loading.start();
            $.ajax({
                url: '/website/artifactComment/findByArtifactIdWithPage',
                type: 'GET',
                data: projects.aoData,
                success:function(res){
                    if (res.status == 200) {
                        console.log(res);
                        projects.$Loading.finish();
                        projects.dataList = projects.dataList.concat(res.data.rows);
                        if (projects.dataList.length == res.data.count) {
                            projects.scrollModel = false;
                        }
                    }
                }
            })
        }
    })
});
