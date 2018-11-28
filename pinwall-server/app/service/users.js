'use strict';

const Service = require('egg').Service;

class Users extends Service {

  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Users.findAndCountAll({
      offset,
      limit,
      order: [[ 'createAt', 'desc' ], [ 'Id', 'desc' ]],
    });
  }

  async find(id) {
    const user = await this.ctx.model.Users.findById(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user;
  }

  async create(user) {
    if (user.email == '' || user.email == null){
      throw new Error('用户邮箱不能为空');
    }
    else{
      const userObj = await this.ctx.model.Users.findAll({
        where:{
          email:user.email
        }
      });
      if (userObj.length == 0){
        return this.ctx.model.Users.create(user);
      }
      else{
        return userObj[0];
      }
    }

  }

  async update({ id, updates }) {
    const user = await this.ctx.model.Users.findById(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.update(updates);
  }

  async del(id) {
    const user = await this.ctx.model.Users.findById(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.destroy();
  }

  async findByOpenId(openId){

    return await this.ctx.model.Users.findAll({
      where:{
        openId:{[this.app.Sequelize.Op.eq]:openId}
      }
    });
  }
}

module.exports = Users;
