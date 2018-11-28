'use strict';

const Service = require('egg').Service;

class Roles extends Service {
  
  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Roles.findAndCountAll({
      offset,
      limit,
      order: [[ 'createAt', 'desc' ], [ 'Id', 'desc' ]],
    });
  }

  async find(Id) {
    const role = await this.ctx.model.Roles.findById(Id);
    if (!role) {
      this.ctx.throw(404, 'role not found');
    }
    return role;
  }

  async create(role) {
    if (role.name == '' || role.name == null){
      throw new Error('名称不能为空');
    }
    else{
      const roleObj = await this.ctx.model.Roles.findAll({
        where:{
          name:role.name
        }
      });
      if (roleObj.length == 0){
        return this.ctx.model.Roles.create(role);
      }
      else{
        return roleObj[0];
      }
    }

  }

  async update({ Id, updates }) {
    const user = await this.ctx.model.Roles.findById(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.update(updates);
  }

  async del(id) {
    const user = await this.ctx.model.Roles.findById(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.destroy();
  }

}

module.exports = Roles;
