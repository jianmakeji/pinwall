
var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                "margin":"",
            },
            drawerShow:false,
            formItem:{
                name:"",
                password:""
            },
            captchaText:"",


        }
    },
    methods: {
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
                        }else{
                            that.$Notice.error({title:res.data});
                        }
                    }
                });
            }
        }
    },
    created(){
        this.containerStyle.margin = (document.documentElement.clientHeight - 400 ) / 2 - 90 + "px auto";
        let that = this;
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "60%";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }

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
