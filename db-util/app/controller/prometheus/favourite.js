'use strict';

const Controller = require('egg').Controller;

class FaviorateController extends Controller {

  async transferFavourite(){
    const ctx = this.ctx;
    try{
      await ctx.service.favourite.transferFavourite();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

}

module.exports = FaviorateController;
