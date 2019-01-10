
var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                minHeight:"",
            },
            pwdItem:{
                password:"",
                newPwd:""
            },
            drawerShow:false,
        }
    },
    methods: {
        restPwd(){
            let that = this;
            $.ajax({
                url: '/website/users/updatePwd',
                type: 'PUT',
                data: this.pwdItem,
                success(res){
                    if (res.status == 200) {
                        that.$Notice.success({
                            title:res.data,
                            duration:1,
                            onClose(){
                                window.location.href = "/resetInfo";
                            }
                        })
                    }else{
                        that.$Notice.error({
                            title:res.data
                        })
                    }
                }
            });
        }
    },
    created(){
        this.containerStyle.minHeight = document.documentElement.clientHeight - 140 + "px";

    }
})
