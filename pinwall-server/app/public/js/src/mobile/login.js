function check(){
    if($(".email_login_panel").length > 0){
      $('#myform').attr('action','/mobilelogin');
      var username = $("#emailorphone").val();
      var password = $("#pwd").val();
      if(username == '' || password == ''){
        $('.tips').show();
        $('.tips').html('请输入用户名和密码');
        return false
      }else{
        $('.tips').hide();
        return true
      }
    }
    else if($(".mobile_login_panel").length > 0){
      $('#myform').attr('action','/mobileAuthCodeLogin');
      var username = $("#mobile").val();
      var password = $("#code").val();
      if(username == '' || password == ''){
        $('.tips').show();
        $('.tips').html('请输入手机号和验证码');
        return false;
      }else{
        $('.tips').hide();
        return true;
      }
    }
    else{
      return false;
    }
}

new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{

  },
  data: {
    count_seconds:0,
    login_btn_status:'type_panel_menu_selected',
    mobile_btn_status:'type_panel_menu_normal',
    template_html1: '<div class="email_login_panel" >' +
        '<input id="emailorphone" name="username" placeholder="请输入邮箱或者手机号" class="emailorphone">' +
        '<input id="pwd" name="password" type="password" placeholder="请输入密码" class="pwd" >' +
      '</div>',
    template_html2: '<div class="mobile_login_panel" >' +
        '<input id="mobile" name="username" placeholder="请输入手机号" class="mobile" type="text">' +
        '<input id="code" name="password" placeholder="请输入验证码" class="code" type="text">' +
        '<div class="auth_code_btn" @click="sendSMSMessage">获取验证码</div>' +
      '</div>',
  },
  methods: {
    emailClick:function(){
      this.login_btn_status = 'type_panel_menu_selected';
      this.mobile_btn_status = 'type_panel_menu_normal';

      $("#form_content").empty();
      $(".tips").empty();
      $("#result_message").empty();
      $("#form_content").append(this.template_html1);
      if(window.localStorage){
        window.localStorage.setItem("login_btn_status", 1);
      }
    },
    mobileClick:function(){
      this.login_btn_status = 'type_panel_menu_normal';
      this.mobile_btn_status = 'type_panel_menu_selected';

      $("#form_content").empty();
      $(".tips").empty();
      $("#result_message").empty();
      $("#form_content").append(this.template_html2);
      if(window.localStorage){
        window.localStorage.setItem("login_btn_status", 2);
      }
    },
    backClick:function(){
      if(window.localStorage){
        let path = window.localStorage.getItem("loginPrePath");
        if(path && path != ''){
          window.location.href = path;
        }
      }else{
        window.history.back(-1);
      }
    },
    settime:function(val) {
      let that = this;
      if (this.count_seconds == 0) {
          val.text("获取验证码");
      } else {
          val.text("重新发送(" + this.count_seconds + ")");
          this.count_seconds--;
          setTimeout(function() {
              that.settime(val);
          },1000)
      }
    },
    sendSMSMessage:function(){
      let that = this;
      let url =  '/website/sms/sendMessage';
      let mobile = $("#mobile").val();

      if(!(/^1[0-9]{10}$/.test(mobile))){
        this.$Message.warning("手机号码有误，请重填!");
        return;
      }

      if(this.count_seconds != 0){
        this.$Message.warning('请等待'+this.count_seconds+'秒后再操作！');
      }else{

        if(mobile != null || mobile != ''){
          let data = {mobile:mobile};
          this.$Loading.start();
          $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: data
          })
          .done(function(responseData) {
            if(responseData.status == 200){
              that.$Message.success(responseData.data);
              that.count_seconds = 60;
              that.settime($(".auth_code_btn"));
            }
            else{
              that.$Message.warning(responseData.data);
              this.$Loading.error();
            }

          })
          .fail(function() {
            that.$Message.error('发送失败!');
            this.$Loading.error();
          });
        }
        else{
          this.$Message.warning('请输入手机号码！');
          this.$Loading.finish();
        }
      }
    }
  },
  created() {
    this.count_seconds = 0;
    if(window.localStorage){
      let login_btn_status = window.localStorage.getItem("login_btn_status");
      if(login_btn_status && login_btn_status == 1){
        this.login_btn_status = 'type_panel_menu_selected';
        this.mobile_btn_status = 'type_panel_menu_normal';
        $("#form_content").empty();
        $("#form_content").append(this.template_html1);
      }
      else if(login_btn_status && login_btn_status == 2){
        this.login_btn_status = 'type_panel_menu_normal';
        this.mobile_btn_status = 'type_panel_menu_selected';
        $("#form_content").empty();
        $("#form_content").append(this.template_html2);
      }
    }
  }
})
