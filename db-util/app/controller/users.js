'use strict';

const Controller = require('egg').Controller;

class UsersController extends Controller {

  async transferUsers(){
    const ctx = this.ctx;
    try{
      await ctx.service.users.transferUsers();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

  async transferRoles(){
    const ctx = this.ctx;
    try{
      await ctx.service.users.transferRoles();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

  async transferUserRoles(){
    const ctx = this.ctx;
    try{
      await ctx.service.users.transferUserRoles();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

}

module.exports = UsersController;
