'use strict'

const Controller = require('egg').Controller;

class UsersController extends Controller{

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };
    ctx.body = await ctx.service.users.list(query);
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.users.find(ctx.helper.parseInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    try{
      const user = await ctx.service.users.createUser(ctx.request.body);
      ctx.body = ctx.app.success('创建成功!');
    }
    catch(e){
      ctx.body = ctx.app.failure(e.message);
    }
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const updates = {
      mobile: ctx.request.body.mobile,
    };
    await ctx.service.users.update({ id, updates });
    ctx.body = ctx.app.success('更新成功!');
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    await ctx.service.users.del(id);
    ctx.body = ctx.app.success('删除成功!');
  }

  async findByUsersEmail(){
    const ctx = this.ctx;
    const email = ctx.query.email;
    const user = await ctx.service.users.findByUsersEmail(email);
    ctx.body = user;
  }

  async updateAcviveByActiveCodeAndEmail(){
    const ctx = this.ctx;
    const email = ctx.query.email;
    const activeCode = ctx.query.activeCode;
    await ctx.service.users.updateAcviveByActiveCodeAndEmail(email,activeCode);
    ctx.body = ctx.app.success('更新成功!');
  }

  async updateAcviveByUserId(){
    const ctx = this.ctx;
    const userId = ctx.helper.parseInt(ctx.params.id);
    await ctx.service.users.updateAcviveByUserId(userId);
    ctx.body = ctx.app.success('更新成功!');
  }

  async sendBindingEmailCode(){
    const ctx = this.ctx;
    const email = ctx.query.email;
    const activeCode = ctx.app.randomNumber(6);
    const result = await ctx.service.email.sendActiveEmail(email,activeCode,1);
    if (result){
      ctx.body = ctx.app.success('发送成功!');
    }
    else{
      ctx.body = ctx.app.success('发送失败!');
    }
  }
}

module.exports = UsersController;
