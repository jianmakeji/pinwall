var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                minHeight:"",
            },
            userId:"1",
            drawerShow:false,
            terms_value:"",
            terms_arr:[],
            formItem:{
                type:"",
                name:"",
                terms:[],
                description:"",
                status:1,
                jobTag:1,
            }
        }
    },
    methods: {
        createTerm(){
            console.log(this.terms_value);
            let XO = true;
            for(let i=0;i<this.terms_arr.length;i++){
                if (this.terms_arr[i].name == this.terms_value) {
                    XO = false;
                    this.$Notice.error({title:"该标签已添加!"});
                }
            }
            if(this.terms_value && XO){
                let subterm = new Object();
                subterm.name = this.terms_value;
                this.terms_arr.push(subterm);
                this.terms_value = "";
            }
        },
        deleteTerm(index){
            this.terms_arr.splice(index,1);
        },
        submitData(){
            let that = this;
            this.formItem.terms = this.terms_arr;
            console.log("submitData",this.formItem);
            $.ajax({
                url: '/website/topics',
                type: 'POST',
                data: this.formItem,
                success:function(res){
                    console.log(res);
                    if (res.status == 200) {
                        that.$Notice.success({
                            title:"作业荚创建成功，2秒后返回主页",
                            duration:2,
                            onClose:function(){
                                window.location.href = "/";
                            }
                        })
                    }
                }
            })
        }
    },
    created(){
        this.screenWidth = document.documentElement.clientWidth;
        this.containerStyle.minHeight = document.documentElement.clientHeight - 150 + "px";
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "60%";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }
    }
})
