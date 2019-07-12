'use strict';

const Controller = require('egg').Controller;

class PrometheusUsersController extends Controller {

  async transferPrometheusUsers(){
    const ctx = this.ctx;
    try{
      await ctx.service.prometheusUsers.transferPrometheusUsers();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

}

module.exports = PrometheusUsersController;
