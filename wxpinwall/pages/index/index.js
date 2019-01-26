Page({
    data:{
        visible: "hide"
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