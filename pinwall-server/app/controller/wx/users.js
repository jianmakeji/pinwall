'use strict'

const BaseController = require('../BaseController');
const request = require('request');

class UsersController extends BaseController {

  async createWxUser() {
    const ctx = this.ctx;
    const email = ctx.request.body.email;
    const fullname = ctx.request.body.fullname;
    const password = ctx.request.body.password;

    if (ctx.user) {
      let user = {
        email: email,
        fullname: fullname,
        password: password,
        openId: ctx.user.openid,
        nickname: ctx.user.nickname,
        gender: ctx.user.sex,
        city: ctx.user.city,
        province: ctx.user.province,
        country: ctx.user.country,
        avatarUrl: ctx.user.headimageurl,
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

    } else {
      super.failure('微信扫描信息有误，请重新扫描!');
    }
  }

  async bindWeixinInfoByEmail(){
    const ctx = this.ctx;
    const body = ctx.request.body;
    const email = body.email;
    let user = {
      openId : body.openid,
      nickname : body.nickname,
      avatarUrl : body.headimageurl,
      gender : body.sex,
      province : body.province,
      city : body.city,
      country : body.country
    };

    const result = await ctx.service.users.bindWeixinInfoByEmail(email,user);

    if (result){
      super.success('绑定成功，请进入邮箱激活!');
    }
    else{
      super.failure('绑定失败!');
    }
  }

  async getWxCode() {
    const ctx = this.ctx;
    const jscode = ctx.query.jscode;

    const requestUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=wxa4cd6f777c8b75d0&secret=aeb6d1ab0c59d4145bd00e146551f468&js_code=${jscode}&grant_type=authorization_code`;

    const resultObj = await request(requestUrl, function(error, response, body) {
      if (!error && response.statusCode == 200) {

        return body;
      } else {
        return error;
      }
    });

    if(resultObj.openid){
      const user = await ctx.service.users.findByOpenId(resultObj.openid);
      resultObj.user = user;
    }

    ctx.body = resultObj;
  }

}

module.exports = UsersController;
