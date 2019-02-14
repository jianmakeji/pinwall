const BaseController = require('../BaseController');

class ArtifactsController extends BaseController{

    async getMedalDataByRandom(){
      const ctx = this.ctx;
      const limit = ctx.params.limit;
      try{
        ctx.body = await ctx.service.artifacts.getMedalDataByRandom(limit);
      }
      catch(e){
        super.failure(e.message);
      }
    }

    async createComment() {
      const ctx = this.ctx;
      const result = await ctx.service.artifactComment.create(ctx.request.body);
      if(result){
        super.success('操作成功!');
      }
      else{
        super.failure(e.message);
      }
    }

    async createScore() {
      const ctx = this.ctx;
      try{
        const wxUser = await ctx.service.users.findByOpenId(ctx.request.body.openid);
        if (wxUser.roles[0].name == 'admin'){
          const article = await ctx.service.artifactScore.create(ctx.request.body);
          super.success('打分成功!');
        }
        else{
          super.failure('没有操作权限!');
        }
      }
      catch(e){
        super.failure(e.message);
      }
    }
}

module.exports = ArtifactsController;
