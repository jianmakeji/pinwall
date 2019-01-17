var index = new Vue({
    el: '.index',
    data(){
        return{
            containerStyle:{
                minHeight:"",
            },
            drawerShow:false,
            insertData:"",
            updateData:""
        }
    },
    methods: {
        InsertData(){
            let that = this;
            $.ajax({
                url: config.ajaxUrls.transterInsertDataToES,
                type: 'GET',
                data: {ids: this.insertData},
                success(res){
                    if (res.status == 200) {
                        that.$Notice.success({
                            title:res.data,
                            onClose(){
                                window.location.href = '/updateSE';
                            }
                        });
                    } else {
                        that.$Notice.error({
                            title:res.data,
                        });
                    }
                }
            });
        },
        UpdateData(){
            let that = this;
            $.ajax({
                url: config.ajaxUrls.transterUpdateDataToES,
                type: 'GET',
                data: {ids: this.updateData},
                success(res){
                    if (res.status == 200) {
                        that.$Notice.success({
                            title:res.data,
                            onClose(){
                                window.location.href = '/updateSE';
                            }
                        });
                    } else {
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
    }
})
