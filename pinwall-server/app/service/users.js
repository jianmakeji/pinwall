'use strict';

const Service = require('egg').Service;

class Users extends Service {

  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Users.listUsers({
      offset,
      limit,
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
      return this.ctx.model.Users.create(user);
    }
  }

  async update({ id, updates }) {
    return this.ctx.model.Users.updateUser({ id, updates });
  }

  async del(id) {
    const user = await this.ctx.model.Users.delUserById(id);
    return user;
  }

  async findByOpenId(openId){
    return await this.ctx.model.Users.findByOpenId(openId);
  }
}

module.exports = Users;
