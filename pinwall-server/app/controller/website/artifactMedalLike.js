'use strict'

const Controller = require('egg').Controller;

class ArtifactMedalLikeController extends Controller{

  async create() {
    const ctx = this.ctx;
    const article = await ctx.service.artifactComment.create(ctx.request.body);
    ctx.body = ctx.app.success('创建成功!');
  }

}

module.exports = ArtifactMedalLikeController;
