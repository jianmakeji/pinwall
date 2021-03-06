
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
            modelWidth:"",

            searchHelper:false,             //协作者弹出框开关
            searchModelValue:"",            //搜索内容
            searchNum:0,
            searchModelDataList:[],
            helperBox:[],                   //存放前台协作者数据

            step1_upload_fengmian_src:"",   //封面图片路径(阿里返回路径)
            step2_upload_neirong_src:[],    //列表图片上传列表
            yulan_img:"",                   //步骤二图片预览img的src
            dataItem:{
                Id:"",
                topicId:"",
                name:"",                    //作品名
                description:"",             //描述
                teamworker:"",
                profileImage:"",            //封面图
                jobTag:"",                  //0 作品集 1 作业荚
                artifact_assets:[],         //详情数组
                terms:[],                    //标签数组
            },
            ruleValidate:{
                name:[
                    {required: true, message: '作品名不能为空', trigger: 'blur'},
                    {type: 'string', max: 130, message: '字数请控制在130之内', trigger: 'blur' }
                ],
                description:{required: true, message: '内容说明不能为空', trigger: 'blur'},
                profileImage:{required: true}
            },
            step2_between_arr:[],           //存放step2的数据数组 最后赋值给dataitem
            which_artifact_assets:"",
            file_otherinof_arr:[],         //附加信息
            neirong_truename_arr:[],
            terms_value:"",
            terms_arr:[],
            addTerms:[],
            deleteTerms:[],
            upload_show:false,
            drawerShow:false,
            stepOneActive:true,
            stepTwoActive:false,
            stepThreeActive:false,
            jobTagName:"",
            uploadFlag:true,

            startY:0,
            endY:0,
            dragIndex:0,
            dragItemNeirongData:"",
            dragItemBetweenData:"",
            dragItemOtherinfoData:"",
            dragItemTruenameData:"",
            option: {
              img: '../public/images/default_thumb_500.png',
              size: 1,
              full: true,
              outputType: 'png',
              canMove: true,
              fixedBox: true,
              original: false,
              canMoveBox: true,
              autoCrop: true,
              // 只有自动截图开启 宽度高度才生效
              autoCropWidth: 360,
              autoCropHeight: 360,
              centerBox: true,
              high: true,
              viewMode: 1,
              max: 99999
            },
            show: true,
            fixed: true,
            fixedNumber: [360, 360],
            crap: false,
            previews: {

            },
            previewStyle: {
              'width': '360px',
              'max-height': '360px',
              'overflow': 'hidden',
              'zoom': '0.5'
            },
            previewStyleBig: {
              'overflow': 'hidden',
              'zoom': '0.23'
            },
            copper_modal:false,
        }
    },
    methods: {
        // 实时预览函数
        realTime(data) {

          this.previews = data;
        },
        imgLoad(msg) {
          console.log(msg)
        },
        cropMoving(data) {

        },
        changeScale(num) {
          num = num || 1;
          this.$refs.cropper.changeScale(num);
        },
        teamworkerData(){
          let result = '';
          for(let i = 0; i < this.helperBox.length; i++){
              result = result + this.helperBox[i].fullname;
              if(i != (this.helperBox.length - 1)){
                result = result +'，';
              }
          }
          return result;
        },
        uploadThumbImg(e, num) {
          //上传图片
          // this.option.img
          var file = e.target.files[0]
          if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
            this.$Notice.error({title:"图片类型必须是.gif,jpeg,jpg,png,bmp中的一种！"});
            return false
          }
          var reader = new FileReader()
          reader.onload = (e) => {
            let data
            if (typeof e.target.result === 'object') {
              // 把Array Buffer转化为blob 如果是base64不需要
              data = window.URL.createObjectURL(new Blob([e.target.result]))
            } else {
              data = e.target.result
            }
            this.option.img = data
          }
          // 转化为base64
          // reader.readAsDataURL(file)
          // 转化为blob
          reader.readAsArrayBuffer(file)
        },

        keyDownEvent(){},
        //开始拖动
        dragstart(index,e){
            var eo = e || event;
            this.startY = eo.clientY;
            this.dragIndex = index;
            this.dragItemNeirongData = this.step2_upload_neirong_src[index];
            this.dragItemBetweenData = this.step2_between_arr[index];
            this.dragItemOtherinfoData = this.file_otherinof_arr[index];
            this.dragItemTruenameData = this.neirong_truename_arr[index];
        },
        // 放置
        ondragend (e){
            e.preventDefault();
            let that = this;
            var eo = e || event;
            this.endY = eo.clientY;
            if((this.endY - this.startY) / 60 > 1){
                let endIndex = parseInt((this.endY - this.startY) / 60) + this.dragIndex;
                if(endIndex > this.step2_between_arr.length - 1){
                    endIndex =  this.step2_between_arr.length - 1;
                }
                this.step2_upload_neirong_src.splice(this.dragIndex,1);
                this.step2_between_arr.splice(this.dragIndex,1);
                this.file_otherinof_arr.splice(this.dragIndex,1);
                this.neirong_truename_arr.splice(this.dragIndex,1);

                this.step2_upload_neirong_src.splice(endIndex,0,this.dragItemNeirongData);
                this.step2_between_arr.splice(endIndex,0,this.dragItemBetweenData);
                this.file_otherinof_arr.splice(endIndex,0,this.dragItemOtherinfoData);
                this.neirong_truename_arr.splice(endIndex,0,this.dragItemTruenameData);
            }else if((this.endY- this.startY ) / 60 < -1){
                let endIndex = this.dragIndex - parseInt((this.startY- this.endY ) / 60);
                if( endIndex < 0){
                    endIndex = 0;
                }
                this.step2_upload_neirong_src.splice(this.dragIndex,1);
                this.step2_between_arr.splice(this.dragIndex,1);
                this.file_otherinof_arr.splice(this.dragIndex,1);
                this.neirong_truename_arr.splice(this.dragIndex,1);

                this.step2_upload_neirong_src.splice(endIndex,0,this.dragItemNeirongData);
                this.step2_between_arr.splice(endIndex,0,this.dragItemBetweenData);
                this.file_otherinof_arr.splice(endIndex,0,this.dragItemOtherinfoData);
                this.neirong_truename_arr.splice(endIndex,0,this.dragItemTruenameData);
            }
        },
        addHelpers(){
            this.searchHelper = true;
        },
        searchModelData(){
            let type = "",
                that = this;
            this.searchModelDataList = [];
            if(this.searchModelValue.indexOf("@") >= 0){
                type = 1;
            }else if (config.regexString.phone.test(this.searchModelValue)) {
                type = 3;
            }else{
                type = 2;
            }
            $.ajax({
                url: config.ajaxUrls.searchUserInfoByKeyword,
                type: 'GET',
                data:{keyword:this.searchModelValue,type:type},
                success(res){
                    if (res.status == 200){
                        if (res.data.length >= 4) {
                            for (let i = 0; i < 4; i++) {
                                that.searchModelDataList.push(res.data[i]);
                            }
                        } else {
                            that.searchModelDataList = res.data;
                        }
                        that.searchNum = res.data.length;
                    }else{
                        that.$Notice.error({title:"搜索出错！"});
                    }
                }
            })
        },
        selectItem(index){
            let that = this;
            let flag = 1;
            for (let i = 0; i < this.helperBox.length; i++) {
                if(this.searchModelDataList[index].Id == this.helperBox[i].Id){
                    flag = 0;
                    break;
                }
            }
            if (flag) {
                if (this.helperBox.length < 4) {
                    let newHelperObj = new Object();
                    newHelperObj.Id = this.searchModelDataList[index].Id;
                    newHelperObj.fullname = this.searchModelDataList[index].fullname;
                    that.helperBox.push(newHelperObj);
                } else {
                    this.$Notice.error({title:"协作者最多为4名！"});
                }
            } else {
                this.$Notice.error({title:"该用户已添加为协作者！"});
            }
        },
        deleteHelper(index){
            this.helperBox.splice(index,1);
        },
        clickOk(){
            let teamWorkers = new String();
            teamWorkers = JSON.stringify(this.helperBox);
            this.dataItem.teamworker = teamWorkers;
        },
        /**
         * 步骤一：上传作品封面事件
         */
        openModel:function(){
          $('#step1_upload_fengmian_input').click();
        },
        step2_upload_neirong_change(files){
            let that = this;
            let file = files.target.files[0];
            let fileName = calculate_object_name(files.target.files[0].name);
            this.$Notice.success({title:'上传中···'});
            $.ajax({
                url: '/getSTSSignature/1',
                type: 'GET',
                success:function(res){
                    if (res.res.status == 200) {
                        let client = new OSS({
                      		accessKeyId: res.credentials.AccessKeyId,
                      		accessKeySecret: res.credentials.AccessKeySecret,
                      		stsToken: res.credentials.SecurityToken,
                            bucket:bucket
                    	});
                        client.multipartUpload('images/'+ fileName, file).then(function (res) {
                            let objectPath = 'images/' + fileName;
                            $.ajax({
                                url: config.ajaxUrls.getUrlSignature,
                                type: 'GET',
                                data:{objectPath:objectPath},
                                success:function(res){
                                    that.$Notice.success({title:'上传成功！'});
                                    that.step2_upload_neirong_src = that.step2_upload_neirong_src.concat(res);

                                    let subarr = new Object();
                                    if (that.dataItem.Id) {
                                        subarr.position = that.step2_upload_neirong_src.length - 1;
                                    }else if(that.dataItem.topicId){
                                        subarr.position = that.step2_upload_neirong_src.length - 1;
                                    }else if(that.dataItem.jobTag == 2){
                                        subarr.position = that.step2_upload_neirong_src.length - 1;
                                    }else{
                                        subarr.position = "";
                                    }
                        			subarr.name = "";
                        			subarr.filename = "";
                                    subarr.imagename = files.target.files[0].name;
                        			subarr.description = "";
                        			subarr.type = 1;
                        			subarr.profileImage = fileName;
                        			subarr.mediaFile = "";
                        			subarr.viewUrl = "";
                                    subarr.viewImgUrl = res;
                                    that.step2_between_arr.push(subarr);

                                    let progress_subarr = new Object();
                                    progress_subarr.progress = 0;
                                    progress_subarr.fileTrueName = "";
                                    that.file_otherinof_arr.push(progress_subarr);
                                    that.neirong_truename_arr.push(files.target.files[0].name);

                                    $('#step2_upload_input').val('');
                                }
                            })
                    	});
                    } else if (res.res.status == 999) {
                        that.$Notice.error({
                            title:res.data,
                            duration:3,
                            onClose(){
                                window.location.href = "/login";
                            }
                        });
                    }else if(res.status == 500){
                        that.$Notice.error({
                            title:"上传出现异常，请刷新界面重试！"
                        })
                    }
                }
            })
        },
        /**
         * 更换图片
         */
        step2_upload_change(files){
            let that = this;
            let file = files.target.files[0];
            let fileName = calculate_object_name(files.target.files[0].name);
            this.$Notice.success({title:'上传中···'});
            $.ajax({
                url: '/getSTSSignature/1',
                type: 'GET',
                success:function(res){
                    if (res.res.status == 200) {
                        let client = new OSS({
                      		accessKeyId: res.credentials.AccessKeyId,
                      		accessKeySecret: res.credentials.AccessKeySecret,
                      		stsToken: res.credentials.SecurityToken,
                            bucket:bucket
                    	});
                        client.multipartUpload('images/'+ fileName, file).then(function (res) {
                            let objectPath = 'images/' + fileName;
                            $.ajax({
                                url: config.ajaxUrls.getUrlSignature,
                                type: 'GET',
                                data:{objectPath:objectPath},
                                success:function(res){
                                    that.$Notice.success({title:'上传成功！'});
                                    that.step2_upload_neirong_src.splice(that.which_artifact_assets,1,res);
                                    that.step2_between_arr[that.which_artifact_assets].imagename = files.target.files[0].name;
                                    that.step2_between_arr[that.which_artifact_assets].viewImgUrl = res;
                                    that.step2_between_arr[that.which_artifact_assets].profileImage = fileName;
                                    that.neirong_truename_arr[that.which_artifact_assets] = files.target.files[0].name;

                                    $('.step2_change_upload_input').val('');
                                }
                            })
                    	});
                    } else if (res.res.status == 999) {
                        that.$Notice.error({
                            title:res.data,
                            duration:3,
                            onClose(){
                                window.location.href = "/login";
                            }
                        });
                    }else if(res.status == 500){
                        that.$Notice.error({
                            title:"上传出现异常，请刷新界面重试！"
                        })
                    }
                }
            })
        },
        step2_upload_MP4_change(files){
            this.uploadFlag = false;
            let that = this;
            let file = files.target.files[0];
            let fileTrueName = files.target.files[0].name;
            this.file_otherinof_arr[this.which_artifact_assets].fileTrueName = files.target.files[0].name;
            let fileName = calculate_object_name(files.target.files[0].name);
            this.$Notice.success({title:'上传中···'});
            $.ajax({
                url: config.ajaxUrls.getSTSSignature.replace(":type",4),
                type: 'GET',
                success:function(res){
                    if (res.res.status == 200) {
                        let client = new OSS({
                      		accessKeyId: res.credentials.AccessKeyId,
                      		accessKeySecret: res.credentials.AccessKeySecret,
                      		stsToken: res.credentials.SecurityToken,
                            bucket:bucket
                    	});
                        client.multipartUpload('video/'+ fileName, file, {
                    		progress: progress
                    	}).then(function (res) {
                            that.$Notice.success({title:'上传成功！'});
                            that.step2_between_arr[that.which_artifact_assets].position = that.which_artifact_assets;
                            that.step2_between_arr[that.which_artifact_assets].type = 4;
                            that.step2_between_arr[that.which_artifact_assets].mediaFile = fileName;
                            that.step2_between_arr[that.which_artifact_assets].viewUrl = res.res.requestUrls[0].split("?")[0].split("video/")[1];
                            that.step2_between_arr[that.which_artifact_assets].filename = files.target.files[0].name;

                            $('#step2_upload_MP4_input').val('');
                            that.uploadFlag = true;
                    	});
                    } else if (res.res.status == 999) {
                        that.$Notice.error({
                            title:res.data,
                            duration:3,
                            onClose(){
                                window.location.href = "/login";
                            }
                        });
                    }else if(res.status == 500){
                        that.$Notice.error({
                            title:"上传出现异常，请刷新界面重试！"
                        })
                    }
                }
            })
        },
        step2_upload_PDF_change(files){
            let that = this;
            this.uploadFlag = false;
            let file = files.target.files[0];
            let fileTrueName = files.target.files[0].name;
            this.file_otherinof_arr[this.which_artifact_assets].fileTrueName = files.target.files[0].name;
            let fileName = calculate_object_name(files.target.files[0].name);
            this.$Notice.success({title:'上传中...'});
            $.ajax({
                url: config.ajaxUrls.getSTSSignature.replace(":type",2),
                type: 'GET',
                success:function(res){

                    if (res.res.status == 200) {
                        let client = new OSS({
                      		accessKeyId: res.credentials.AccessKeyId,
                      		accessKeySecret: res.credentials.AccessKeySecret,
                      		stsToken: res.credentials.SecurityToken,
                            bucket:bucket
                    	});
                        client.multipartUpload('pdf/'+ fileName, file, {
                    		progress: progress
                    	}).then(function (res) {
                            that.$Notice.success({title:'上传成功！'});
                            that.step2_between_arr[that.which_artifact_assets].position = that.which_artifact_assets;
                            that.step2_between_arr[that.which_artifact_assets].type = 2;
                            that.step2_between_arr[that.which_artifact_assets].mediaFile = fileName;
                            that.step2_between_arr[that.which_artifact_assets].viewUrl = res.res.requestUrls[0].split("?")[0].split("pdf/")[1];
                            that.step2_between_arr[that.which_artifact_assets].filename = files.target.files[0].name;
                            $('#step2_upload_PDF_btninput').val('');
                            that.uploadFlag = true;
                    	});
                    } else if (res.res.status == 999) {
                        that.$Notice.error({
                            title:res.data,
                            duration:3,
                            onClose(){
                                window.location.href = "/login";
                            }
                        });
                    }else if(res.status == 500){
                        that.$Notice.error({
                            title:"上传出现异常，请刷新界面重试！"
                        })
                    }
                }
            })
        },
        step2_upload_ZIP_change(files){
            let that = this;
            this.uploadFlag = false;
            let file = files.target.files[0];
            let fileTrueName = files.target.files[0].name;
            this.file_otherinof_arr[this.which_artifact_assets].fileTrueName = files.target.files[0].name;
            let fileName = calculate_object_name(files.target.files[0].name);
            this.$Notice.success({title:'上传中...'});
            $.ajax({
                url: config.ajaxUrls.getSTSSignature.replace(":type",3),
                type: 'GET',
                success:function(res){
                    if (res.res.status == 200) {
                        let client = new OSS({
                      		accessKeyId: res.credentials.AccessKeyId,
                      		accessKeySecret: res.credentials.AccessKeySecret,
                      		stsToken: res.credentials.SecurityToken,
                            bucket:bucket
                    	});
                        client.multipartUpload('rar_zip/'+ fileName, file, {
                    		progress: progress
                    	}).then(function (res) {
                            that.$Notice.success({title:'上传成功！'});
                            that.step2_between_arr[that.which_artifact_assets].position = that.which_artifact_assets;
                            that.step2_between_arr[that.which_artifact_assets].type = 3;
                            that.step2_between_arr[that.which_artifact_assets].mediaFile = fileName;
                            that.step2_between_arr[that.which_artifact_assets].viewUrl = res.res.requestUrls[0].split("?")[0].split("rar_zip/")[1];
                            that.step2_between_arr[that.which_artifact_assets].filename = files.target.files[0].name;
                            $('#step2_upload_ZIP_input').val('');
                            that.uploadFlag = true;
                    	});
                    } else if (res.res.status == 999) {
                        that.$Notice.error({
                            title:res.data,
                            duration:3,
                            onClose(){
                                window.location.href = "/login";
                            }
                        });
                    }else if(res.status == 500){
                        that.$Notice.error({
                            title:"上传出现异常，请刷新界面重试！"
                        })
                    }
                }
            })
        },
        step2_upload_HTML5_change(files){
            let isChange = false;
            if(window.location.href.indexOf("editUploadWork") > 0){ //修改
                isChange = true;
            }else{
                isChange = false;
            }
            let that = this;
            this.uploadFlag = true;
            let file = files.target.files[0];
            let fileTrueName = files.target.files[0].name;
            this.file_otherinof_arr[this.which_artifact_assets].fileTrueName = files.target.files[0].name;
            let fileName = calculate_object_name(files.target.files[0].name);
            this.$Notice.success({title:'上传中...'});
            $.ajax({
                url: config.ajaxUrls.getSTSSignature.replace(":type",5),
                type: 'GET',
                success:function(res){
                    if (res.res.status == 200) {
                        let client = new OSS({
                      		accessKeyId: res.credentials.AccessKeyId,
                      		accessKeySecret: res.credentials.AccessKeySecret,
                      		stsToken: res.credentials.SecurityToken,
                            bucket:bucket
                    	});
                        client.multipartUpload('others/'+ fileName, file, {
                    		progress: progress
                    	}).then(function (res) {
                            that.$Notice.success({title:'上传成功！'});
                            that.step2_between_arr[that.which_artifact_assets].position = that.which_artifact_assets;
                            that.step2_between_arr[that.which_artifact_assets].type = 5;
                            that.step2_between_arr[that.which_artifact_assets].mediaFile = fileName;
                            that.step2_between_arr[that.which_artifact_assets].viewUrl = res.res.requestUrls[0].split("?")[0].split("others/")[1];
                            that.step2_between_arr[that.which_artifact_assets].filename = files.target.files[0].name;
                            $('#step2_upload_HTML5_input').val('');
                            that.uploadFlag = true;

                            if (isChange) {
                                $.ajax({
                                    url:"/deleteH5Path/" + that.dataItem.Id,
                                    type:"DELETE"
                                })
                            }
                    	});
                    } else if (res.res.status == 999) {
                        that.$Notice.error({
                            title:res.data,
                            duration:3,
                            onClose(){
                                window.location.href = "/login";
                            }
                        });
                    }else if(res.status == 500){
                        that.$Notice.error({
                            title:"上传出现异常，请刷新界面重试！"
                        })
                    }
                }
            })
        },
        /**
         * 添加标签
         */
        createTerm(){
            if (this.dataItem.Id) {
                let XO = true;
                for(let i=0;i<this.terms_arr.length;i++){
                    if (this.terms_arr[i].name == this.terms_value) {
                        XO = false;
                        this.terms_value = "";
                        this.$Notice.error({title:"该标签已添加!"});
                    }
                }
                if(this.terms_value && XO){
                    let aa = new Object();
                    aa.name = this.terms_value;
                    this.terms_arr.push(aa);
                    this.addTerms.push(aa);
                    this.terms_value = "";
                }
            }else{
                // 新建
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
            }
        },
        /**
         * 删除标签
         */
        deleteLabel(index){
            if (this.dataItem.Id) {
                let XO = false;
                for (var i = 0; i < this.dataItem.terms.length; i++) {
                    if (this.terms_arr[index].name == this.dataItem.terms[i].name) {
                        XO = true;
                        break;
                    }
                }
                if(XO){
                    this.deleteTerms.push(this.terms_arr[index].Id);
                    this.terms_arr.splice(index,1);
                }
            }else{
                this.terms_arr.splice(index,1);
            }
        },
        /**
         * 步骤二：点击左侧列表，控制图片预览src
         */
        selectLi(index){
            if ( this.uploadFlag == true) {
                this.upload_show = true;
                this.yulan_img = this.step2_upload_neirong_src[index];
                this.which_artifact_assets = index;
            } else {
                this.$Notice.error({title:"文件正在上传，请上传成功后切换！"});
            }
        },
        /**
         * 步骤二：点击列表删除
         */
        deleteUploadImg(index){
            this.step2_upload_neirong_src.splice(index,1);
            this.step2_between_arr.splice(index,1);
            this.file_otherinof_arr.splice(index,1);
            this.neirong_truename_arr.splice(index,1);
            if (this.step2_upload_neirong_src.length == 0) {
                this.upload_show = false;
            }
            for(let i=index; i<this.step2_upload_neirong_src.length;i++){
                this.step2_between_arr[i].position = this.step2_between_arr[i].position - 1;
            }
        },
        deleteAttchFile(index){
            let that = this;
            this.$Loading.start();
            let fileType = this.step2_between_arr[index].type,
                fileName = this.step2_between_arr[index].mediaFile;
            $.ajax({
                url: config.ajaxUrls.deleteAliossFile.replace(":fileType",fileType) + "?filename=" + fileName,
                method:"DELETE",
                success:function(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:"附件删除成功!",
                            duration:1,
                            onClose(){
                                that.step2_between_arr[index].type = 0;
                                that.step2_between_arr[index].mediaFile = "";
                                that.step2_between_arr[index].viewUrl = "";
                                that.step2_between_arr[index].filename = "";
                                that.file_otherinof_arr[index].fileTrueName = "";
                                that.file_otherinof_arr[index].progress = 0;
                            }
                        });
                    }else if (res.status == 500) {
                        that.$Notice.error({title:res.data});
                    }
                }
            })
        },
        /* 步骤调整事件 */
        goStep1(){
            this.stepOneActive = true;
            this.stepTwoActive = false;
            this.stepThreeActive = false;
        },
        goStep2(){
            if (this.dataItem.name && this.dataItem.description && this.dataItem.profileImage) {
                if(this.dataItem.Id){
                    this.dataItem.addTerms = this.addTerms;
                    this.dataItem.deleteTerms = this.deleteTerms;
                }
                this.stepOneActive = false;
                this.stepTwoActive = true;
                this.stepThreeActive = false;
                this.dataItem.terms = this.terms_arr;
            }else{
                this.$Notice.error({title:"请输入必填信息！"});
            }

        },
        goStep3(){
            if (this.step2_upload_neirong_src.length) {
                this.stepOneActive = false;
                this.stepTwoActive = false;
                this.stepThreeActive = true;
                this.dataItem.artifact_assets = this.step2_between_arr;
                for(let i=0;i<this.step2_upload_neirong_src.length;i++){
                    let profileImage_url = new String();
                    profileImage_url = this.step2_upload_neirong_src[i];
                    if(profileImage_url.indexOf("pinwall.fzcloud.design-engine.org") > 0){
                        this.dataItem.artifact_assets[i].profileImage = profileImage_url;
                    }else{
                        this.dataItem.artifact_assets[i].profileImage = profileImage_url.split("?")[0].split("images/")[1];
                    }
                }
            }else{
                this.$Notice.error({title:"请输入必填信息！"})
            }
        },
        // 作品上传
        submitData(){
            this.submitDataDelay();
        },
        // 作品上传防抖
        submitDataDebounce(){
            let that = this;
            this.$Loading.start();
            if (this.dataItem.Id) {
              this.clickOk();
              $.ajax({
                    url: config.ajaxUrls.getArtifactsWithId.replace(":id",this.dataItem.Id),
                    method:"PUT",
                    data:this.dataItem,
                    success:function(res){
                        that.$Loading.finish();
                        if (res.status == 200) {
                            that.$Notice.success({
                                title:"上传作品成功，2秒后返回!",
                                duration:2,
                                onClose(){
                                    // window.location.href="/project/" + that.dataItem.Id;
                                    self.location=document.referrer;
                                }
                            });
                        }else if (res.status == 500) {
                            that.$Notice.error({title:res.data});
                        }
                    }
              })
            }else{
                $.ajax({
                    url: config.ajaxUrls.getArtifacts,
                    method:"POST",
                    data:this.dataItem,
                    success:function(res){
                        that.$Loading.finish();
                        if (res.status == 200) {
                            that.$Notice.success({
                                title:"上传作品成功，2秒后返回!",
                                duration:2,
                                onClose(){
                                    self.location=document.referrer;
                                }
                            });
                        }else if (res.status == 500) {
                            that.$Notice.error({title:res.data});
                        }
                    }
                })
            }
        },
        modelOk:function(){
          let that = this;
          let fileFullName = $("#step1_upload_fengmian_input").val();

          if (fileFullName != '') {
            let fileName = calculate_object_name(fileFullName);
            this.$Notice.success({title:'上传中···'});
            this.$refs.cropper.getCropBlob((data) => {
              let file = new File([data], fileName, { type: data.type }); //blob转file
              $.ajax({
                  url: '/getSTSSignature/1',
                  type: 'GET',
                  success:function(res){
                      if (res.res.status == 200){
                          let client = new OSS({
                            accessKeyId: res.credentials.AccessKeyId,
                            accessKeySecret: res.credentials.AccessKeySecret,
                            stsToken: res.credentials.SecurityToken,
                              bucket:bucket
                        });

                        client.multipartUpload('images/'+ fileName, file).then(function (res) {
                          if(res.res.status == 200){
                            that.$Notice.success({title:'上传成功！'});
                            that.dataItem.profileImage = fileName;
                          }
                          else{
                            that.$Notice.success({title:'上传失败！'});
                          }

                        });
                      }else if (res.res.status == 999) {
                          that.$Notice.error({
                              title:res.data,
                              duration:3,
                              onClose(){
                                  window.location.href = "/login";
                              }
                          });
                      }else if(res.status == 500){
                          that.$Notice.error({
                              title:"获取签名异常，请重试！"
                          })
                      }
                  }
              })
            });
          }else{
              this.$Notice.error({title:"请上传图片！"});
          }
        },
        modelCancel:function(){

        },
    },
    created(){
        let that = this;
        this.containerStyle.minHeight = document.documentElement.clientHeight - 140 + "px";
        if(document.documentElement.clientWidth > 1200){
            this.modelWidth = "950px";
        }else if(document.documentElement.clientWidth < 1200){
            this.modelWidth = "70%";
        }else if(document.documentElement.clientWidth < 992){
            this.modelWidth = "80%";
        }

        if(window.location.href.indexOf("editUploadWork") > 0){       //修改
            this.dataItem.Id = window.location.search.split("?id=")[1].split("&jobTag=")[0];
            this.dataItem.jobTag = window.location.search.split("?id=")[1].split("&jobTag=")[1];
            if(this.dataItem.jobTag == 1){
                this.jobTagName = "作业";
            }else{
                this.jobTagName = "作品集";
            }
            $.ajax({
                url: config.ajaxUrls.getArtifactsWithId.replace(":id",this.dataItem.Id),
                type: 'GET',
                success(res){
                    that.dataItem.name = res.data.name;
                    that.dataItem.artifact_assets = res.data.artifact_assets;
                    that.dataItem.description = res.data.description;
                    let teamWorkers = new Array();
                    if (res.data.teamworker == "" || res.data.teamworker == null) {
                        teamWorkers = [];
                    } else {
                        teamWorkers = JSON.parse(res.data.teamworker);
                    }
                    that.helperBox = teamWorkers;

                    //that.step1_upload_fengmian_src = res.data.profileImage;
                    that.option.img = res.data.profileImage;
                    if(res.data.storageTag == 1){
                        that.dataItem.profileImage = res.data.profileImage;
                    }else{
                        that.dataItem.profileImage = res.data.profileImage.split("/")[res.data.profileImage.split("/").length - 1].split("?")[0];
                    }

                    that.dataItem.terms = res.data.terms;
                    for(let i=0;i<res.data.terms.length;i++){
                        let term = new Object();
                        term = res.data.terms[i];
                        that.terms_arr.push(term);
                    }

                    for (var i = 0; i < res.data.artifact_assets.length; i++) {
                        that.step2_upload_neirong_src.push(res.data.artifact_assets[i].profileImage);

                        let bet = new Object();
                        bet.position = res.data.artifact_assets[i].position;
                        bet.name = res.data.artifact_assets[i].name;
                        bet.filename = res.data.artifact_assets[i].filename;
                        bet.imagename = res.data.artifact_assets[i].imagename;
                        bet.description = res.data.artifact_assets[i].description;
                        bet.type = res.data.artifact_assets[i].type;
                        bet.profileImage = res.data.artifact_assets[i].profileImage;
                        if(res.data.artifact_assets[i].mediaFile == null || res.data.artifact_assets[i].mediaFile == "" || res.data.storageTag == 1){
                            bet.mediaFile = res.data.artifact_assets[i].mediaFile;
                        }else{
                            bet.mediaFile = res.data.artifact_assets[i].mediaFile.split("?")[0].split("/")[res.data.artifact_assets[i].mediaFile.split("?")[0].split("/").length - 1];
                        }
                        bet.viewUrl = res.data.artifact_assets[i].viewUrl;
                        bet.viewImgUrl = res.data.artifact_assets[i].profileImage;
                        that.step2_between_arr.push(bet);

                        let other = new Object();
                        other.fileTrueName = res.data.artifact_assets[i].filename;
                        other.progress =  res.data.artifact_assets[i].mediaFile ? '100' : "0";
                        that.file_otherinof_arr.push(other);

                        that.neirong_truename_arr.push(res.data.artifact_assets[i].imagename);
                    }
                }
            });
        }else if(window.location.href.indexOf("topicId") > 0){
            this.dataItem.jobTag = window.location.href.split("uploadWork/")[1].split("?")[0];
            this.dataItem.topicId = window.location.href.split("topicId=")[1];
            if(this.dataItem.jobTag == 1){
                this.jobTagName = "作业";
            }else{
                this.jobTagName = "作品集";
            }
        }else{
            this.dataItem.jobTag = window.location.href.split("uploadWork/")[1].split("?")[0];
            this.dataItem.topicId = 0;
            if(this.dataItem.jobTag == 1){
                this.jobTagName = "作业";
            }else{
                this.jobTagName = "作品集";
            }
        }
    },
    mounted() {
        // 作品上传防抖注册
        this.submitDataDelay = _.debounce(this.submitDataDebounce, 1000, {
            'leading': true,
            'trailing': false
        })
    },
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
	g_object_name = random_string(20) + suffix;

    return g_object_name;
}

var progress = function (p) {
	return function (done) {
		container.file_otherinof_arr[container.which_artifact_assets].progress = p * 100;
		done();
	}
};
