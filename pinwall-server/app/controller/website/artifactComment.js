'use strict'

const Controller = require('egg').Controller;

class ArtifactCommentController extends Controller{

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };
    ctx.body = await ctx.service.artifactComment.list(query);
  }

  async findByArtifactIdWithPage() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      artifactId: ctx.helper.parseInt(ctx.query.artifactId),
    };
    ctx.body = await ctx.service.artifactComment.list(query);
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.artifactComment.find(ctx.helper.parseInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    const article = await ctx.service.artifactComment.create(ctx.request.body);
    ctx.body = ctx.app.success('创建成功!');
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const updates = {
      content: ctx.request.body.content,
      artifactId: ctx.request.body.artifactId,
      commenterId: ctx.request.body.commenterId
    };
    await ctx.service.artifactComment.update({ id, updates });
    ctx.body = ctx.app.success('更新成功!');
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    await ctx.service.artifactComment.del(id);
    ctx.body = ctx.app.success('删除成功!');
  }

  async setCommentVisible() {
    const ctx = this.ctx;
    const updates = {
      Id:ctx.request.body.id,
      visible: ctx.request.body.visible,
    };
    await ctx.service.artifactComment.update(updates);
  }
}

module.exports = ArtifactCommentController;