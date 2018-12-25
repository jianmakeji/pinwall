
var bucket = 'pinwall';
var urllib = OSS.urllib;
var Buffer = OSS.Buffer;
var OSS = OSS.Wrapper;
var STS = OSS.STS;

var container = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                minHeight:"",
            },
            step1_upload_fengmian_src:"",   //封面图片路径(阿里返回路径)
            step2_upload_neirong_src:[],    //列表图片上传列表
            yulan_img:"",                   //步骤二图片预览img的src
            dataItem:{
                name:"",                    //作品名
                description:"",             //描述
                profileImage:"",            //封面图
                jobTag:"",                  //0 作品集 1 作业荚
                artifact_assets:[],         //详情数组
                terms:[]                    //标签数组
            },
            step2_between_arr:[],           //存放step2的数据数组 最后赋值给dataitem
            which_artifact_assets:"",
            file_otherinof_arr:[],         //进度条
            terms_value:"",
            terms_arr:[],





            formItem:{
                username:"",
                email:"",
                password:""
            },
            userId:"1",
            drawerShow:false,
            modelWidth:"",
            // 搜索弹出层
            searchModel:false,  /* 搜索弹出层model */
            searchModelValue:"",    /*搜索内容*/
            searchModelDataList:[],
            columns1:[
                {title:"搜索结果",key:"name"}
            ],
            // 注册弹出层
            loginModel:false,
            // 忘记密码弹出层
            recoverPwdModel:false,
            // 注册弹出层
            registerModel:false,
            imgSrc:"user/getCode",	//图片验证码路径
            // 修改资料弹出层
            resetInfoModel:false,
            // 修改密码弹出层
            resetPwdModel:false,
            // step1
            buttonType:"success",	//error
            iconImg:"ios-brush",	//md-close
            // stepNum:0,
            stepOneActive:true,
            stepTwoActive:false,
            stepThreeActive:false,
            userName:"甘四球", //用户的名称
        }
    },
    methods: {
        /**
         * 步骤一：上传作品封面事件
         * @param  {[type]} files [上传作品详情]
         */
        step1_upload_fengmian_change(files){
            let that = this;
            let file = files.target.files[0];
            let fileName = calculate_object_name(files.target.files[0].name);

            $.ajax({
                url: '/getSTSSignature/1',
                type: 'GET',
                success:function(res){
                    let client = new OSS({
                  		accessKeyId: res.credentials.AccessKeyId,
                  		accessKeySecret: res.credentials.AccessKeySecret,
                  		stsToken: res.credentials.SecurityToken,
                        bucket:bucket
                	});
                    client.multipartUpload('images/'+ fileName, file).then(function (res) {
                        let objectPath = res.res.requestUrls[0].split("http://pinwall.oss-cn-hangzhou.aliyuncs.com/")[1];
                        $.ajax({
                            url: '/getUrlSignature',
                            type: 'GET',
                            data:{objectPath:objectPath,thumbName:"thumb_120_120"},
                            success:function(res){
                                console.log("封面图",res.split("?")[0].split("images/")[1]);
                                that.step1_upload_fengmian_src = res;
                                that.dataItem.profileImage = res.split("?")[0].split("images/")[1];
                            }
                        })
                	});
                }
            })
        },
        step2_upload_neirong_change(files){
            let that = this;
            let file = files.target.files[0];
            let fileName = calculate_object_name(files.target.files[0].name);
            $.ajax({
                url: '/getSTSSignature/1',
                type: 'GET',
                success:function(res){
                    let client = new OSS({
                  		accessKeyId: res.credentials.AccessKeyId,
                  		accessKeySecret: res.credentials.AccessKeySecret,
                  		stsToken: res.credentials.SecurityToken,
                        bucket:bucket
                	});
                    client.multipartUpload('images/'+ fileName, file).then(function (res) {
                        let objectPath = res.res.requestUrls[0].split("http://pinwall.oss-cn-hangzhou.aliyuncs.com/")[1];
                        $.ajax({
                            url: '/getUrlSignature',
                            type: 'GET',
                            data:{objectPath:objectPath,thumbName:"thumb_120_120"},
                            success:function(res){
                                console.log("上传封面图");
                                that.step2_upload_neirong_src = that.step2_upload_neirong_src.concat(res);

                                let subarr = new Object();
                                subarr.position = "";
                    			subarr.name = "";
                    			subarr.filename = "";
                    			subarr.description = "";
                    			subarr.type = "";
                    			subarr.profileImage = "";
                    			subarr.mediaFile = "";
                    			subarr.viewUrl = "";
                                subarr.viewImgUrl = res;
                                that.step2_between_arr.push(subarr);

                                let progress_subarr = new Object();
                                progress_subarr.progress = 0;
                                progress_subarr.fileTrueName = "";
                                that.file_otherinof_arr.push(progress_subarr)

                            }
                        })
                	});
                }
            })
        },
        step2_upload_change(files){

        },
        step2_upload_MP4_change(files){
            let that = this;
            let file = files.target.files[0];
            let fileTrueName = files.target.files[0].name;
            this.file_otherinof_arr[this.which_artifact_assets].fileTrueName = files.target.files[0].name;
            let fileName = calculate_object_name(files.target.files[0].name);
            $.ajax({
                url: '/getSTSSignature/4',
                type: 'GET',
                success:function(res){
                    console.log("获取签名",res);
                    let client = new OSS({
                  		accessKeyId: res.credentials.AccessKeyId,
                  		accessKeySecret: res.credentials.AccessKeySecret,
                  		stsToken: res.credentials.SecurityToken,
                        bucket:bucket
                	});
                    client.multipartUpload('video/'+ fileName, file, {
                		progress: progress
                	}).then(function (res) {
                        console.log("上传成功",res);
                        that.step2_between_arr[that.which_artifact_assets].filename = fileTrueName;
                        that.step2_between_arr[that.which_artifact_assets].position = that.which_artifact_assets;
                        that.step2_between_arr[that.which_artifact_assets].type = 4;
                        that.step2_between_arr[that.which_artifact_assets].mediaFile = res.res.requestUrls[0].split("?")[0].split("video/")[1];
                        that.step2_between_arr[that.which_artifact_assets].viewUrl = res.res.requestUrls[0].split("?")[0].split("video/")[1];
                	});
                }
            })
        },
        step3_upload_PDF_change(files){
            let that = this;
            let file = files.target.files[0];
            let fileTrueName = files.target.files[0].name;
            this.file_otherinof_arr[this.which_artifact_assets].fileTrueName = files.target.files[0].name;
            let fileName = calculate_object_name(files.target.files[0].name);
            $.ajax({
                url: '/getSTSSignature/2',
                type: 'GET',
                success:function(res){
                    console.log("获取签名",res);
                    let client = new OSS({
                  		accessKeyId: res.credentials.AccessKeyId,
                  		accessKeySecret: res.credentials.AccessKeySecret,
                  		stsToken: res.credentials.SecurityToken,
                        bucket:bucket
                	});
                    client.multipartUpload('pdf/'+ fileName, file, {
                		progress: progress
                	}).then(function (res) {
                        console.log("上传成功",res);
                        that.step2_between_arr[that.which_artifact_assets].filename = fileTrueName;
                        that.step2_between_arr[that.which_artifact_assets].position = that.which_artifact_assets;
                        that.step2_between_arr[that.which_artifact_assets].type = 2;
                        that.step2_between_arr[that.which_artifact_assets].mediaFile = res.res.requestUrls[0].split("?")[0].split("pdf/")[1];
                        that.step2_between_arr[that.which_artifact_assets].viewUrl = res.res.requestUrls[0].split("?")[0].split("pdf/")[1];
                	});
                }
            })
        },
        step3_upload_ZIP_change(files){
            let that = this;
            let file = files.target.files[0];
            let fileTrueName = files.target.files[0].name;
            this.file_otherinof_arr[this.which_artifact_assets].fileTrueName = files.target.files[0].name;
            let fileName = calculate_object_name(files.target.files[0].name);
            $.ajax({
                url: '/getSTSSignature/3',
                type: 'GET',
                success:function(res){
                    console.log("获取签名",res);
                    let client = new OSS({
                  		accessKeyId: res.credentials.AccessKeyId,
                  		accessKeySecret: res.credentials.AccessKeySecret,
                  		stsToken: res.credentials.SecurityToken,
                        bucket:bucket
                	});
                    client.multipartUpload('rar_zip/'+ fileName, file, {
                		progress: progress
                	}).then(function (res) {
                        console.log("上传成功",res);
                        that.step2_between_arr[that.which_artifact_assets].filename = fileTrueName;
                        that.step2_between_arr[that.which_artifact_assets].position = that.which_artifact_assets;
                        that.step2_between_arr[that.which_artifact_assets].type = 3;
                        that.step2_between_arr[that.which_artifact_assets].mediaFile = res.res.requestUrls[0].split("?")[0].split("rar_zip/")[1];
                        that.step2_between_arr[that.which_artifact_assets].viewUrl = res.res.requestUrls[0].split("?")[0].split("rar_zip/")[1];
                	});
                }
            })
        },
        step3_upload_HTML5_change(files){
            let that = this;
            let file = files.target.files[0];
            let fileTrueName = files.target.files[0].name;
            this.file_otherinof_arr[this.which_artifact_assets].fileTrueName = files.target.files[0].name;
            let fileName = calculate_object_name(files.target.files[0].name);
            $.ajax({
                url: '/getSTSSignature/3',
                type: 'GET',
                success:function(res){
                    console.log("获取签名",res);
                    let client = new OSS({
                  		accessKeyId: res.credentials.AccessKeyId,
                  		accessKeySecret: res.credentials.AccessKeySecret,
                  		stsToken: res.credentials.SecurityToken,
                        bucket:bucket
                	});
                    client.multipartUpload('rar_zip/'+ fileName, file, {
                		progress: progress
                	}).then(function (res) {
                        console.log("上传成功",res);
                        that.step2_between_arr[that.which_artifact_assets].filename = fileTrueName;
                        that.step2_between_arr[that.which_artifact_assets].position = that.which_artifact_assets;
                        that.step2_between_arr[that.which_artifact_assets].type = 3;
                        that.step2_between_arr[that.which_artifact_assets].mediaFile = res.res.requestUrls[0].split("?")[0].split("rar_zip/")[1];
                        that.step2_between_arr[that.which_artifact_assets].viewUrl = res.res.requestUrls[0].split("?")[0].split("rar_zip/")[1];
                	});
                }
            })
        },
        keyDownEvent(){},
        /**
         * 添加标签
         */
        createTerm(){
            if(this.terms_value){
                let subterm = new Object();
                subterm.name = this.terms_value;
                this.terms_arr.push(subterm);
            }
        },
        /**
         * 步骤二：点击左侧列表，控制图片预览src
         */
        selectLi(index){
            console.log("点击index",index,this.step2_between_arr[index].name);
            this.yulan_img = this.step2_upload_neirong_src[index];
            this.which_artifact_assets = index;
        },


        /* 步骤调整事件 */
        goStep1(){
            this.stepOneActive = true;
            this.stepTwoActive = false;
            this.stepThreeActive = false;
        },
        goStep2(){
            this.stepOneActive = false;
            this.stepTwoActive = true;
            this.stepThreeActive = false;
            this.dataItem.terms = this.terms_arr;
        },
        goStep3(){
            this.stepOneActive = false;
            this.stepTwoActive = false;
            this.stepThreeActive = true;
            this.dataItem.artifact_assets = this.step2_between_arr;
            for(let i=0;i<this.step2_upload_neirong_src.length;i++){
                console.log(this.step2_upload_neirong_src);
                let profileImage_url = new String();
                profileImage_url = this.step2_upload_neirong_src[i];
                this.dataItem.artifact_assets[i].profileImage = profileImage_url.split("?")[0].split("images/")[1];
            }
            console.log(this.dataItem);
        },
        /* step1 事件 */
        // 标签点击删除
        deleteLabel(index){
            console.log("deleteLabel",index);
        },
        submitData(){
            console.log(this.dataItem);
            let that = this;
            $.ajax({
                url: '/website/artifacts',
                method:"POST",
                data:this.dataItem,
                success:function(res){
                    console.log(res);
                }
            })
        },

        // 弹出层
        openModel(){

        },
        // 登录
        openLogin(){

        },
        // 登录
        openMenu(){

        },

        deleteUploadImg(index){
            console.log("deleteUploadImg",index);
        },
        step1_upload_change(){

        },

        step3_upload_change(){
            console.log("++++++++++");
        },
        // 打开search弹出层
        openModel(){
            console.log("openModel");
            this.searchModel = true;
        },
        // 修改密码弹出层
        openResetInfoModel(){
            this.resetInfoModel = true;
        },
        // 修改密码弹出层
        openResetPwdModel(){
            this.resetPwdModel = true;
        },
        // 回车搜索
        searchModelData(){
            console.log("searchModelData");
            this.searchModelDataList = [
                {id:1,name:"11111111111"},
                {id:2,name:"22222222222"},
                {id:3,name:"33333333333"},
                {id:4,name:"44444444444"},
                {id:5,name:"55555555555"}
            ]
        },
        // 搜索结果字段选择
        selectItem(index){
            console.log("selectItem",index);
        },
        // 打开登陆弹出层
        openLogin(){
            this.loginModel = true;
        },
        // 忘记密码
        onRecoverPwd(){
            this.loginModel = false;
            this.recoverPwdModel = true;
        },
        // 注册
        onRegister(){
            this.loginModel = false;
            this.registerModel = true;
        },
        tapClick() {
            var timeStamp = '?' + new Date().getTime() + 'r' + Math.random();
            this.imgSrc = "user/getCode"+timeStamp;
        },
        userManager(){

        },
        workManager(){

        },
        commentManager(){

        }
    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 140 + "px";
        this.dataItem.jobTag = window.location.href.split("uploadWork/")[1];
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "768px";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }
    }
})

$(document).ready(function(){

    $('#step1_upload_fengmian').click(function(){
        $('#step1_upload_fengmian_input').click();
    });
    //作品内容图片上传
    $('#step2_upload_btn').click(function(){
        $('#step2_upload_input').click();
    });
    //step2作品内容图片更换事件
    $('.step2_change_upload_btn').click(function(){
        $('.step2_change_upload_input').click();
    });
    /**
     * step2 附件选择上传
     */
    $('#step2_upload_MP4_btn').click(function(){
        $('#step2_upload_MP4_input').click();
    });
    $('#step2_upload_PDF_btn').click(function(){
        $('#step2_upload_PDF_btninput').click();
    });
    $('#step2_upload_ZIP_btn').click(function(){
        $('#step2_upload_ZIP_input').click();
    });
    $('#step2_upload_HTML5_btn').click(function(){
        $('#step2_upload_HTML5_input').click();
    });

    $('#label_formitem button').each(function() {
        $(this).hover(function(event) {
            $(this).addClass("ivu-btn-error").removeClass("ivu-btn-success");
            $(this).children("i").addClass("ivu-icon-md-close").removeClass("ivu-icon-ios-brush");
        });
        $(this).mouseleave(function(event) {
            $(this).addClass("ivu-btn-success").removeClass("ivu-btn-error");
            $(this).children("i").addClass("ivu-icon-ios-brush").removeClass("ivu-icon-md-close");
        });
    });
    $("#uploaded_list").children('li').each(function() {
        $(this).click(function(event) {
            $("#uploaded_list").children('li').css('background', 'white');
            $(this).css('background', '#EFEFEF');
        });
    });
});

/**
 * 文件名编码
 */
function random_string(len) {
	len = len || 32;
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = chars.length;
	var pwd = '';
	for(i = 0; i < len; i++) {
		pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

function get_suffix(filename) {
	pos = filename.lastIndexOf('.')
	suffix = ''
	if(pos != -1) {
		suffix = filename.substring(pos)
	}
	return suffix;
}

function calculate_object_name(filename) {

	suffix = get_suffix(filename);
	g_object_name = random_string(10) + suffix;

    return g_object_name;
}

var progress = function (p) {
	return function (done) {
		container.file_otherinof_arr[container.which_artifact_assets].progress = p * 100;
		done();
	}
};
