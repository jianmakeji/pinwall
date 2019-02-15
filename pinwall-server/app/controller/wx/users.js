'use strict'

const BaseController = require('../BaseController');
var rp = require('request-promise');

class UsersController extends BaseController {

  async createWxUser() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    const email = body.email;
    const fullname = body.fullname;
    const password = body.password;

    let user = {
      email: email,
      fullname: fullname,
      password: password,
      openId: body.openid,
      nickname: body.nickname,
      gender: body.sex,
      city: body.city,
      province: body.province,
      country: body.country,
      avatarUrl: body.headimageurl,
    };
    try {
      const result = await ctx.service.users.createUser(user, 1);
      if (result) {
        super.success('操作成功！请到邮箱激活');
      } else {
        super.failure('操作失败！请重新操作');
      }
    } catch (e) {
      super.failure(e.message);
    }

  }

  async bindWeixinInfoByEmail() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    const email = body.email;
    let user = {
      openId: body.openid,
      nickname: body.nickname,
      avatarUrl: body.headimageurl,
      gender: body.sex,
      province: body.province,
      city: body.city,
      country: body.country
    };

    const result = await ctx.service.users.bindWeixinInfoByEmail(email, user);

    if (result) {
      super.success('绑定成功，请进入邮箱激活!');
    } else {
      super.failure('绑定失败!');
    }
  }

  async getWxCode() {
    const ctx = this.ctx;
    const jscode = ctx.query.jscode;

    const requestUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=wxa4cd6f777c8b75d0&secret=aeb6d1ab0c59d4145bd00e146551f468&js_code=${jscode}&grant_type=authorization_code`;

    let data;
    await rp(requestUrl).promise().bind(this).then(function(repos) {
      data = repos;
    });

    let openid = JSON.parse(data).openid;

    let result = {
      openid: openid,
    }
    if (openid) {
      const user = await ctx.service.users.findByOpenId(openid);
      result.user = user;
    }
    ctx.body = result;
  }

}

module.exports = UsersController;
