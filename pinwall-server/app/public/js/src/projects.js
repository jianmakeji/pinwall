var projects = new Vue({
    el: '.projects',
    delimiters: ['${', '}'],
    data(){
        return{
            artifactId:"",
            aoData:{limit:10,offset:0,artifactId:0},
            scrollModel:true,
            dataList:[],
            success:"1",
            projectStyle:{
                width: "100%",
                minHeight:""
            },
            commentValue:""
        }
    },
    methods: {
        editArtifact(jobTag){
            window.location.href = "/editUploadWork?id=" + this.aoData.artifactId + "&jobTag=" + jobTag;
        },
        deleteArtifact(){
            console.log("点击删除");
        },
        showArtifact(){
            console.log("点击隐藏、显示");
        },
        /**
         * 有附件时监听点击
         *  url [附件路径]
         */
        downAttach(url){
            // window.location.href = url;
            window.open(url);
        },
        /**
         * 点击close按键返回上一级界面
         * @return {[type]} [description]
         */
        closeThePage(){
            // window.history.back(-1);
            window.close();
        },
        zan(userId,userRole){
            console.log(userId,userRole);
            if (userRole == "") {
                this.$Notice.error({
                    title:"请先登录再点赞！",
                    duration:1,
                    onClose(){
                        window.location.href = "/login";
                    }
                })
            } else if(userRole == "user"){
                console.log("登录user用户点赞");
            }else {
                console.log("特殊权限用户点赞");
            }
        },
        deleteComment(id){
            console.log("deleteComment",id);
        },
        addComment(id){
            console.log("addComment",id);
        }
    },
    created(){
        this.projectStyle.minHeight = document.documentElement.clientHeight + "px";
        this.aoData.artifactId = window.location.href.split("project/")[1];
        this.artifactId = window.location.href.split("project/")[1];
        let that = this;
        this.$Loading.start();
        $.ajax({
            url: '/website/artifactComment/findByArtifactIdWithPage',
            type: 'GET',
            data: this.aoData,
            success:function(res){
                if (res.status == 200) {
                    that.$Loading.finish();
                    that.dataList = res.data.rows;
                    if (that.dataList.length == res.data.count) {
                        that.scrollModel = false;
                    }
                    console.log(that.dataList);
                }else if (res.status == 999) {
                    that.$Notice.error({
                        title:"没有操作权限，请登录",
                        onClose(){
                            window.location.href = "/login";
                        }
                    })
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
                    }else if (res.status == 999) {
                        that.$Notice.error({
                            title:"没有操作权限，请登录",
                            onClose(){
                                window.location.href = "/login";
                            }
                        })
                    }
                }
            })
        }
    })

    $(".attach_figure").each(function(i) {
        $(".attach_figure").mouseover(function() {
            $(this).children("button").addClass('ivu-btn-success').removeClass('ivu-btn-default');
        });
        $(".attach_figure").mouseleave(function() {
            $(this).children("button").addClass('ivu-btn-default').removeClass('ivu-btn-success');
        });
    });
});
