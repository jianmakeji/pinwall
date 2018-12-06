'use strict'

const BaseController = require('../BaseController');

class ArtifactMedalLikeController extends BaseController{

  async create() {
    const ctx = this.ctx;

    try{
      const article = await ctx.service.artifactComment.create(ctx.request.body);
      super.success('创建成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

}

module.exports = ArtifactMedalLikeController;
