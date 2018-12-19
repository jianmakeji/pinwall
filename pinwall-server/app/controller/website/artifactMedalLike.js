'use strict'

const BaseController = require('../BaseController');

class ArtifactMedalLikeController extends BaseController{

  async create() {
    const ctx = this.ctx;
    let data = {
      tag:ctx.helper.parseInt(ctx.query.tag),
      userId:ctx.helper.parseInt(ctx.query.userId),
      artifactId:ctx.helper.parseInt(ctx.query.artifactId),
      artifactUserId:ctx.helper.parseInt(ctx.query.artifactUserId),
    };

    try{
      const article = await ctx.service.artifactComment.create(data);
      super.success('创建成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

}

module.exports = ArtifactMedalLikeController;
