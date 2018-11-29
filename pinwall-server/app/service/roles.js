'use strict';

const Service = require('egg').Service;

class Roles extends Service {

  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Roles.listRoles({
      offset,
      limit,
    });
  }

  async find(Id) {
    const role = await this.ctx.model.Roles.findRoleById(Id);
    return role;
  }

  async create(role) {
    if (role.name == '' || role.name == null){
      throw new Error('名称不能为空');
    }
    else{
      return this.ctx.model.Roles.create(role);
    }
  }

  async update({ Id, updates }) {
    const user = await this.ctx.model.Roles.update({ Id, updates });
    return user;
  }

  async del(id) {
    const user = await this.ctx.model.Roles.del(id);
    return user;
  }

}

module.exports = Roles;
