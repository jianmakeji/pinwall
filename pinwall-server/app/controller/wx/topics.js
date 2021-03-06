'use strict'

const BaseController = require('../BaseController');
const Excel = require('exceljs');
const path = require('path');
const fs = require('fs');

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

  async getTopicAndArtifactById() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      topicId: ctx.helper.parseInt(ctx.query.topicId),
      role: ctx.query.role,
      userId:ctx.helper.parseInt(ctx.query.userId),
    };

    try{
      let result = await ctx.service.topics.getWxTopicAndArtifactById(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async findArtifactByTopicId() {
    const ctx = this.ctx;
    const topicId = ctx.helper.parseInt(ctx.query.topicId);

    try{
      let result = await ctx.service.topics.findArtifactByTopicId(topicId);
      ctx.body = result;
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async searchByTopicName() {
    const ctx = this.ctx;
    let query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      jobTag: ctx.helper.parseInt(ctx.query.jobTag),
      subLimit: ctx.helper.parseInt(ctx.query.subLimit),
      status: ctx.helper.parseInt(ctx.query.status),
      userId: -1,
      keyword: ctx.query.keyword,
    };

    try{
      const result = await ctx.service.topics.searchTopics(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async countTopicsByUserId() {
    const ctx = this.ctx;
    const userId = ctx.helper.parseInt(ctx.query.userId);

    try{
      let result = await ctx.service.topics.countTopicsByUserId(userId);
      ctx.body = result;
    }
    catch(e){
      super.failure(e.message);
    }
  }
}

module.exports = TopicsController;
