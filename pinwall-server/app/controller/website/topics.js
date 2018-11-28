'use strict'

const Controller = require('egg').Controller;

class TopicsController extends Controller{

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };
    ctx.body = await ctx.service.topics.list(query);
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.topics.find(ctx.helper.parseInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    const topic = await ctx.service.topics.create(ctx.request.body);
    ctx.body = ctx.app.success('创建成功!');
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const updates = {
      name: ctx.request.body.name,
      description: ctx.request.body.description,
      status: ctx.request.body.status,
    };
    await ctx.service.topics.update({ id, updates });
    ctx.body = ctx.app.success('更新成功!');
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    await ctx.service.topics.del(id);
    ctx.body = ctx.app.success('删除成功!');
  }

}

module.exports = TopicsController;
