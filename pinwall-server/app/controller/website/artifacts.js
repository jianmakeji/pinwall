'use strict'

const Controller = require('egg').Controller;

class ArtifactsController extends Controller{

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };
    ctx.body = await ctx.service.artifacts.list(query);
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.artifacts.find(ctx.helper.parseInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    const article = await ctx.service.artifacts.create(ctx.request.body);
    ctx.body = ctx.app.success('创建成功!');
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const updates = {
      artifactId: ctx.request.body.artifactId,
      scorerId: ctx.request.body.scorerId,
      score: ctx.request.body.score,
    };
    await ctx.service.artifacts.update({ id, updates });
    ctx.body = ctx.app.success('更新成功!');
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    await ctx.service.artifacts.del(id);
    ctx.body = ctx.app.success('删除成功!');
  }

}

module.exports = ArtifactsController;
