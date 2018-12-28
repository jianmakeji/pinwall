var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                minHeight:""
            },
            topicId:"",
            formItem:{

            },
            terms_arr:[],
            term_value:"",
            addTerms:[],
            deleteTerms:[],

            userId:"1",
            // //右侧抽屉
            drawerShow:false,

        }
    },
    methods: {
        addTerm(){
            let XO = true;
            for(let i=0;i<this.terms_arr.length;i++){
                if (this.terms_arr[i].name == this.term_value) {
                    XO = false;
                    this.$Notice.error({title:"该标签已添加!"});
                }
            }
            if(this.term_value && XO){
                let aa = new Object();
                aa.name = this.term_value;
                this.terms_arr.push(aa);
                this.addTerms.push(aa);
                this.term_value = "";
            }

        },
        deleteTerm(index){
            let XO = false;
            for (var i = 0; i < this.formItem.terms.length; i++) {
                if (this.terms_arr[index].name == this.formItem.terms[i].name) {
                    XO = true;
                    break;
                }
            }
            if(XO){
                this.deleteTerms.push(this.terms_arr[index].Id);
                this.terms_arr.splice(index,1);
            }
        },
        updateTopicStatus(){
            console.log(this.topicId);
            let newstatus = new String();
            if (this.formItem.status == 0) {
                newstatus = 1;
            }else{
                newstatus = 0;
            }
            let that = this;
            $.ajax({
                url: '/website/topics/updateTopicStatus?topicId='+this.topicId+'&status='+newstatus,
                type: 'PUT',
                success(res){
                    console.log(res);
                    if (res.status == 200) {
                        that.formItem.status = newstatus;
                        that.$Notice.success({title:"操作成功！"})
                    }
                }
            });

        },
        deleteTopics(){
            let that = this;
            $.ajax({
                url: '/website/topics/' + this.topicId,
                type: 'DELETE',
                data: {id : this.topicId},
                success(res){
                    if (res.status == 200) {
                        that.$Notice.success({
                            title:"作业荚删除成功！2秒后返回首页。",
                            duration:2,
                            onClose:function(){
                                window.location.href = "/";
                            }
                        })
                    }
                }
            });
        },
        updata_submit(){
            let that = this;
            this.formItem.addTerms = this.addTerms;
            this.formItem.deleteTerms = this.deleteTerms;
            console.log(this.formItem);

            $.ajax({
                url: '/website/topics/'+this.topicId,
                type: 'PUT',
                data: this.formItem,
                success(res){
                    console.log(res);
                }
            });

        },
        updata_cancel(){
            window.history.go(-1);
        },
    },
    created(){
        let that = this;
        this.screenWidth = document.documentElement.clientWidth;
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
        this.topicId = window.location.href.split("topicsUpdate/")[1];
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "60%";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }

        $.ajax({
            url: '/website/topics/' + this.topicId,
            type: 'GET',
            success:function(res){
                console.log(res);
                if(res.status == 200){
                    that.formItem = res.data;
                    for (let i = 0; i < that.formItem.terms.length; i++) {
                        let term = new Object();
                        term = that.formItem.terms[i];
                        that.terms_arr.push(term);
                    }
                }
            }
        });

    }
})
