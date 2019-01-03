var index = new Vue({
    el: '.index',
    data() {
        return {
            formItem:{
                email:"",
                fullname:"",
                password:"",
                captchaText:""
            },
            newOrOld:"0",
            isRegister:true,
            disableSbt:true,
            drawerShow: false,
        }
    },
    methods: {
        radioChange(value){
            if(value == "0"){				//  new
                console.log("new");
                this.isRegister = true;
                this.disableSbt = true;
                init_form(this);
    		}else if(value == "1"){			//  old
                console.log("old");
                this.isRegister = false;
                this.disableSbt = false;
                init_form(this);
    		}
        },
        tapClick(){
            let that = this;
            $.ajax({
                url: '/getCaptcha',
                type: 'GET',
                success(res){
                    document.getElementsByTagName("object")[0].innerHTML = res;
                }
            });
        },
        conPwdBlur(){

        },
        checkCaptcha(event){
            let that = this;
            if(event.target.value.length == 5){
                $.ajax({
                    url: '/checkCaptcha',
                    type: 'GET',
                    data:{captchaText:this.formItem.captchaText},
                    success(res){
                        if (res.status == 200){
                            that.disableSbt = false;
                            that.$Notice.success({title:res.data});
                            that.verification = true;
                        }else{
                            that.$Notice.error({title:res.data});
                            that.disableSbt = true;
                            that.verification = false;
                        }
                    }
                });
            }
        },
        submit(){
            let that = this;
            if (this.newOrOld == "0") {     //new
                let subUrl = "/website/users/createWxUser";
                $.ajax({
                    url: subUrl,
                    type: 'POST',
                    data: this.formItem,
                    success(res){
                        if (res.status == 200) {
                            that.$Notice.success({title:"注册成功！请前往邮箱激活!"});
                            that.disableSbt = false;
                            init_form(that);
                        }else{
                            that.$Notice.error({title:"注册失败!"});
                        }
                    }
                });

            } else {
                let subUrl = "/website/users/bindWeixinInfoByEmail";
                $.ajax({
                    url: subUrl,
                    type: 'POST',
                    data: this.formItem,
                    success(res){
                        if (res.status == 200) {
                            that.$Notice.success({title:"绑定成功！请前往邮箱激活!"});
                            init_form(that);
                        }else{
                            that.$Notice.error({title:"绑定失败!"});
                        }
                    }
                });
            }
        }
    },
    created() {
        let that = this;
        $.ajax({
            url: '/getCaptcha',
            type: 'GET',
            success(res){
                document.getElementsByTagName("object")[0].innerHTML = res;
            }
        });
    }
})

function init_form(that){
    that.formItem.email = "";
    that.formItem.fullname = "";
    that.formItem.password = "";
    that.formItem.captchaText = "";
}
