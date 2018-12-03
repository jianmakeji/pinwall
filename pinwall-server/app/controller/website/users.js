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
    const user = await ctx.service.users.createUser(ctx.request.body);
    ctx.body = ctx.app.success('创建成功!');
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

  async login() {
    const ctx = this.ctx;
    const { username, password } = ctx.request.body;
    //const user = await this.service.home.login(username, password);
    ctx.session.user = {userId:1, name:"liling"};
    const { id, schemastr } = user || {};
    console.log(ctx.session);
    ctx.body = {
      data: {
        id,
        schemastr,
        username,
      },
      message: 'success',
    };
 }
}

module.exports = UsersController;
