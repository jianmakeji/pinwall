function check(){
    if($(".email_login_panel").length > 0){
      $('#myform').attr('action','/mobilelogin');
      var username = $("#emailorphone").val();
      var password = $("#pwd").val();
      console.log(username);
      console.log(password);
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
    emailorphone:'',
    pwd:'',
    mobile:'',
    code:'',
    login_btn_status:'type_panel_menu_selected',
    mobile_btn_status:'type_panel_menu_normal',
    template_html1: '<div class="email_login_panel" >' +
        '<input id="emailorphone" name="username" placeholder="请输入邮箱或者手机号" class="emailorphone">' +
        '<input id="pwd" name="password" type="password" placeholder="请输入密码" class="pwd" >' +
      '</div>',
    template_html2: '<div class="mobile_login_panel" >' +
        '<input id="mobile" name="username" placeholder="请输入手机号" class="mobile" >' +
        '<input id="code" name="password" placeholder="请输入验证码" class="code" >' +
        '<button class="auth_code_btn">获取验证码</button>' +
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
  },
  created() {
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
