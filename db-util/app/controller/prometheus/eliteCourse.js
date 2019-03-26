'use strict';

const Controller = require('egg').Controller;

class EliteCourseController extends Controller {

  async transferEliteCourse(){
    const ctx = this.ctx;
    try{
      await ctx.service.eliteCourse.transferEliteCourse();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

}

module.exports = EliteCourseController;
