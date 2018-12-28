var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                "margin":"",
            },
            drawerShow:false,
            formItem:{
                username:"",
                password:""
            },


            userId:"1",

        }
    },
    methods: {
        onRegister(){
            console.log("onRegister");

            $.ajax({
              url: '/login',
              type: 'POST',
              data: this.formItem,
              success(res){
                console.log(res);
              }
            });

        },
        onRecoverPwd (){
            console.log("onRecoverPwd");
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

        $(document).ready(function() {
          $(".ivu-form").attr('action', '/login');
          $(".ivu-form").attr('method', 'post');

                      console.log("*****",$(".ivu-form").attr("action"));
                      console.log("*****",$(".ivu-form").attr("method"));
          $("#submitBtn").click(function(){

            $(".ivu-form").submit();
          });

        });
    }
})
