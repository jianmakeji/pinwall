'use strict'

const Controller = require('egg').Controller;

class ArtifactScoresController extends Controller{

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };
    ctx.body = await ctx.service.artifactScore.list(query);
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.artifactScore.find(ctx.helper.parseInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    const article = await ctx.service.artifactScore.create(ctx.request.body);
    ctx.body = ctx.app.success('创建成功!');
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const updates = {
      mobile: ctx.request.body.mobile,
    };
    await ctx.service.artifactScore.update({ id, updates });
    ctx.body = ctx.app.success('更新成功!');
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    await ctx.service.artifactScore.del(id);
    ctx.body = ctx.app.success('删除成功!');
  }

  async findByArtifactIdWithPage() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      artifactId: ctx.helper.parseInt(ctx.query.artifactId),
    };
    ctx.body = await ctx.service.artifactScore.list(query);
  }

  async findByScorerIdWithPage() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      scorerId: ctx.helper.parseInt(ctx.query.scorerId),
    };
    ctx.body = await ctx.service.artifactScore.list(query);
  }
}

module.exports = ArtifactScoresController;
