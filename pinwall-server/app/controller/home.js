'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }

  async logout(){
    const ctx = this.ctx;
    ctx.logout();
    await ctx.render('index.html');
  }
  
  async loginRender() {
    const ctx = this.ctx;
    await ctx.render('login.html', {

    });
  }

  async uploadRender() {
    const ctx = this.ctx;
    if (ctx.isAuthenticated()){
      await ctx.render('upload.html', {

      });
    }
    else{
      await ctx.render('login.html', {

      });
    }
  }


}

module.exports = HomeController;
