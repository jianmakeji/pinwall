'use strict';

const Controller = require('egg').Controller;

class EliteSchoolController extends Controller {

  async transferEliteSchool(){
    const ctx = this.ctx;
    try{
      await ctx.service.eliteSchool.transferEliteSchool();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

}

module.exports = EliteSchoolController;
