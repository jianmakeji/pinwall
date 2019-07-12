'use strict';

const Service = require('egg').Service;

class SpecialColumn extends Service {

  async transferSpecialColumn() {
    const client1 = this.app.mysql.get('db3');
    const client2 = this.app.mysql.get('db4');

    const specialColumn = await client1.select("special_column");

    for (const sc of specialColumn){
      if(sc.courseType == 2){
        let data = {
          Id:sc.Id,
          name:sc.name,
          teacherId:sc.teacherId,
          created_at:sc.created_at,
          updated_at:sc.updated_at,
          describe:sc.describe,
          grade:sc.grade,
          subject:1
        };


        await client2.insert("special_column",data);
      }

    }
  }

}

module.exports = SpecialColumn;
