var index = new Vue({
    el: '.index',
    delimiters: ['${', '}'],
    data() {
        return {
            formItem:{
                mobile:"",
                smsCode:"",
                fullname:"",
                password:"",
                confirmPassword:"",
                captchaText:""
            },
            formOld:{
                email:"",
                password:""
            },
            ruleValidate:{
                mobile:[
        	       {required: true, message: '手机号不能为空', trigger: 'blur'},
        	       {required: true, len:11, message: '请输入正确手机号码格式', trigger: 'blur'}
            	],
                smsCode:[
					{required: true, message: '请输入验证码', trigger: 'blur'},
					{len:6, message: '验证码为6位', trigger: 'blur'}
            	],
            	fullname:{required: true, message: '用户名不能为空', trigger: 'blur'},
            	password:[
            	    {required: true, message: '请输入密码', trigger: 'blur'},
              	    {min:6, message: '密码至少为6位', trigger: 'blur'}
            	],
            	confirmPassword:[
            	    {required: true, message: '请输入密码', trigger: 'blur'},
              	    {min:6, message: '密码至少为6位', trigger: 'blur'}
            	]
            },
            newOrOld:"new",
            disableSbt:true,
            drawerShow: false,
            disableCodeBtn:false,
            mobileCodeText:"点击获取验证码",
        }
    },
    methods: {
        tapClick(){
            let that = this;
            $.ajax({
                url: config.ajaxUrls.getCaptcha,
                type: 'GET',
                success(res){
                    document.getElementsByTagName("object")[0].innerHTML = res;
                }
            });
        },
        //发送手机验证短信
    	sendAcodeStg:function(){
    		var that = this;
    		this.$Loading.start();
    		if(config.regexString.phone.test(this.formItem.mobile)){
    			var url = config.ajaxUrls.sendMessage + this.formItem.mobile;
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
                            that.disableSbt = false;
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
            if(this.formItem.password && this.formItem.confirmPassword != this.formItem.password){
    			this.$Notice.error({ title: '输入的密码不一致', duration:3});
                this.formItem.password = "";
                this.formItem.confirmPassword = "";
    		}
        },
        checkCaptcha(event){
            let that = this;
            if(event.target.value.length == 5){
                $.ajax({
                    url: config.ajaxUrls.checkCaptcha,
                    type: 'GET',
                    data:{captchaText:this.formItem.captchaText},
                    success(res){
                        if (res.status == 200){
                            that.$Notice.success({title:res.data});
                        }else{
                            that.$Notice.error({title:res.data});
                        }
                    }
                });
            }
        },
        submitNew(){
            let that = this;
            this.$Loading.start();
            let subUrl = config.ajaxUrls.createWxUser;
            $.ajax({
                url: subUrl,
                type: 'POST',
                data: this.formItem,
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({title:res.data});
                        that.disableSbt = false;
                        init_form(that);
                    }else if(res.status == 999){
                        that.$Loading.error();
                        that.$Notice.error({
                            title:"没有操作权限，请登录",
                            onClose(){
                                window.location.href = "/login";
                            }
                        });
                    }else{
                        that.$Loading.error();
                        that.$Notice.error({title:res.data});
                        init_form(that);
                    }
                },
                error(err){
                    that.$Loading.error();
                    that.$Notice.error({title:err.data});
                    init_form(that);
                }
            });
        },
        submitOld(){
            let that = this;
            let subUrl = config.ajaxUrls.bindWeixinInfoByEmail;
            if (config.regexString.email.test(this.formOld.email) || config.regexString.phone.test(this.formOld.email)) {
                if (this.formOld.password.length >= 6) {
                    this.$Loading.start();
                    $.ajax({
                        url: subUrl,
                        type: 'POST',
                        data: this.formOld,
                        success(res){
                            if (res.status == 200) {
                                that.$Loading.finish();
                                that.$Notice.success({
                                    title:res.data,
                                    onClose(){
                                        window.location.href = "/login";
                                    }
                                });
                            }else{
                                that.$Loading.error();
                                that.$Notice.error({title:res.data});
                                init_form(that);
                            }
                        },
                        error(err){
                            that.$Loading.error();
                            that.$Notice.error({title:err.data});
                            init_form(that);
                        }
                    });
                }else{
                    this.$Notice.error({title:"密码不少于6位"});
                }
            } else {
                this.$Notice.error({title:"请输入正确邮箱或手机号"});
            }
        }
    },
    created() {
        let that = this;
        $.ajax({
            url: config.ajaxUrls.getCaptcha,
            type: 'GET',
            success(res){
                document.getElementsByTagName("object")[0].innerHTML = res;
            }
        });

    }
})
$(document).ready(function() {
    let tag = $('.error_tag').attr('tag');
    if(tag == 1){
        index.newOrOld = "old";
        index.radioChange(1);
    }
});
function init_form(that){
    that.formItem.mobile = "";
    that.formItem.smsCode = "";
    that.formItem.fullname = "";
    that.formItem.password = "";
    that.formItem.confirmPassword = "";
    that.formItem.captchaText = "";

    that.formOld.email = "";
    that.formOld.password = "";
}
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
