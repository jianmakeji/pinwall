'use strict';

const Service = require('egg').Service;

class Users extends Service {

  async transferUsers() {
    const client1 = this.app.mysql.get('db1');
    const client2 = this.app.mysql.get('db2');

    const users = await client1.select("users");

    for (const user of users){
      let data = {
        Id:user.id,
        email:user.email,
        fullname:user.fullname,
        password:user.password,
        createAt:user.createAt,
        confirmedAt:user.confirmedAt,
      };

      if (user.active == 't'){
        user.active = 1;
      }
      else{
        user.active = 0;
      }

      await client2.insert("users",data);
    }

  }

  async transferRoles() {
    const ctx = this.ctx;
    const client1 = ctx.app.mysql.get('db1');
    const client2 = ctx.app.mysql.get('db2');

    const roles = await client1.select("roles");

    for (const role of roles){
      let data = {
        Id:role.id,
        name:role.name,
        description:role.description
      };

      await client2.insert("roles",data);
    }
  }

  async transferUserRoles() {
    const ctx = this.ctx;
    const client1 = ctx.app.mysql.get('db1');
    const client2 = ctx.app.mysql.get('db2');

    const userRoles = await client1.select("user_role");

    for (const userRole of userRoles){
      let data = {
        userId:userRole.user_id,
        roleId:userRole.role_id,
      };

      await client2.insert("user_role",data);
    }
  }
}

module.exports = Users;
