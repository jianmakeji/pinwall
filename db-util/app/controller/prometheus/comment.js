'use strict';

const Controller = require('egg').Controller;

class CommentController extends Controller {

  async transferComments(){
    const ctx = this.ctx;
    try{
      await ctx.service.comment.transferComment();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

}

module.exports = CommentController;
