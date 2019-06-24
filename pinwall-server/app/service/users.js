'use strict';

const Service = require('egg').Service;
const UUID = require('uuid');

class Users extends Service {

  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Users.listUsers({
      offset,
      limit
    });
  }

  async find(id) {
    const user = await this.ctx.model.Users.findUserById(id);

    return user;
  }

  async createUser(user,category) {
    if (user.mobile == '' || user.mobile == mobile){
      throw new Error('用户手机号不能为空');
    }
    else{
      const userObj = await this.ctx.model.Users.findUserByMobile(user.mobile);
      if (userObj){
        throw new Error('用户已经存在');
      }
      else{
        let transaction;
        try {
          transaction = await this.ctx.model.transaction();
          const app = this.ctx.app;
          user.password = app.cryptoPwd(app.cryptoPwd(user.password));
          user.activeCode =  UUID.v1();
          user.active = 1;
          const createUserObj = await this.ctx.model.Users.createUser(user,transaction);
          await this.ctx.model.UserRole.creteUserRole(createUserObj.Id, 1, transaction);
          await transaction.commit();

          return createUserObj;
        } catch (e) {
          console.log(e.message);
          await transaction.rollback();
          return false;
        }
      }
    }
  }

  async update({ id, updates }) {
    return this.ctx.model.Users.updateUser({ id, updates });
  }

  async del(id) {
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      await this.ctx.model.Users.delUserById(id,transaction);
      await this.ctx.model.UserRole.delUserRoleByUserId(id, transaction);
      await this.ctx.model.Artifacts.delArtifactById(id, transaction);
      await this.ctx.model.ArtifactAssets.delAssetsByArtifactId(id, transaction);
      await this.ctx.model.ArtifactAssets.delCommentByArtifactId(id, transaction);
      await transaction.commit();
      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }

  }

  async findByUnionId(unionId){
    return await this.ctx.model.Users.findByUnionId(unionId);
  }

  async findByUserWithEmail(email){
    return await this.ctx.model.Users.findByUserWithEmail(email);
  }

  async loginFindByUserWithEmail(email){
    return await this.ctx.model.Users.loginFindByUserWithEmail(email);
  }

  async loginFindByUserWithMobile(mobile){
    return await this.ctx.model.Users.loginFindByUserWithMobile(mobile);
  }

  async updateAcviveByActiveCodeAndEmail(email,activeCode){
    return await this.ctx.model.Users.updateAcviveByActiveCodeAndEmail(email,activeCode,1);
  }

  async updateAcviveByUserId(userId){
    return await this.ctx.model.Users.updateAcviveByUserId(userId);
  }

  async bindWeixinInfoByEmail(email,user){
    let wxInfo = {};
    wxInfo.email = email;
    wxInfo.openId = user.openid;
    wxInfo.nickname = user.nickname;
    wxInfo.avatarUrl = user.headimageurl;
    wxInfo.gender = user.sex;
    wxInfo.province = user.province;
    wxInfo.city = user.city;
    wxInfo.country = user.country;
    wxInfo.unionId = user.unionid;
    wxInfo.activeCode = UUID.v1();

    try{
      let userObject = this.ctx.model.Users.findUserByEmail(email);
      if(userObject){
        await this.ctx.model.Users.updateWxInfoByEmail(wxInfo);
        await this.ctx.service.emailService.sendWxActiveEmail(email,user.unionid,wxInfo.activeCode);
        return userObject;
      }
      else{
        return false;
      }
    }
    catch(e){
      return false;
    }
  }

  async updateWxActiveByActiveCodeAndUnionId(unionId,activeCode){
    return await this.ctx.model.Users.updateWxActiveByActiveCodeAndUnionId(unionId,activeCode,1);
  }

  async updatePwd(userId,newPwd){
    try{
       await this.ctx.model.Users.updatePwd(userId, newPwd);
       return true;
    }
    catch(e){
       return false;
    }

  }

  async getBackPwdWithEmail(email){
    try{
        const activeCode =  UUID.v1();
        await this.ctx.model.Users.updateUserActiveCodeByEmail(email, activeCode);
        await this.ctx.service.emailService.sendBackPwdEmail(email, activeCode);
        return true;
    }
    catch(e){
      return false;
    }
  }

  async updatePwdWithEmailAndActiveCode(email, activeCode, newPwd){
    try{
      const app = this.ctx.app;
      const password = app.cryptoPwd(app.cryptoPwd(newPwd));
      await this.ctx.model.Users.updatePwdWithEmailAndActiveCode(email, activeCode, password);
      return true;
    }
    catch(e){
      return false;
    }
  }

  async updatePwdWithMobile(mobile, newPwd){
    try{
      const app = this.ctx.app;
      const password = app.cryptoPwd(app.cryptoPwd(newPwd));
      await this.ctx.model.Users.updatePwdWithMobile(email, password);
      return true;
    }
    catch(e){
      return false;
    }
  }

  async updateUserRole(userId, operation){
    try{
      await this.ctx.model.UserRole.updateUserRole(userId,operation);
      return true;
    }
    catch(e){
      return false;
    }
  }

  async searchByUsername(query){
    return await this.ctx.model.Users.searchByUsername(query);
  }

  async searchByEmail(query){
    return await this.ctx.model.Users.searchByEmail(query);
  }

  async getWxActiveCodeByEmail(email){
    let user = await this.ctx.model.Users.findUserByEmail(email);
    if(user.wxActive){
      return true
    }
    else{
      return false;
    }
  }

  async searchUserInfoByKeyword(keyword, type){
    return await this.ctx.model.Users.searchUserInfoByKeyword(keyword, type);
  }

  async getUserInfoById(userId){
    return await this.ctx.model.Users.getUserInfoById(userId);
  }

  async getUserIntroById(userId){
    return await this.ctx.model.Users.getUserIntroById(userId);
  }
}

module.exports = Users;
