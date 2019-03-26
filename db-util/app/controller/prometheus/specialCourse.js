'use strict';

const Controller = require('egg').Controller;

class SpecialCourseController extends Controller {

  async transferSpecialColumn(){
    const ctx = this.ctx;
    try{
      await ctx.service.specialColumn.transferSpecialCourse();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

}

module.exports = SpecialCourseController;
