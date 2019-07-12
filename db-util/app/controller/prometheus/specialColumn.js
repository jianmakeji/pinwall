'use strict';

const Controller = require('egg').Controller;

class SpecialColumnController extends Controller {

  async transferSpecialColumn(){
    const ctx = this.ctx;
    try{
      await ctx.service.specialColumn.transferSpecialColumn();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

}

module.exports = SpecialColumnController;
