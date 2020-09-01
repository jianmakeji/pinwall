new Vue({
  el: '#content',
  delimiters: ['${', '}'],
  components:{

  },
  data: {
    email_panel_show:1,
    mobile_panel_show:0,
    emailorphone:'',
    pwd:'',
    mobile:'',
    code:'',
    login_btn_status:'type_panel_menu_selected',
    mobile_btn_status:'type_panel_menu_normal',
  },
  methods: {
    emailClick:function(){
      this.email_panel_show = 1;
      this.mobile_panel_show = 0;
      this.login_btn_status = 'type_panel_menu_selected';
      this.mobile_btn_status = 'type_panel_menu_normal';
    },
    mobileClick:function(){
      this.email_panel_show = 0;
      this.mobile_panel_show = 1;
      this.login_btn_status = 'type_panel_menu_normal';
      this.mobile_btn_status = 'type_panel_menu_selected';
    }
  },
  created() {
    let that = this;
    $.ajax({
      url: '',
      type: 'get',
      dataType: 'json',
      data: {
        limit: 10,
        offset: 0,
        status: 1,
        userId: -1,
      }
    })
    .done(function(responseData) {
      that.dataList = responseData.data.rows;
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  }
})
