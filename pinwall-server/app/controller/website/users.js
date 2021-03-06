'use strict'

const BaseController = require('../BaseController');
const Captcha = require('svg-captcha');
const request = require('request');
const wxUtil = require('../../utils/wxUtils');

class UsersController extends BaseController{

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };

    try{
      const result = await ctx.service.users.list(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async show() {
    const ctx = this.ctx;
    try{
      const result = await ctx.service.users.find(ctx.helper.parseInt(ctx.params.id));
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async createUser() {
    const ctx = this.ctx;
    try{
      let data = ctx.request.body;
      if (data.captchaText.toLowerCase() != this.ctx.session.captcha){
        super.failure('验证码错误!');
      }
      else{
        let vertifyResult = await ctx.service.smsMessage.getDataByCondition({mobile:data.mobile,code:data.smsCode});
        if (vertifyResult.status == 200){
          await ctx.service.users.createUser(data,0);
          super.success('创建成功!');
        }
        else{
          ctx.body = vertifyResult;
        }
      }
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async createUserFromH5() {
    const ctx = this.ctx;
    try{
      let data = ctx.request.body;
      console.log(data);
      let vertifyResult = await ctx.service.smsMessage.getDataByCondition({mobile:data.mobile,code:data.smsCode});
      console.log(vertifyResult);
      if (vertifyResult.status == 200){
        await ctx.service.users.createUser(data,0);
        super.success('创建成功!');
      }
      else{
          ctx.body = vertifyResult;
      }
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.user.Id;
    let updates = {

    };
    if(ctx.request.body.intro != ""){
      updates.intro = ctx.request.body.intro;
    }
    let avatarUrl = ctx.request.body.avatarUrl;
    if(avatarUrl != ""){
      updates.avatarUrl = avatarUrl;
    }

    try{
      await ctx.service.users.update({ id, updates });
      if(avatarUrl != "" && ctx.user.avatarUrl != null  && !ctx.user.avatarUrl.includes("thirdwx.qlogo.cn")){
        ctx.user.avatarUrl = ctx.app.signatureUrl(ctx.app.headiconPath + avatarUrl, "thumb_120_120");
      }
      super.success('更新成功!');
    }
    catch(e){
      console.log(e);
      super.failure(e.message);
    }
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);

    try{
      await ctx.service.users.del(id);
      super.success('删除成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async findByUsersEmail(){
    const ctx = this.ctx;
    const email = ctx.query.email;
    try{
      const result = await ctx.service.users.findByUsersEmail(email);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async updateAcviveByActiveCodeAndEmail(){
    const ctx = this.ctx;
    const email = ctx.query.email;
    const activeCode = ctx.query.activeCode;

    try{
      await ctx.service.users.updateAcviveByActiveCodeAndEmail(email,activeCode);
      ctx.redirect('/login');
    }
    catch(e){
      ctx.redirect('/login');
    }
  }

  async updateAcviveByUserId(){
    const ctx = this.ctx;
    const userId = ctx.helper.parseInt(ctx.params.id);

    try{
      await ctx.service.users.updateAcviveByUserId(userId);
      super.success('更新成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async sendBindingEmailCode(){
    const ctx = this.ctx;
    const email = ctx.query.email;
    const activeCode = ctx.app.randomNumber(6);
    try{
      const result = await ctx.service.email.sendActiveEmail(email,activeCode,1);
      if (result){
        super.success('发送成功!');
      }
      else{
        super.success('发送失败!');
      }
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async getCaptcha(){
    let codeConfig = {
        size: 5,// 验证码长度
        ignoreChars: '0o1iILlO', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 44
    }
    var captcha = Captcha.create(codeConfig);
    this.ctx.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码

    this.ctx.body = captcha.data;
  }

  async checkCaptcha(){
    const captchaText = this.ctx.query.captchaText;
    if (captchaText.toLowerCase() == this.ctx.session.captcha){
      super.success('校验成功!');
    }
    else{
      super.failure('校验失败!');
    }
  }

  async wxLogin(){
    const code = this.ctx.query.code;
    const state = this.ctx.query.state;
    if (state == 'hello-pinwall'){

      const accessTempObject = await wxUtil.getAccessToken(this.ctx.app.wx_appid,this.ctx.app.wx_secret,code);
      const accessObject = JSON.parse(accessTempObject);
      if(!accessObject.errcode){
        const userObject = await wxUtil.getUserInfo(accessObject.access_token,accessObject.openid);
        super.success(userObject);
      }
      else{
        super.failure(accessObject.errmsg);
      }
    }
    else{
      super.failure('授权失败!');
    }
  }

  async getUserByUnionId(){
    const unionId = this.ctx.query.unionId;
    return await ctx.service.users.findByUnionId(unionId);
  }

  async bindWeixin(){
    const ctx = this.ctx;
    const unionId = ctx.user.unionid;
    const user = await ctx.service.users.findByUnionId(unionId);
    if(user){
      if(user.Id && (user.email || user.mobile) ){
        if(user.wxActive == 0){
          ctx.redirect('/wxCompleteInfo');
        }
        else{
          ctx.user.Id = user.Id;
          ctx.user.email = user.email;
          ctx.user.fullname = user.fullname;
          ctx.user.roles = user.roles;
          ctx.user.avatarUrl = user.avatarUrl;
          ctx.redirect('/index');
        }
      }else{
        ctx.redirect('/completeInfo');
      }
    }
    else{
      ctx.redirect('/completeInfo');
    }
  }

  async mobileBindWeixin(){
    const ctx = this.ctx;
    const unionId = ctx.user.unionid;
    const user = await ctx.service.users.findByUnionId(unionId);
    if(user){
      if(user.Id && (user.email || user.mobile) ){
        if(user.wxActive == 0){
          ctx.redirect('/mobile/wxCompleteInfo');
        }
        else{
          ctx.user.Id = user.Id;
          ctx.user.email = user.email;
          ctx.user.fullname = user.fullname;
          ctx.user.roles = user.roles;
          ctx.user.avatarUrl = user.avatarUrl;
          ctx.redirect('/mobile/prehtml');
        }
      }else{
        ctx.redirect('/mobile/wxCompleteInfo');
      }
    }
    else{
      ctx.redirect('/mobile/wxCompleteInfo');
    }
  }

  async bindWeixinInfoByEmail(){
    const ctx = this.ctx;
    const emailOrPhone = ctx.request.body.email;
    const password = ctx.request.body.password;
    const result = await ctx.service.users.bindWeixinInfoByEmailOrPhone(emailOrPhone,password,ctx.user);
    if (result){
      super.success('绑定成功!');
    }
    else{
      super.failure('绑定失败!');
    }
  }

  async h5BindWeixinInfoByMobile(){
    const ctx = this.ctx;
    const mobile = ctx.request.body.mobile;
    const smsCode = ctx.request.body.code;
    let vertifyResult = await ctx.service.smsMessage.getDataByCondition({mobile:mobile,code:smsCode});
    if (vertifyResult.status == 200){
      if (ctx.user){
        try{
          const resultObj = await ctx.service.users.bindWeixinInfoByMobile(mobile,ctx.user);
          console.log(resultObj);
          if (resultObj.result){
            ctx.user.mobile = mobile;
            super.success('操作成功！');
          }
          else{
            super.failure(resultObj.message);
          }
        }
        catch(e){
          super.failure(e.message);
        }
      }
      else{
        super.failure('授权出错，请重新操作!');
      }
    }
    else{
      this.ctx.body =  vertifyResult;
    }
  }

  async h5CreateNewWeixinInfoByMobile(){
    const ctx = this.ctx;
    const mobile = ctx.request.body.mobile;
    const smsCode = ctx.request.body.code;
    const fullname = ctx.request.body.fullname;
    const password = ctx.request.body.password;
    let vertifyResult = await ctx.service.smsMessage.getDataByCondition({mobile:mobile,code:smsCode});
    if (vertifyResult.status == 200){
      if (ctx.user){
        let user = {
          mobile:mobile,
          fullname:fullname,
          password:password,
          openId:ctx.user.openid,
          nickname:ctx.user.nickname,
          gender:ctx.user.sex,
          city:ctx.user.city,
          province:ctx.user.province,
          country:ctx.user.country,
          avatarUrl:ctx.user.headimageurl,
          unionId:ctx.user.unionid,
        };
        try{
          const result = await ctx.service.users.createUser(user,1);
          if (result){
            ctx.user.mobile = mobile;
            ctx.user.fullname = fullname;
            super.success('操作成功！');
          }
          else{
            super.failure('操作失败！请重新操作');
          }
        }
        catch(e){
          super.failure(e.message);
        }
      }
      else{
        super.failure('微信扫描信息有误，请重新扫描!');
      }
    }
    else{
      this.ctx.body = vertifyResult;
    }
  }


  async updateWxActive(){
    const ctx = this.ctx;
    const unionId = ctx.query.unionId;
    const activeCode = ctx.query.activeCode;
    try{
      await ctx.service.users.updateWxActiveByActiveCodeAndUnionId(unionId,activeCode);
      if (ctx.user){
        ctx.redirect('/index');
      }
      else{
        ctx.redirect('/login');
      }
    }
    catch(e){
      super.failure('激活失败,请稍后重试!');
    }
  }

  async createWxUser(){
    const ctx = this.ctx;
    const mobile = ctx.request.body.mobile;
    const fullname = ctx.request.body.fullname;
    const password = ctx.request.body.password;
    const captcha = ctx.request.body.captchaText;
    const smsCode = ctx.request.body.smsCode;

    if (captcha == ctx.session.captcha){
      let vertifyResult = await ctx.service.smsMessage.getDataByCondition({mobile:mobile,code:smsCode});
      if (vertifyResult.status == 200){
        if (ctx.user){
          let user = {
            mobile:mobile,
            fullname:fullname,
            password:password,
            openId:ctx.user.openid,
            nickname:ctx.user.nickname,
            gender:ctx.user.sex,
            city:ctx.user.city,
            province:ctx.user.province,
            country:ctx.user.country,
            avatarUrl:ctx.user.headimageurl,
            unionId:ctx.user.unionid,
          };
          try{
            const result = await ctx.service.users.createUser(user,1);
            if (result){
              super.success('操作成功，请登录！');
            }
            else{
              super.failure('操作失败！请重新操作');
            }
          }
          catch(e){
            super.failure(e.message);
          }
        }
        else{
          super.failure('微信扫描信息有误，请重新扫描!');
        }
      }
      else{
        this.ctx.body =  vertifyResult;
      }

    }
    else{
      super.failure('验证码不正确!');
    }
  }

  async updatePwd(){
    const ctx = this.ctx;
    const password = ctx.request.body.password;
    const newPwd = ctx.request.body.newPwd;
    if(ctx.user){
      const userObject = await ctx.service.users.find(ctx.user.Id);
      const app = this.ctx.app;
      const crypwd = app.cryptoPwd(app.cryptoPwd(password));
      if(userObject.password != crypwd){
        super.failure('旧密码不正确!');
      }
      else{
        const result = await ctx.service.users.updatePwd(ctx.user.Id, app.cryptoPwd(app.cryptoPwd(newPwd)));
        if (result){
          super.success('修改成功');
        }
        else{
          super.failure('修改失败');
        }
      }
    }
    else{
      ctx.redirect('/login');
    }
  }

  async getBackPwdWithEmail(){
    const ctx = this.ctx;
    const email = ctx.query.email;
    const userObj = await ctx.service.users.findByUserWithEmail(email);
    if (userObj){
      const result = await ctx.service.users.getBackPwdWithEmail(email);
      if(result){
        super.success('邮件发送成功,请点开邮箱链接更改密码!');
      }
      else{
        super.failure('邮件发送失败');
      }
    }
    else{
      super.failure('邮箱不存在!');
    }
  }

  async updatePwdWithEmailAndActiveCode(){
    const ctx = this.ctx;
    const email = ctx.request.body.email;
    const activeCode = ctx.request.body.activeCode;
    const newPwd = ctx.request.body.newPwd;
    const result = await ctx.service.users.updatePwdWithEmailAndActiveCode(email, activeCode, newPwd);
    if (result){
      super.success('修改成功');
    }
    else{
      super.failure('修改失败');
    }
  }

  async updatePwdWithMobile(){
    const ctx = this.ctx;
    const mobile = ctx.request.body.mobile;
    const smsCode = ctx.request.body.smsCode;
    const newPwd = ctx.request.body.newPwd;

    let vertifyResult = await ctx.service.smsMessage.getDataByCondition({mobile:mobile,code:smsCode});
    if (vertifyResult.status == 200){
      const result = await ctx.service.users.updatePwdWithMobile(mobile, newPwd);
      if (result){
        super.success('修改成功');
      }
      else{
        super.failure('修改失败');
      }
    }
    else{
      ctx.body = vertifyResult;
    }
  }

  async updateUserRole(){
    const ctx = this.ctx;
    const userId = ctx.request.body.userId;
    const operation = ctx.request.body.operation;
    const result = await ctx.service.users.updateUserRole(userId,operation);
    if (result){
      super.success('设置成功');
    }
    else{
      super.failure('设置失败');
    }
  }

  async searchByUsername(){
    const ctx = this.ctx;
    const limit = ctx.helper.parseInt(ctx.query.limit);
    const offset = ctx.helper.parseInt(ctx.query.offset);
    const fullname = ctx.query.fullname;
    const query = {
      limit:limit,
      offset:offset,
      fullname:fullname
    };
    try{
      let result = await ctx.service.users.searchByUsername(query);
      super.success(result);
    }
    catch(e){
        console.log(e);
      super.failure('获取数据失败');
    }
  }

  async searchByEmail(){
    const ctx = this.ctx;
    const limit = ctx.helper.parseInt(ctx.query.limit);
    const offset = ctx.helper.parseInt(ctx.query.offset);
    const email = ctx.query.email;
    const query = {
      limit:limit,
      offset:offset,
      email:email
    };
    try{
      let result = await ctx.service.users.searchByEmail(query);
      super.success(result);
    }
    catch(e){
      super.failure('获取数据失败');
    }
  }

  async searchUserInfoByKeyword(){
    const ctx = this.ctx;
    const type = ctx.helper.parseInt(ctx.query.type);
    const keyword = ctx.query.keyword;

    try{
      let result = await ctx.service.users.searchUserInfoByKeyword(keyword, type);
      super.success(result);
    }
    catch(e){
      super.failure('获取数据失败');
    }
  }
}

module.exports = UsersController;
