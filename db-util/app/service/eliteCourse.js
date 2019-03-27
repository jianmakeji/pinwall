'use strict';

const Service = require('egg').Service;

class EliteCourse extends Service {

  async transferEliteCourse() {
    const client1 = this.app.mysql.get('db3');
    const client2 = this.app.mysql.get('db4');

    const eliteCourse = await client1.select("course");

    for (const ec of eliteCourse){
      if(ec.courseType == 1){
        let data = {
          Id:ec.Id,
          name:ec.name,
          describe:ec.describe,
          created_at:ec.created_at,
          updated_at:ec.updated_at,
          duration:ec.duration,
          videoAddress:ec.videoAddress,
          lookingNum:ec.lookingNum,
          eliteSchoolId:ec.specialColumn,
        };


        await client2.insert("elite_course",data);
      }

    }
  }

}

module.exports = EliteCourse;
