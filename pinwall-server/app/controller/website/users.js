'use strict'

const BaseController = require('../BaseController');
const Captcha = require('svg-captcha');

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

  async create() {
    const ctx = this.ctx;
    try{
      const user = await ctx.service.users.createUser(ctx.request.body);
      super.success('创建成功!');
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

  async register(){
    const query = {
      password: ctx.query.password,
      email: ctx.query.email,
      fullname: ctx.query.fullname,
    };
    query.roleId = 1;
    try{
      const user = await ctx.service.users.createUser(query);
      super.success('创建成功!');
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
}

module.exports = UsersController;
