
var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                margin:"",
            },
            pwdItem:{
                password:"",
                newPwd:"",
                confirmPassword:""
            },
            drawerShow:false,
            restDisabled:true,
            ruleValidate:{
                password:[
            	    {required: true, message: '请输入密码', trigger: 'blur'},
              	    {min:6, message: '密码至少为6位', trigger: 'blur'}
            	],
                newPwd:[
                    {required: true, message: '请输入密码', trigger: 'blur'},
              	    {min:6, message: '密码至少为6位', trigger: 'blur'}
                ],
            	confirmPassword:[
            	    {required: true, message: '请输入密码', trigger: 'change'},
              	    {min:6, message: '密码至少为6位', trigger: 'change'}
            	]
            }
        }
    },
    methods: {
        submitInfo(){
            console.log("保存我的信息修改");
        },
        conPwdBlur(){
            if (this.pwdItem.newPwd.length >= 6) {
                if(this.pwdItem.newPwd && this.pwdItem.confirmPassword != this.pwdItem.newPwd){
        			this.$Notice.error({ title: '输入的两次新密码不一致', duration:3});
                    this.pwdItem.newPwd = "";
                    this.pwdItem.confirmPassword = "";
                    this.restDisabled = true;
        		}else {
                    this.restDisabled = false;
                }
            }else {
                this.pwdItem.newPwd = "";
                this.pwdItem.confirmPassword = "";
                this.restDisabled = true;
            }
        },
        restPwd(){
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: '/website/users/updatePwd',
                type: 'PUT',
                data: this.pwdItem,
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:res.data,
                            duration:1,
                            onClose(){
                                window.location.href = "/resetInfo";
                            }
                        })
                    }else{
                        that.$Loading.error();
                        that.$Notice.error({
                            title:res.data
                        })
                    }
                }
            });
        }
    },
    created(){
        let clientWidth = document.documentElement.clientWidth;
        let clientHeight = document.documentElement.clientHeight;
        if (clientHeight < 600) {
            this.containerStyle.margin = "0px auto";
        } else {
            this.containerStyle.margin = ( clientHeight - 600 ) / 2 + "px auto";
        }
    }
})
