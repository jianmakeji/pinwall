'use strict';

const Controller = require('egg').Controller;

class TermsController extends Controller {

  async transferTerms(){
    const ctx = this.ctx;
    try{
      await ctx.service.terms.transferTerms();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

  async transferTopicTerm(){
    const ctx = this.ctx;
    try{
      await ctx.service.terms.transferTopicTerm();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }
}

module.exports = TermsController;
