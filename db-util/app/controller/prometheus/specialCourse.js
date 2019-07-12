'use strict';

const Controller = require('egg').Controller;

class SpecialCourseController extends Controller {

  async transferSpecialCourse(){
    const ctx = this.ctx;
    try{
      await ctx.service.specialCourse.transferSpecialCourse();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

}

module.exports = SpecialCourseController;
