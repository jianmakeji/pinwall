'use strict'

const BaseController = require('../BaseController');

class TopicsController extends BaseController{

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      jobTag: ctx.helper.parseInt(ctx.query.jobTag),
      subLimit: ctx.helper.parseInt(ctx.query.subLimit),
      status: ctx.helper.parseInt(ctx.query.status),
      userId: ctx.helper.parseInt(ctx.query.userId),
    };

    try{
      let result = await ctx.service.topics.list(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async show() {
    const ctx = this.ctx;

    try{
      const result = await ctx.service.topics.find(ctx.helper.parseInt(ctx.params.id));
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async create() {
    const ctx = this.ctx;
    const result = await ctx.service.topics.create(ctx.request.body);

    if(result){
      super.success('创建成功!');
    }
    else{
      super.failure('创建失败!');
    }
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const data = ctx.request.body;
    const updateData = {
        Id:id,
        data:data
    };
     const result = await ctx.service.topics.update(updateData);
    if(result){
      super.success('修改成功!');
    }
    else{
      super.failure('修改失败！');
    }
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    try{
      await ctx.service.topics.del(id);
      super.success('删除成功!');
    }
    catch(e){
      super.failure('删除失败！');
    }

  }

  async getTopicAndArtifactById() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      topicId: ctx.helper.parseInt(ctx.query.topicId),
    };

    try{
      let result = await ctx.service.topics.getTopicAndArtifactById(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async updateTopicStatus(){
     const ctx = this.ctx;
     const topicId = ctx.query.topicId;
     const status = ctx.query.status;

     try{
       await ctx.service.topics.updateTopicStatus(topicId,status);
       super.success("操作成功!");
     }
     catch(e){
       super.failure(e.message);
     }
  }

}

module.exports = TopicsController;
