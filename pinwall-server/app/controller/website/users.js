'use strict'

const BaseController = require('../BaseController');
const Captcha = require('svg-captcha');
const request = require('request');
const wxUtil = require('../../utils/wxUtils');

class UsersController extends BaseController{

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };

    try{
      const result = await ctx.service.users.list(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async show() {
    const ctx = this.ctx;
    try{
      const result = await ctx.service.users.find(ctx.helper.parseInt(ctx.params.id));
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async createUser() {
    const ctx = this.ctx;
    try{
      let data = ctx.request.body;
      if (data.captchaText != this.ctx.session.captcha){
        super.failure('验证码错误!');
      }
      else{
        const user = await ctx.service.users.createUser(data,0);
        super.success('创建成功!');
      }

    }
    catch(e){
      super.failure(e.message);
    }
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const updates = {
      mobile: ctx.request.body.mobile,
    };

    try{
      await ctx.service.users.update({ id, updates });
      super.success('更新成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);

    try{
      await ctx.service.users.del(id);
      super.success('删除成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async findByUsersEmail(){
    const ctx = this.ctx;
    const email = ctx.query.email;
    try{
      const result = await ctx.service.users.findByUsersEmail(email);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async updateAcviveByActiveCodeAndEmail(){
    const ctx = this.ctx;
    const email = ctx.query.email;
    const activeCode = ctx.query.activeCode;

    try{
      await ctx.service.users.updateAcviveByActiveCodeAndEmail(email,activeCode);
      super.success('更新成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async updateAcviveByUserId(){
    const ctx = this.ctx;
    const userId = ctx.helper.parseInt(ctx.params.id);

    try{
      await ctx.service.users.updateAcviveByUserId(userId);
      super.success('更新成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async sendBindingEmailCode(){
    const ctx = this.ctx;
    const email = ctx.query.email;
    const activeCode = ctx.app.randomNumber(6);
    try{
      const result = await ctx.service.email.sendActiveEmail(email,activeCode,1);
      if (result){
        super.success('发送成功!');
      }
      else{
        super.success('发送失败!');
      }
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async getCaptcha(){
    let codeConfig = {
        size: 5,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 44
    }
    var captcha = Captcha.create(codeConfig);
    this.ctx.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码

    this.ctx.body = captcha.data;
  }

  async checkCaptcha(){
    const captchaText = this.ctx.query.captchaText;
    if (captchaText == this.ctx.session.captcha){
      super.success('校验成功!');
    }
    else{
      super.failure('校验失败!');
    }
  }

  async wxLogin(){
    const code = this.ctx.query.code;
    const state = this.ctx.query.state;
    if (state == 'hello-pinwall'){

      const accessTempObject = await wxUtil.getAccessToken(this.ctx.app.wx_appid,this.ctx.app.wx_secret,code);
      const accessObject = JSON.parse(accessTempObject);
      if(!accessObject.errcode){
        const userObject = await wxUtil.getUserInfo(accessObject.access_token,accessObject.openid);
        super.success(userObject);
      }
      else{
        super.failure(accessObject.errmsg);
      }
    }
    else{
      super.failure('授权失败!');
    }
  }

  async getUserByOpenId(){
    const openId = this.ctx.query.openId;
    return await ctx.service.users.findByOpenId(openId);
  }

  async bindWeixin(){
    const ctx = this.ctx;
    const openId = ctx.user.openid;
    const user = await ctx.service.users.findByOpenId(openId);
    if(user){
      if(user.Id && user.email){
        if(user.wxActive == 0){
          await this.ctx.service.emailService.sendWxActiveEmail(user.email, openId, user.activeCode);
          ctx.redirect('/wxRelogin');
        }
        else{
          ctx.user.Id = user.Id;
          ctx.user.email = user.email;
          ctx.user.fullname = user.fullname;
          ctx.redirect('/index');
        }
      }else{
        ctx.redirect('/completeInfo');
      }
    }
    else{
      ctx.redirect('/completeInfo');
    }
  }

  async bindWeixinInfoByEmail(){
    const ctx = this.ctx;
    const email = ctx.request.body.email;
    const result = await ctx.service.users.bindWeixinInfoByEmail(email,ctx.user);
    if (result){
      super.success('绑定成功，请进入邮箱激活!');
    }
    else{
      super.failure('绑定失败!');
    }
  }

  async updateWxActive(){
    const ctx = this.ctx;
    const openId = ctx.query.openId;
    const activeCode = ctx.query.activeCode;
    try{
      await ctx.service.users.updateWxActiveByActiveCodeAndOpenId(openId,activeCode);
      if (ctx.user){
        ctx.redirect('/index');
      }
      else{
        ctx.redirect('/login');
      }
    }
    catch(e){
      super.failure('激活失败,请稍后重试!');
    }
  }

  async createWxUser(){
    const ctx = this.ctx;
    const email = ctx.request.body.email;
    const fullname = ctx.request.body.fullname;
    const password = ctx.request.body.password;
    const captcha = ctx.request.body.captchaText;

    if (captcha == ctx.session.captcha){
      if (ctx.user){
        let user = {
          email:email,
          fullname:fullname,
          password:password,
          openId:ctx.user.openid,
          nickname:ctx.user.nickname,
          gender:ctx.user.sex,
          city:ctx.user.city,
          province:ctx.user.province,
          country:ctx.user.country,
          avatarUrl:ctx.user.headimageurl,
        };
        try{
          const result = await ctx.service.users.createUser(user,1);
          if (result){
            super.success('操作成功！请到邮箱激活');
          }
          else{
            super.failure('操作失败！请重新操作');
          }
        }
        catch(e){
          super.failure(e.message);
        }

      }
      else{
        super.failure('微信扫描信息有误，请重新扫描!');
      }
    }
    else{
      super.failure('验证码不正确!');
    }
  }
}

module.exports = UsersController;
