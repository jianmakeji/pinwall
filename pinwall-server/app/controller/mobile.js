'use strict';

const Controller = require('egg').Controller;
const BaseController = require('./BaseController');

class MobileController extends BaseController {
  async index() {
    const ctx = this.ctx;
    await ctx.render('mobile/index.html',{
      user:ctx.user
    });
  }

  async graduate() {
    const ctx = this.ctx;

    await ctx.render('mobile/graduate.html',{
        user:ctx.user
    });
  }

  async search() {
    const ctx = this.ctx;
    await ctx.render('mobile/search.html',{
      user:ctx.user
    });
  }

  async workpod() {
    const ctx = this.ctx;
    await ctx.render('mobile/workPod.html',{
      user:ctx.user
    });
  }

  async workpoddetail() {
    const ctx = this.ctx;
    await ctx.render('mobile/workPodDetail.html',{
      user:ctx.user
    });
  }

  async workdetail() {
    const ctx = this.ctx;
    try{
      const data = await ctx.service.artifacts.find(ctx.helper.parseInt(ctx.queries.artifactId));
      let teamworker = '';
      if( data.teamworker !='' && data.teamworker != null){
        teamworker = teamworker + '协作者:';
        let teamworkerArray = JSON.parse(data.teamworker);
        teamworkerArray.forEach((elem,index)=>{
          teamworker = teamworker + '<a style="color:#0ABC73" href="/mobile/workset?userId='+elem.Id+'">' + elem.fullname +'</a>';
          if(index != (teamworkerArray.length - 1)){
            teamworker = teamworker + '，'
          }
        });
      }
      let createAt = data.createAt.toString().substring(0,10);
      let result = {
        status:200,
        data:data,
        teamworker:teamworker,
        createAt:createAt,
        user:ctx.user
      };

      if (data.visible == 0){
        result.status = 200;
      }
      else{
        if(!ctx.user){
          result.status = 500;
          result.data = '隐藏的作品没权限查看，请登录';
        }
        else{
          if (ctx.app.judgeUserIsVipTeacher(ctx.user)){
            result.status = 200;
          }
          else{
            if(ctx.user.Id == data.userId){
              result.status = 200;
            }
            else{
              result.status = 500;
              result.data = '抱歉，该作品已被隐藏，请联系管理员！';
            }
          }
        }
      }
      await ctx.render('mobile/workDetail.html',result);
    }
    catch(e){
      console.log(e);
      super.failure(e.message);
    }
  }

  async workset() {
    const ctx = this.ctx;

    await ctx.render('mobile/workSet.html',{
      user:ctx.user
    });
  }

  async login() {
    const ctx = this.ctx;
    await ctx.render('mobile/login.html',{

    });
  }

  async logout(){
    const ctx = this.ctx;
    try{
      ctx.logout();
      super.success('退出成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async relogin(){
    const ctx = this.ctx;
    await ctx.render('mobile/login.html', {
      message:'用户名密码错误,或者未激活!'
    });
  }

  async codeauthrelogin(){
    const ctx = this.ctx;
    await ctx.render('mobile/login.html', {
      message:'用户名验证码错误,或者未激活!'
    });
  }

  async register() {
    const ctx = this.ctx;
    await ctx.render('mobile/register.html',{

    });
  }

  async findpwd() {
    const ctx = this.ctx;
    await ctx.render('mobile/findPwd.html',{

    });
  }

  async updatepwd() {
    const ctx = this.ctx;
    await ctx.render('mobile/updatePwd.html',{

    });
  }

  async prehtml(){
    const ctx = this.ctx;
    await ctx.render('mobile/pre.html',{

    });
  }

  async wxCompleteInfo(){
    const ctx = this.ctx;
    await ctx.render('mobile/wxCompleteInfo.html',{

    });
  }
}

module.exports = MobileController;
