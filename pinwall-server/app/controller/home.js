'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }

  async loginRender() {
    const ctx = this.ctx;
    await ctx.render('login.html', {

    });
  }
}

module.exports = HomeController;
