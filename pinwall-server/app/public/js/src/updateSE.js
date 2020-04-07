var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                margin:""
            },
            drawerShow:false,
            insertData:"",
            updateData:""
        }
    },
    methods: {
        InsertData(){
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: config.ajaxUrls.transterInsertDataToES,
                type: 'GET',
                data: {ids: this.insertData},
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:res.data,
                            duration:1,
                            onClose(){
                                window.location.href = '/updateSE';
                            }
                        });
                    } else {
                        that.$Loading.error();
                        that.$Notice.error({
                            title:res.data,
                        });
                    }
                }
            });
        },
        UpdateData(){
            let that = this;
            this.$Loading.start();
            $.ajax({
                url: config.ajaxUrls.transterUpdateDataToES,
                type: 'GET',
                data: {ids: this.updateData},
                success(res){
                    if (res.status == 200) {
                        that.$Loading.finish();
                        that.$Notice.success({
                            title:res.data,
                            duration:1,
                            onClose(){
                                window.location.href = '/updateSE';
                            }
                        });
                    } else {
                        that.$Loading.error();
                        that.$Notice.error({
                            title:res.data,
                        });
                    }
                }
            });
        }
    },
    computed:{
        insertDisable(){
            if (this.insertData) {
                return false;
            } else {
                return true;
            }
        },
        updateDisable(){
            if (this.updateData) {
                return false;
            } else {
                return true;
            }
        }
    },
    created(){
        let clientHeight = document.documentElement.clientHeight;
        this.containerStyle.margin = ( clientHeight - 560 ) / 2 + "px auto";
    }
})
