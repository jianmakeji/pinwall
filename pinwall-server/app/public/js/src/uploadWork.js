var index = new Vue({
    el: '.index',
    data(){
        return{
            // step1
            buttonType:"success",	//error
            iconImg:"ios-brush",	//md-close
            // stepNum:0,
            stepOneActive:true,
            stepTwoActive:false,
            stepThreeActive:false,
            // step1:true,
            // step2:false,
            // step3:false,
            containerStyle:{
                minHeight:""
            },
            userName:"甘四球", //用户的名称
            formItem:{
                title:""
            }
        }
    },
    methods: {
        /* 步骤调整事件 */
        goStep1(){
            this.stepOneActive = true;
            this.stepTwoActive = false;
            this.stepThreeActive = false;
            // this.stepNum = 0;
        },
        goStep2(){
            this.stepOneActive = false;
            this.stepTwoActive = true;
            this.stepThreeActive = false;
            // this.stepNum = 1;
        },
        goStep3(){
            this.stepOneActive = false;
            this.stepTwoActive = false;
            this.stepThreeActive = true;
            // this.stepNum = 2;
        },
        /* step1 事件 */
        // 标签点击删除
        deleteLabel(index){
            console.log("deleteLabel",index);

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
        selectLi(index){
            console.log("selectLi",index);
        },
        deleteUploadImg(index){
            console.log("deleteUploadImg",index);
        },
        step1_upload_change(){

        },
        step2_upload_change(){

        },
        step3_upload_change(){
            console.log("++++++++++");
        }
    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 140 + "px";
    }
})

$(document).ready(function(){
    $('#step1_upload_btn').click(function(){
        $('#step1_upload_input').click();
    });
    $('#step2_upload_btn').click(function(){
        $('#step2_upload_input').click();
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
});
