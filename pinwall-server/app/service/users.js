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

  async createUser(user) {
    if (user.email == '' || user.email == null){
      throw new Error('用户邮箱不能为空');
    }
    else{
      const userObj = await this.ctx.model.Users.findByUsersEmail(user.email);
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
          const createUserObj = await this.ctx.model.Users.createUser(user,transaction);
          await this.ctx.model.UserRole.creteUserRole(createUserObj.Id, user.roleId, transaction);
          await transaction.commit();
          await this.ctx.service.emailService.sendActiveEmail(user.email, user.acticeCode);

          return true
        } catch (e) {
          await transaction.rollback();
          return false
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

  async findByOpenId(openId){
    return await this.ctx.model.Users.findByOpenId(openId);
  }

  async findByUsersEmail(email){
    return await this.ctx.model.User.findByUsersEmail(email);
  }

  async updateAcviveByActiveCodeAndEmail(email,activeCode){
    return await this.ctx.model.User.findByUsersEmail(email,activeCode);
  }

  async updateAcviveByUserId(userId){
    return await this.ctx.model.User.updateAcviveByUserId(userId);
  }
}

module.exports = Users;
