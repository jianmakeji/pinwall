function goBackLoginPage(){
  window.location.href = '/mobile/login';
}

new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{

  },
  data: {
    mobile:'',
    code:'',
    pwd1:'',
    pwd2:'',
    count_seconds:0,
  },
  methods: {
    backClick:function(){
      window.history.back(-1);
    },
    findPwdClick:function(){
      if(this.mobile == ''){
        this.$Message.warning('请输入手机号码!');
        return;
      }

      if(!(/^1[0-9]{10}$/.test(this.mobile))){
        this.$Message.warning("手机号码有误，请重填");
        return;
      }

      if(this.code == ''){
        this.$Message.warning('请输入验证码!');
        return;
      }

      if(this.pwd1 == '' || this.pwd2 == ''){
        this.$Message.warning('请输入密码!');
        return;
      }

      if(this.pwd1 != this.pwd2){
        this.$Message.warning('两次输入密码不一样!');
        return;
      }

      let that = this;
      this.$Loading.start();
      $.ajax({
        url: '/website/users/updatePwdWithMobile',
        type: 'put',
        dataType: 'json',
        data: {
          mobile:that.mobile,
          smsCode:that.code,
          newPwd:that.pwd1,
        }
      })
      .done(function(responseData) {
        if(responseData.status == 200){
          that.$Message.success(responseData.data);
          setTimeout(goBackLoginPage(),2000);
        }else{
          that.$Message.warning(responseData.data);
          that.$Loading.error();
        }
      })
      .fail(function() {
        that.$Loading.error();
      })
      .always(function() {
        console.log("complete");
        that.$Loading.finish();
      });
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

      if(this.count_seconds != 0){
        this.$Message.warning('请等待'+this.count_seconds+'秒后再操作！');
      }else{

        if(this.mobile != null || this.mobile != ''){
          let data = {mobile:this.mobile};
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
              that.$Loading.error();
            }
          })
          .fail(function() {
            that.$Message.error('发送失败!');
            that.$Loading.error();
          })
          .always(function() {
            that.$Loading.finish();
          });
        }
        else{
          this.$Message.warning('请输入手机号码！');

        }
      }
    }
  },
  created() {
    this.count_seconds = 0;
  }
})
