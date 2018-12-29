var index = new Vue({
    el: '.index',
    data() {
        return {
            containerStyle: {
                "margin": "",
            },
            single: true,
            drawerShow: false,

            username: "",
            password: "",

            userId: "1",

        }
    },
    methods: {
        localStorage() {
            if (this.single) {
                window.localStorage.setItem("username", this.username);
                window.localStorage.setItem("password", this.password);
            } else {
                window.localStorage.removeItem("username");
                window.localStorage.removeItem("password");
            }
        }
    },
    created() {
        this.containerStyle.margin = (document.documentElement.clientHeight - 400) / 2 - 90 + "px auto";
        let that = this;
        if (document.documentElement.clientWidth > 1200) {
            this.modelWidth = "60%";
        } else if (document.documentElement.clientWidth < 1200) {
            this.modelWidth = "70%";
        } else if (document.documentElement.clientWidth < 992) {
            this.modelWidth = "80%";
        }

        if (this.single) {
            this.username = window.localStorage.getItem("username");
            this.password = window.localStorage.getItem("password");
        }

        // $(document).ready(function() {
        //     $(".ivu-form").attr('action', '/login');
        //     $(".ivu-form").attr('method', 'post');
        //     // $(".submit").click(function() {
        //     //     $(".ivu-form").submit();
        //     // });
        //
        //
        // });
    }
})

function check(form) {
    var usernameExp = new RegExp("^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$");
    var passwordExp = new RegExp("^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$");
    if (!usernameExp.test(form.username.value)) {
        index.$Notice.error({title:"请输入正确的邮箱格式！",duration:2});
        form.username.focus();
        return false
    }
    if (form.password.value.length < 6) {
        index.$Notice.error({title:"密码位数至少6位！",duration:2});
        form.password.focus();
        return false
    }
    return true;
}
