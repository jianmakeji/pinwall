var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                "margin":"",
            },
            drawerShow:false,
            newOrOld:"phone",
            canWhitePwd:false,
            email:"",
            cloak:false,
            disableCodeBtn:false,
            mobileCodeText:"点击获取验证码",
            formItem:{
                mobile:"",
                smsCode:"",
                newPwd:"",
                confirmPassword:""
            }
        }
    },
    computed:{
        disabledBtn(){
            if (this.cloak && this.formItem.smsCode.length == 6 && this.formItem.mobile && this.formItem.newPwd && this.canWhitePwd) {
                return false;
            } else {
                return true;
            }
        }
    },
    methods: {
        //发送手机验证短信
    	sendAcodeStg:function(){
    		var that = this;
    		this.$Loading.start();
    		if(config.regexString.phone.test(this.formItem.mobile)){
    			var url = config.ajaxUrls.sendGetBackPwdSms + this.formItem.mobile;
    			$.ajax({
                    dataType:"json",
                    type:"get",
                    url:url,
                    success:function(res){
                        if(res.status == 200){
                    		that.$Loading.finish();
                        	that.$Notice.success({title:res.data, duration:3});
                        	clock(that);
                        }else{
                    		that.$Loading.error();
                        	that.$Notice.error({title:res.data, duration:3});
                        }
                    },
                    error:function(){
                		that.$Loading.error();
                    	that.$Notice.error({title:"网络异常，请稍后重试！", duration:3});
                    }
                })
    		}else if(this.formItem.mobile.length == 0){
        		that.$Loading.error();
    			that.$Notice.error({title:"请输入手机号", duration:3});
    		}
    	},
        //验证手机验证码
    	checkMobileCode(event){
            if(event.target.value.length == 6){
                var that = this,
    			url = config.ajaxUrls.vertifySms;
        		$.ajax({
                    dataType:"json",
                    type:"GET",
                    url:url,
                    data:{mobile:this.formItem.mobile,smsCode:this.formItem.smsCode},
                    success:function(res){
                        if(res.status == 200){
                        	that.$Notice.success({title:res.data, duration:3});
                            that.canWhitePwd = true;
                            that.cloak = true;
                        }else{
                        	that.$Notice.error({title:res.data, duration:3});
                        }
                    },
                    error:function(){
                    	that.$Notice.error({title:"网络异常，请稍后重试！", duration:3});
                    }
                })
            }
    	},
        conPwdBlur(){
            if(this.formItem.newPwd && this.formItem.confirmPassword != this.formItem.newPwd){
    			this.$Notice.error({ title: '输入的密码不一致', duration:3});
                this.formItem.newPwd = "";
                this.formItem.confirmPassword = "";
    		}
        },
        submitEmail(){
            let that = this;
            if(config.regexString.email.test(this.email)){
                this.$Loading.start();
                $.ajax({
                    url: config.ajaxUrls.getBackPwdWithEmail + this.email,
                    type: 'GET',
                    success(res){
                        if (res.status == 200) {
                            that.$Loading.finish();
                            that.$Notice.success({
                                title:res.data,
                                onClose(){
                                    window.location.href = "/forgetPwd";
                                }
                            })
                        } else if (res.status == 500) {
                            that.$Loading.error();
                            that.$Notice.error({
                                title:res.data
                            })
                        }
                    }
                });
            }
        },
        submitPhone(){
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: config.ajaxUrls.updatePwdWithMobile,
                data:this.formItem,
                type: 'PUT',
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:res.data,
                            onClose(){
                                window.location.href = "/login";
                            }
                        })
                    } else if (res.status == 500) {
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
        this.containerStyle.margin = (document.documentElement.clientHeight - 360 ) / 2 - 90 + "px auto";
    }
})
function clock(that){
	var num = 60;
	var int = setInterval(function(){
		num > 0 ? num-- : clearInterval(int);
		that.mobileCodeText = num + "秒后重试";
		that.disableCodeBtn = true;
		if(num == 0){
			that.mobileCodeText = "点击获取验证码";
    		that.disableCodeBtn = false;
		}
	},1000);
}
