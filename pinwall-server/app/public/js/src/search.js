Vue.use(VueLazyload)
var index = new Vue({
    el: '.index',
    data(){
        return{
            aoData:{limit:12,offset:0,keyword:""},
            containerStyle:{
                minHeight:""
            },
            searchPanelStyle:{
                margin:"",
                width:""
            },
            drawerShow:false,
            scrollModel:true,
            modelWidth:"",
            // 搜索弹出层
            searchModel:true,  /* 搜索弹出层model */
            searchModelValue:"",    /*搜索内容*/
            searchModelDataList:[],
            columns1:[
                {title:"搜索结果",key:"text"}
            ],
            dataList:[]
        }
    },
    methods: {
        searchDataChange(data){
            let value = data.target.value;
            let that = this;
            $.ajax({
                url: config.ajaxUrls.suggestKeyWords,
                type: 'GET',
                data: {keyword: value},
                success(res){
                    if (res.status == 200) {
                        that.searchModelDataList = res.data;
                    }
                }
            });
        },
        // 回车搜索
        searchModelData(){
            let that = this;
            this.searchModel = false;
            this.aoData.keyword = this.searchModelValue;
            getData(that);
        },
        toSearch(value){
            let that = this;
            this.searchModelValue = value;
            this.searchModel = false;
            this.aoData.keyword = value;
            getData(that);
        },
        // 搜索结果字段选择
        selectItem(data){
            let that = this;
            this.searchModelValue = data.text;
            this.searchModel = false;
            this.aoData.keyword = data.text;
            getData(that);
        },
    },
    created(){
        let that = this;
        let clientWidth = document.documentElement.clientWidth;
        let clientHeight = document.documentElement.clientHeight;
        if (clientHeight < 600) {
            this.searchPanelStyle.margin = "0px auto";
        } else {
            this.searchPanelStyle.margin = (clientHeight - 600) / 2 + "px auto";
        }
        this.containerStyle.minHeight = clientHeight - 400 + "px";
        if(clientWidth > 1200){
            this.searchPanelStyle.width = "950px";
        }else if(clientWidth < 1200 && clientWidth > 992){
            this.searchPanelStyle.width = "70%";
        }else if(clientWidth < 992 && clientWidth > 540){
            this.searchPanelStyle.width = "80%";
        }else{
            this.searchPanelStyle.width = "96%";
        }
    }
})
$(document).ready(function() {
    //每次刷新界面滚动条置顶
    $('html,body').animate({scrollTop:0});
    /**
     * 滚动条滚动监听
     */
    $(window).scroll(function() {
        if ($(document).scrollTop() >= $(document).height() - $(window).height() - 10 && index.scrollModel) {
            index.aoData.offset += 12;
            index.aoData.keyword = index.searchModelValue;

            getMoreData(index);
        }
    })
});

function getData(that){
    that.$Loading.start();
    $.ajax({
        url: config.ajaxUrls.searchByKeywords,
        type: 'GET',
        data: that.aoData,
        success:function(res){
            if (res.status == 200) {
                that.$Loading.finish();
                that.dataList = res.data.hits;
                that.searchModel = false;
                if (that.dataList.length == res.data.total) {
                    that.scrollModel = false;
                }else {
                    that.scrollModel = true;
                }
            }else{
                that.$Loading.error();
                that.$Notice.error({title:res.data});
            }
        }
    })
}
function getMoreData(index){
    index.$Loading.start();
    $.ajax({
        url: config.ajaxUrls.searchByKeywords,
        type: 'GET',
        data: index.aoData,
        success:function(res){
            index.$Loading.finish();
            index.dataList = index.dataList.concat(res.data.hits);
            if (index.dataList.length == res.data.total) {
                index.scrollModel = false;
            }else {
                index.scrollModel = true;
            }
        }
    })
}
