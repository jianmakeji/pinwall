var projects = new Vue({
    el: '.projects',
    delimiters: ['${', '}'],
    data() {
        return {
            scoreBoxStyle:{
                position: "fixed",
                margin: "20px auto",
                padding: "20px",
                alignItems: "center",
                width:"310px",
                height:"auto",
                background:"#fff",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                right:"",
                top:""
            },
            backTopRight:"30",
            scoresModel:false,
            optUlStyle:{
                position: "fixed",
                top: "",
                bottom: "",
                right: "30px"
            },
            deleteModal:false,
            artifactId: "",
            visible:0,
            aoData: {
                limit: 10,
                offset: 0,
                artifactId: 0
            },
            scrollModel: true,
            dataList: [],
            success: "1",
            projectStyle: {
                width: "100%",
                minHeight: ""
            },
            artifactCommentData:{
                content:"",
                commenterId:"",
                artifactId:""
            },
            artifactLikeData:{
                artifactId:"",
                artifactUserId:""
            },
            artifactScoreData: {
                artifactId: "",
                score: ""
            },
            disableComment:false,
            artifactZanTag:0
        }
    },
    methods: {
        editArtifact(jobTag) {
            window.location.href = "/editUploadWork?id=" + this.aoData.artifactId + "&jobTag=" + jobTag;
        },
        deleteArtifact(){
            this.deleteModal = true;
        },
        showScoreBox(event){
            this.scoresModel = true;
            this.scoreBoxStyle.right = document.body.clientWidth - event.pageX + 50 + "px";
            if(document.documentElement.clientWidth < 540){
                this.scoreBoxStyle.top = document.documentElement.clientHeight / 2 + 50 + "px";
            }else{
                this.scoreBoxStyle.top = document.documentElement.clientHeight / 2 - 80 + "px";
            }
        },
        ok() {
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: '/website/artifacts/'+this.artifactId,
                type: 'DELETE',
                data: {id: this.artifactId},
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:res.data,
                            duration:1,
                            onClose(){
                                window.self.close();
                                window.opener.location.reload();
                            }
                        })
                    }else{
                        that.$Loading.error();
                        that.$Notice.error({title:res.data});
                    }
                }
            });
        },
        showArtifact(value) {
            let visible = new Object();
            if (value) {
                visible = 0;
            } else {
                visible = 1;
            }
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: config.ajaxUrls.updateVisibleById.replace(":id",this.artifactId),
                type: 'PUT',
                data: {visible: visible},
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:res.data,
                            onClose(){
                                location.reload();
                            }
                        });
                    }else{
                        that.$Loading.error();
                        that.$Notice.error({title:res.data});
                    }
                }
            });
        },
        downAttach(url) {
            window.open(url);
        },
        closeThePage() {
            if(document.referrer != ""){
                window.close();
            }else{
                window.location.href = "/index";
            }
        },
        zan(artifactUserId,userRole) {
            let that = this;
            this.$Loading.start();
            if (userRole == "") {
                this.$Notice.error({
                    title: "请先登录再点赞！",
                    duration: 1,
                    onClose() {
                        window.location.href = "/login";
                    }
                })
            } else {
                this.artifactLikeData.artifactUserId = artifactUserId;
                $.ajax({
                    url: '/website/artifactMedalLike',
                    type: 'POST',
                    data: this.artifactLikeData,
                    success(res){
                        if(res.status == 200){
                            that.$Loading.finish();
                            that.artifactZanTag = !that.artifactZanTag;
                            that.$Notice.success({
                                title:res.data,
                                duration:0.5,
                                onClose(){
                                    location.reload();
                                }
                            });
                        }else{
                            that.$Loading.error();
                            that.$Notice.error({title:res.data});
                        }
                    }
                });

            }
        },
        deleteComment(id) {
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: '/website/artifactComment/'+id,
                type: 'DELETE',
                data: {id: id},
                success(res){
                    if (res.status == 200) {
                        that.$Notice.success({
                            title:res.data,
                            duration:1,
                            onClose(){
                                $.ajax({
                                    url: '/website/artifactComment/findByArtifactIdWithPage',
                                    type: 'GET',
                                    data: that.aoData,
                                    success: function(res) {
                                        if (res.status == 200) {
                                            that.$Loading.finish();
                                            that.dataList = res.data.rows;
                                            if (that.dataList.length == res.data.count) {
                                                that.scrollModel = false;
                                            }else{
                                                that.scrollModel = true;
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }else {
                        that.$Loading.error();
                        that.$Notice.error({title:res.data});
                    }
                }
            });

        },
        // 添加评论
        addComment(id) {
            this.artifactCommentData.commenterId = id;
            this.addCommentDelay();
        },
        // 添加评论防抖
        addCommentDebounce(){
            let that = this;
            if(this.artifactCommentData.content){
                this.disableComment = true;
                this.$Loading.start();
                $.ajax({
                    url: '/website/artifactComment',
                    type: 'POST',
                    data: this.artifactCommentData,
                    success(res){
                        if(res.status == 200){
                            that.$Loading.finish();
                            that.$Notice.success({title:"评论成功！"});
                            that.artifactCommentData.content = "";
                            that.disableComment = false;
                            getConmentData(that, that.aoData);
                        }else{
                            that.$Loading.error();
                            that.disableComment = false;
                            that.$Notice.error({title:res.data});
                        }
                    }
                });
            }else{
                that.$Notice.error({title:"评论内容不能为空"});
            }
        },
        scoreChange(event, scoreId) {
            let regex = /^100$|^(\d|[1-9]\d)$/;
            let value = event.target.value;
            this.artifactScoreData.artifactId = scoreId;
            if (value == "") {
                this.artifactScoreData.score = 0;
            } else if (value.match(regex)) {
                this.artifactScoreData.score = value;
            } else {
                this.$Notice.error({
                    title: "请输入正确格式的分数！"
                })
            }
        },
        submitScore() {
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: '/website/artifactScores',
                type: 'POST',
                data: this.artifactScoreData,
                success(res) {
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:res.data,
                            duration:1,
                            onClose(){
                                that.scoresModel = false;
                                location.reload();
                            }
                        });
                    }else{
                        that.$Loading.error();
                        that.$Notice.error({title:res.data});
                    }
                }
            });

        },
        scoreClose(){
            this.scoresModel = false;
        },
        teamworkerData(str){
          if(str != null && str != "" && isJsonString(str)){
            let teammates = JSON.parse(str);
            let result = '';
            for(let i = 0; i < teammates.length; i++){
              result = result + '<a style="color:#0ABC73" href="/users/'+teammates[i].Id+'">' + teammates[i].fullname +'</a>';
              if(i != (teammates.length - 1)){
                result = result +'，';
              }
            }
            return result;
          }
          else{
            return '';
          }
        }
    },
    created() {
        let that = this;
        this.projectStyle.minHeight = document.documentElement.clientHeight + "px";
        if(document.documentElement.clientWidth < 540){
            this.optUlStyle.bottom = "80px";
            this.optUlStyle.top = "";
            this.optUlStyle.right = "4px";
            this.backTopRight = "4";
        }else {
            this.backTopRight = "30";
            this.optUlStyle.bottom = "";
            this.optUlStyle.right = "30px";
            this.optUlStyle.top = document.documentElement.clientHeight / 2 - 100 + "px";
        }
        this.aoData.artifactId = window.location.href.split("project/")[1];
        this.artifactId = window.location.href.split("project/")[1];
        this.artifactCommentData.artifactId = window.location.href.split("project/")[1];
        this.artifactLikeData.artifactId = window.location.href.split("project/")[1];
        getConmentData(this, this.aoData);
        let artifactId = window.location.href.split("project/")[1];
        $.ajax({
            url: '/website/artifactMedalLike/getMedalLikeDataByUserIdAndArtifactsId',
            type: 'GET',
            data: {artifactId: artifactId},
            success(res){
                if (res.status == 200) {
                    that.artifactZanTag = 1;
                }else if(res.status == 500){
                    that.artifactZanTag = 0;
                }
            }
        });
    },
    mounted() {
        // 构建 添加评论 防抖函数
        this.addCommentDelay = _.debounce(this.addCommentDebounce, 1000,{
            'leading': true,
            'trailing': false
        });
    },
});
$(document).ready(function() {
    $('html,body').animate({
        scrollTop: 0
    }); //每次刷新界面滚动条置顶
    $(window).scroll(function() { //滚动加载数据
        if ($(document).scrollTop() >= $(document).height() - $(window).height() && projects.scrollModel) {
            projects.aoData.offset += 10;
            projects.$Loading.start();
            $.ajax({
                url: '/website/artifactComment/findByArtifactIdWithPage',
                type: 'GET',
                data: projects.aoData,
                success: function(res) {
                    if (res.status == 200) {
                        projects.$Loading.finish();
                        projects.dataList = projects.dataList.concat(res.data.rows);
                        if (projects.dataList.length == res.data.count) {
                            projects.scrollModel = false;
                        }
                    } else if (res.status == 999) {
                        that.$Notice.error({
                            title: "没有操作权限，请登录",
                            onClose() {
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

function isJsonString(str) {
        try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        } catch(e) {
        }
        return false;
}

function getConmentData(that, aoData){
    that.$Loading.start();
    $.ajax({
        url: '/website/artifactComment/findByArtifactIdWithPage',
        type: 'GET',
        data: aoData,
        success: function(res) {
            if (res.status == 200) {
                that.$Loading.finish();
                that.dataList = res.data.rows;
                if (that.dataList.length == res.data.count) {
                    that.scrollModel = false;
                }else {
                    that.scrollModel = true;
                }
            } else if (res.status == 999) {
                that.$Loading.error();
                that.$Notice.error({
                    title: "没有操作权限，请登录",
                    onClose() {
                        window.location.href = "/login";
                    }
                })
            }
        }
    })
}
