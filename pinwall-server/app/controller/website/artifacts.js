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
    let artifact = ctx.request.body;
    artifact.userId = ctx.user.Id;
    let result = await ctx.service.artifacts.create(ctx.request.body);
    if(result){
      super.success('创建成功!');
    }
    else{
      super.failure("操作失败");
    }
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const updates = ctx.request.body;
    let result = await ctx.service.artifacts.update({ id, updates });
    if(result){
      super.success('更新成功!');
    }
    else{
      super.failure("操作失败");
    }
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    let result = await ctx.service.artifacts.del(id);
    if(result){
      super.success('删除成功!');
    }
    else{
      super.failure('操作失败');
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

  async getPersonalJob() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      jobTag: ctx.helper.parseInt(ctx.query.jobTag),
    };
    query.userId = ctx.user.Id;
    try{
      const result = await ctx.service.artifacts.getPersonalJobByUserId(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async getPersonalJobByUserId() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      userId: ctx.helper.parseInt(ctx.query.userId),
      jobTag: ctx.helper.parseInt(ctx.query.jobTag),
    };

    try{
      const result = await ctx.service.artifacts.getPersonalJobByUserId(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }
}

module.exports = ArtifactsController;
