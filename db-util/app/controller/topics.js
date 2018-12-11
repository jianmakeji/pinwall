'use strict';

const Controller = require('egg').Controller;

class TopicsController extends Controller {

  async transferTopics(){
    const ctx = this.ctx;
    try{
      await ctx.service.topics.transferTopics();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

}

module.exports = TopicsController;
