var app = new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  data: {
    mobile1:'',
    code1:'',
    mobile2:'',
    code2:'',
    fullname:'',
    password1:'',
    password2:'',
    count_seconds2:0,
    count_seconds1:0,
  },
  methods: {
    backClick:function(){
      if(window.localStorage){
        let path = window.localStorage.getItem("loginPrePath");
        if(path && path != ''){
          window.location.href = path;
        }
        else{
          window.location.href = '/mobile/login';
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
    sendSMSMessage1:function(){
      let that = this;
      let url =  '/website/sms/sendMessage';

      if(this.mobile1 == ''){
        this.$Message.warning('请输入手机号码!');
        return;
      }

      if(!(/^1[0-9]{10}$/.test(this.mobile1))){
        this.$Message.warning("手机号码有误，请重填!");
        return;
      }

      if(this.count_seconds1 != 0){
        this.$Message.warning('请等待'+this.count_seconds1+'秒后再操作！');
      }else{

        if(this.mobile1 != null || this.mobile1 != ''){
          let data = {mobile:this.mobile1};

          $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: data
          })
          .done(function(responseData) {
            if(responseData.status == 200){
              that.$Message.success(responseData.data);
              that.count_seconds1 = 60;
              that.settime($(".auth_code_btn1"));
            }
            else{
              that.$Message.warning(responseData.data);
            }

          })
          .fail(function() {
            that.$Message.error('发送失败!');
          });

        }
        else{
          this.$Message.warning('请输入手机号码！');
        }
      }
    },
    sendSMSMessage2:function(){
      let that = this;
      let url =  '/website/sms/sendMessage';

      if(this.mobile2 == ''){
        this.$Message.warning('请输入手机号码!');
        return;
      }

      if(!(/^1[0-9]{10}$/.test(this.mobile2))){
        this.$Message.warning("手机号码有误，请重填!");
        return;
      }

      if(this.count_seconds2 != 0){
        this.$Message.warning('请等待'+this.count_seconds2+'秒后再操作！');
      }else{

        if(this.mobile2 != null || this.mobile2 != ''){
          let data = {mobile:this.mobile2};

          $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: data
          })
          .done(function(responseData) {
            if(responseData.status == 200){
              that.$Message.success(responseData.data);
              that.count_seconds2 = 60;
              that.settime($(".auth_code_btn2"));
            }
            else{
              that.$Message.warning(responseData.data);
            }

          })
          .fail(function() {
            that.$Message.error('发送失败!');
          });

        }
        else{
          this.$Message.warning('请输入手机号码！');
        }
      }
    },
    btn1Click:function(){
      let that = this;
      let url = "/website/users/h5BindWeixinInfoByMobile";
      if(this.mobile1 == ''){
        this.$Message.warning('请输入手机号!');
        return;
      }

      if(this.code1 == ''){
        this.$Message.warning('请输入验证码!');
        return;
      }
      let data = {};
      data.mobile = this.mobile1;
      data.code = this.code1;
      $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data
      })
      .done(function(responseData) {
        if(responseData.status == 200){
          that.$Message.success(responseData.data);
          var preurl = window.localStorage.getItem('wx_prev_url');
          if(preurl && preurl != ''){
            window.location.href = preurl;
          }
          else{
            window.location.href = '/mobile';
          }
        }
        else{
          that.$Message.warning(responseData.data);
        }
      })
      .fail(function() {
        that.$Message.error('发送失败!');
      });
    },

    btn2Click:function(){
      let that = this;
      let url = "/website/users/h5CreateNewWeixinInfoByMobile";

      if(this.mobile2 == ''){
        this.$Message.warning('请输入手机号!');
        return;
      }

      if(this.fullname == ''){
        this.$Message.warning('请输入姓名!');
        return;
      }

      if(this.code2 == ''){
        this.$Message.warning('请输入验证码!');
        return;
      }

      if(this.password1 == '' || this.password2 == ''){
        this.$Message.warning('请输入密码!');
        return;
      }

      if(this.password1 != this.password2){
        this.$Message.warning('两次输入密码不一致!');
        return;
      }

      let data = {
        mobile:this.mobile2,
        fullname:this.fullname,
        code:this.code2,
        password:this.password1
      };

      $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data
      })
      .done(function(responseData) {
        if(responseData.status == 200){
          that.$Message.success(responseData.data);
          setTimeout(function(){
            var preurl = window.localStorage.getItem('wx_prev_url');
            if(preurl && preurl != ''){
              window.location.href = preurl;
            }
            else{
              window.location.href = '/mobile';
            }
          },1500);
        }
        else{
          that.$Message.warning(responseData.data);
        }

      })
      .fail(function() {
        that.$Message.error('发送失败!');
      });
    }
  }
});
