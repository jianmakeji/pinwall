'use strict'

const BaseController = require('../BaseController');

class ArtifactMedalLikeController extends BaseController{

  async create() {
    const ctx = this.ctx;
    let tag = 0;
    if(ctx.user.role[0].name == 'vip'){
      tag = 1;
    }
    else if (ctx.user.role[0].name == 'admin'){
      tag = 2;
    }
    let data = {
      tag:tag,
      userId:ctx.user.Id,
      artifactId:ctx.helper.parseInt(ctx.query.artifactId),
      artifactUserId:ctx.helper.parseInt(ctx.query.artifactUserId),
    };

    try{
      const article = await ctx.service.artifactMedalLike.create(data);
      super.success('操作成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

}

module.exports = ArtifactMedalLikeController;
