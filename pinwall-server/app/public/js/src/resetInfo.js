
var g_object_name = "";
var key = '';
var hostPrefix = "http://jm-prometheus.oss-cn-hangzhou.aliyuncs.com";
var urllib = OSS.urllib;
var Buffer = OSS.Buffer;
var OSS = OSS.Wrapper;
var STS = OSS.STS;

function random_string(len) {
  	var len = len || 32;
  	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  	var maxPos = chars.length;
  	var pwd = '';
  	for (var i = 0; i < len; i++) {
    	pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  	}
  	return pwd;
}

function get_suffix(filename) {
  	var pos = filename.lastIndexOf('.')
  	var suffix = ''
  	if (pos != -1) {
    	suffix = filename.substring(pos)
  	}
  	return suffix;
}

function calculate_object_name(filename) {
  	var suffix = get_suffix(filename)
  	g_object_name = key + random_string(10) + suffix
}

function get_uploaded_object_name(filename) {
  	return g_object_name;
}

var index = new Vue({
    el: '.index',
    data(){
        return{
            avatarUrl:"",
            containerStyle:{
                margin:"",
            },
            intro:"",
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
            let that = this;
            this.$Loading.start();

            if (that.intro =="" && that.avatarUrl == ""){
              that.$Notice.error({ title: "没有修改的内容!", duration:2});
            }else{
              $.ajax({
                  url: '/website/users/0',
                  type: 'PUT',
                  data: {
                      intro:that.intro,
                      avatarUrl:that.avatarUrl
                  },
                  success(res){
                      if(res.status == 200){
                          that.$Loading.finish();
                          that.$Notice.success({ title: res.data, duration:2});
                      }else{
                          that.$Notice.error({ title: res.data, duration:2});
                      }
                  }
              });
            }

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
        },
        changeImage(){
          $("#headicon").click();
        },
        uploadHeadIcon(files) {
          let that = this;
          var file = files.target.files[0]; //获取要上传的文件对象
	      	this.$http({
	        	method: 'get',
	        	url: '/getSTSSignature/5'
	      	}).then((res) => {

		        let client = new OSS({
		          	accessKeyId: res.data.credentials.AccessKeyId,
		          	accessKeySecret: res.data.credentials.AccessKeySecret,
		          	stsToken: res.data.credentials.SecurityToken,
		          	bucket: 'pinwall'
		        });

    				calculate_object_name(file.name);
    		    var newFilename =  g_object_name;
            client.multipartUpload('headicon/'+ newFilename, file).then(function (res) {
                let objectPath = 'headicon/' + newFilename;
                that.avatarUrl = newFilename;
                $.ajax({
                    url: config.ajaxUrls.getUrlSignature,
                    type: 'GET',
                    data:{objectPath:objectPath},
                    success:function(res){
                      $("#headiconImg").attr('src',res);
                    }
                })
          });
  		    }).catch((err) => {
            console.log('2:'+err);
    				that.$Loading.error();
    				that.$Message.error({
    					duration: 2,
    					content: err
    				});
		    });
      }
    },
    created(){
        let clientWidth = document.documentElement.clientWidth;
        let clientHeight = document.documentElement.clientHeight;
        if (clientHeight < 600) {
            this.containerStyle.margin = "0px auto";
        } else {
            this.containerStyle.margin = ( clientHeight - 560 ) / 2 + "px auto";
        }
    }
})
