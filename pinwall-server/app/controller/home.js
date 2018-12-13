'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const ctx = this.ctx;
    await ctx.render('index.html');
  }

  async logout(){
    const ctx = this.ctx;
    ctx.logout();
    await ctx.render('index.html');
  }

  async login() {
    const ctx = this.ctx;
    await ctx.render('login.html', {

    });
  }

  async upload() {
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

  async uploadWork(){
    const ctx = this.ctx;
    await ctx.render('uploadWork.html');
  }

  async project(){
    const ctx = this.ctx;
    await ctx.render('search.html');
  }

  async topics(){
    const ctx = this.ctx;
    await ctx.render('topics.html');
  }

  async topicsAbout(){
    const ctx = this.ctx;
    await ctx.render('topicsAbout.html');
  }

  async users(){
    const ctx = this.ctx;
    await ctx.render('users.html');
  }

  async children(){
    const ctx = this.ctx;
    await ctx.render('children.html');
  }
}

module.exports = HomeController;
