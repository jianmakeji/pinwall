'use strict';

const Service = require('egg').Service;

class PrometheusUsers extends Service {

  async transferPrometheusUsers() {
    const client1 = this.app.mysql.get('db3');
    const client2 = this.app.mysql.get('db4');

    const users = await client1.select("user");

    for (const user of users){
        let data = {
          Id:user.Id,
          openId:user.openId,
          created_at:user.created_at,
          updated_at:user.updated_at,
          username:user.username,
          password:user.password,
          nickName:user.nickName,
          avatarUrl:user.avatarUrl,
          gender:user.gender,
          province:user.province,
          city:user.city,
          country:user.country,
          mobile:user.mobile,
        };

      
        await client2.insert("user",data);

    }
  }

}

module.exports = PrometheusUsers;
