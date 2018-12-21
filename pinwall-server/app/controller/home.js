'use strict';

const Controller = require('egg').Controller;
const BaseController = require('./BaseController');

class HomeController extends BaseController {
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
    try{
      const data = await ctx.service.artifacts.find(ctx.helper.parseInt(ctx.params.id));
      await ctx.render('projects.html',{data:data});
    }
    catch(e){
      super.failure(e.message);
    }

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
    try{
      await ctx.render('users.html');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async workFolder(){
    const ctx = this.ctx;
    await ctx.render('workFolder.html');
  }

  async userManager(){
    const ctx = this.ctx;
    await ctx.render('userManager.html');
  }

  async workManager(){
    const ctx = this.ctx;
    await ctx.render('workManager.html');
  }

  async commentManager(){
    const ctx = this.ctx;
    await ctx.render('commentManager.html');
  }

  async children(){
    const ctx = this.ctx;
    await ctx.render('children.html');
  }
}

module.exports = HomeController;
