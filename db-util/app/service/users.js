'use strict';

const Service = require('egg').Service;

class Users extends Service {

  async transferUsers() {
    const client1 = this.app.mysql.get('db1');
    const client2 = this.app.mysql.get('db2');

    const users = await client1.select("users");
    console.log(users.length);
    for (const user of users){
      console.log(user.id);
      let data = {
        Id:user.id,
        email:user.email,
        fullname:user.fullname,
        password:user.password,
        createAt:user.createAt,
        confirmedAt:user.confirmedAt,
        active:user.active,
      };

      const resultCount1 = await client2.query('select medalCount,likeCount,commentCount from artifacts aml where aml.userId = ?', [user.id]);
      let likeCount = 0;
      let medalCount = 0;
      let commentCount = 0;

      for (const artifact of resultCount1){
        likeCount = likeCount + artifact.likeCount;
        medalCount = medalCount + artifact.medalCount;
        commentCount = commentCount + artifact.commentCount;
      }

      data.likeCount = likeCount;
      data.medalCount = medalCount;
      data.commentCount = commentCount;

      const resultCount2 = await client2.query('select count(*)  as count from artifacts ars where ars.userId = ? ', [user.id]);
      data.artifactCount = resultCount2[0].count;

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
