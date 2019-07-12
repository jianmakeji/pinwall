'use strict';

const Service = require('egg').Service;

class Favourite extends Service {

  async transferFavourite() {
    const client1 = this.app.mysql.get('db3');
    const client2 = this.app.mysql.get('db4');

    const favourite = await client1.select("favorite");

    for (const fa of favourite){
        let data = {
          Id:fa.Id,
          userId:fa.userId,
          created_at:fa.created_at,
          updated_at:fa.updated_at,
          category:fa.category
        };

        if (fa.category == 1){
          data.specialCourseId = fa.courseId;
          data.eliteCourseId = 0;
        }
        else{
          data.eliteCourseId = fa.courseId;
          data.specialCourseId = 0;

        }
        await client2.insert("favorite",data);

    }
  }

}

module.exports = Favourite;
