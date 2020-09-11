var HeaderMenu = {
  data: function () {
    return {
      menu_show:0,
    }
  },
  props:{
    menuItemNum:Number,
    userId:Number,
    avatarUrl:String,
    fullname:String,
  },
  methods: {
    menuClick:function(){
      this.menu_show = 1;
      $(".pop_menu").addClass("animate__animated animate__slideInDown");
      $(".pop_menu").removeClass("animate__slideOutUp");
    },
    menuCloseClick:function(){
      $(".pop_menu").removeClass("animate__slideInDown");
      $(".pop_menu").addClass("animate__animated animate__slideOutUp");
    },
    registerLoginBtnClick:function(){
      let path = window.location.pathname + window.location.search;
      if(window.localStorage){
        window.localStorage.setItem("loginPrePath", path);
      }
      window.location.href = "/mobile/login";
    },
    choicenessClick:function(){
      window.location.href = "/mobile";
    },
    graduateClick:function(){
      window.location.href = "/mobile/graduate";
    },
    homeworkClick:function(){
      window.location.href = "/mobile/workpod";
    },
    searchClick:function(){
      window.location.href = "/mobile/search";
    }
  },
  created() {

  },
  template:'<div class="menu_top_layer"><div class="menu_banner">'+
    '<div class="menu_icon_area">'+
      '<img src="/public/images/mobile/menu.png" @click="menuClick" class="menu_icon" /><span>图钉墙<span>'+
    '</div>'+
    '<div class="search_icon_area" @click="searchClick">'+
      '<img src="/public/images/mobile/search.png" class="menu_icon" />'+
    '</div>'+
  '</div>'+
  '<div class="pop_menu" v-show="menu_show">'+
    '<div class="pop_menu_top_banner">'+
      '<img src="/public/images/mobile/close.png" class="close_img" @click="menuCloseClick"/><span class="pop_menu_title">图钉墙</span>'+
    '</div>'+
    '<div class="register_login_btn" @click="registerLoginBtnClick">登录 / 注册</div>'+
    '<div class="pop_menu_item" @click="choicenessClick">'+
        '<span>精选</span>'+
        '<img src="/public/images/mobile/right_arrow.png"/>'+
    '</div>'+
    '<div class="pop_menu_item" @click="graduateClick">'+
        '<span>毕设展</span>'+
        '<img src="/public/images/mobile/right_arrow.png"/>'+
    '</div>'+
    '<div class="pop_menu_item" @click="homeworkClick">'+
        '<span>作业荚</span>'+
        '<img src="/public/images/mobile/right_arrow.png"/>'+
    '</div>'+
    '<div class="pop_menu_item" @click="searchClick">'+
        '<span>探索</span>'+
        '<img src="/public/images/mobile/right_arrow.png"/>'+
    '</div>'+
  '</div></div>',

}
