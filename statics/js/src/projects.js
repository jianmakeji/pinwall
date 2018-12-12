var projects = new Vue({
    el: '.projects',
    data(){
        return{
            projectStyle:{
                width: "100%",
                minHeight:""
            },
            commentValue:"",
            userId:"1"
        }
    },
    methods: {
        closeThePage(){
            console.log("closeThePage");
        },
        zan(event){
            console.log(event);
        },
        deleteComment(){
            console.log("deleteComment");
        },
        addComment(){
            console.log("addComment");
        },
        login(){
            console.log("goLogin!");
        }
    },
    created(){
        this.projectStyle.minHeight = document.documentElement.clientHeight + "px";
    }
})
