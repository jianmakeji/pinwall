var index = new Vue({
    el: '.index',
    data() {
        return {
            formItem:{
                newOrOld:"0"
            },
            captchaText:"",
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
    		}else if(value == "1"){			//  old
                console.log("old");
                this.isRegister = false;
                this.disableSbt = false;
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
                    data:{captchaText:this.captchaText},
                    success(res){
                        if (res.status == 200){
                            that.$Notice.success({title:res.data});
                            that.verification = true;
                        }else{
                            that.$Notice.error({title:res.data});
                            that.verification = false;
                        }
                    }
                });
            }
        },
        submit(name){

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
var obj = new WxLogin({
    self_redirect: true,
    id: "login_container",
    appid: "wxe7bac3b26bdd1205",
    scope: "snsapi_login",
    redirect_uri: "http%3a%2f%2fpinwall.design-engine.org%2f",
    state: "",
    style: "",
    href: ""
});
