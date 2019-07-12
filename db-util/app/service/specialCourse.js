'use strict';

const Service = require('egg').Service;

class SpecialCourse extends Service {

  async transferSpecialCourse() {
    const client1 = this.app.mysql.get('db3');
    const client2 = this.app.mysql.get('db4');

    const specialCourse = await client1.select("course");

    for (const sc of specialCourse){
      if(sc.courseType == 2){
        let data = {
          Id:sc.Id,
          name:sc.name,
          describe:sc.describe,
          created_at:sc.created_at,
          updated_at:sc.updated_at,
          duration:sc.duration,
          videoAddress:sc.videoAddress,
          lookingNum:sc.lookingNum,
          specialColumn:sc.specialColumn,
        };


        await client2.insert("special_course",data);
      }

    }
  }

}

module.exports = SpecialCourse;
