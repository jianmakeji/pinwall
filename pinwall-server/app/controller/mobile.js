'use strict';

const Controller = require('egg').Controller;
const BaseController = require('./BaseController');

class MobileController extends BaseController {
  async index() {
    const ctx = this.ctx;
    await ctx.render('mobile/index.html',{

    });
  }

  async graduate() {
    const ctx = this.ctx;
    await ctx.render('mobile/graduate.html',{

    });
  }

  async search() {
    const ctx = this.ctx;
    await ctx.render('mobile/search.html',{

    });
  }

  async workpod() {
    const ctx = this.ctx;
    await ctx.render('mobile/workPod.html',{

    });
  }

  async workpoddetail() {
    const ctx = this.ctx;
    await ctx.render('mobile/workPodDetail.html',{

    });
  }

  async workdetail() {
    const ctx = this.ctx;
    await ctx.render('mobile/workDetail.html',{

    });
  }

  async workset() {
    const ctx = this.ctx;
    await ctx.render('mobile/workset.html',{

    });
  }

  async login() {
    const ctx = this.ctx;
    await ctx.render('mobile/login.html',{

    });
  }

  async register() {
    const ctx = this.ctx;
    await ctx.render('mobile/register.html',{

    });
  }

  async findpwd() {
    const ctx = this.ctx;
    await ctx.render('mobile/findPwd.html',{

    });
  }

  async updatepwd() {
    const ctx = this.ctx;
    await ctx.render('mobile/updatePwd.html',{

    });
  }
}

module.exports = MobileController;
