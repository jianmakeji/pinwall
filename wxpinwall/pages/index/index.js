Page({
    data:{
        visible: "show"
    },
    bindtap(event){
        // console.log(event);
        this.setData({
            visible:"show"
        })
    },
    unsubmit(){
        this.setData({
            visible: "hide"
        })
    }
})