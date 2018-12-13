'use strict'

const BaseController = require('../BaseController');

class ArtifactsController extends BaseController{

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      visible: ctx.helper.parseInt(ctx.query.visible),
      jobTag: ctx.helper.parseInt(ctx.query.jobTag),
    };

    try{
      const result = await ctx.service.artifacts.list(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async show() {
    const ctx = this.ctx;

    try{
      const result = await ctx.service.artifacts.find(ctx.helper.parseInt(ctx.params.id));
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async create() {
    const ctx = this.ctx;
    try{
      const article = await ctx.service.artifacts.create(ctx.request.body);
      super.success('创建成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const updates = {
      artifactId: ctx.request.body.artifactId,
      scorerId: ctx.request.body.scorerId,
      score: ctx.request.body.score,
    };

    try{
      await ctx.service.artifacts.update({ id, updates });
      super.success('更新成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);

    try{
      await ctx.service.artifacts.del(id);
      super.success('删除成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

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
}

module.exports = ArtifactsController;
