'use strict';

const Service = require('egg').Service;

class EliteSchool extends Service {

  async transferEliteSchool() {
    const client1 = this.app.mysql.get('db3');
    const client2 = this.app.mysql.get('db4');

    const specialColumn = await client1.select("special_column");

    for (const sc of specialColumn){
      if(sc.courseType == 1){
        let data = {
          Id:sc.Id,
          name:sc.name,
          created_at:sc.created_at,
          updated_at:sc.updated_at,
          grade:sc.grade,
          subject:1
        };

        if(sc.name.indexOf('湘一') != -1 || sc.name.indexOf('青竹湖') != -1){
          data.schoolId = 4;
        }
        else if(sc.name.indexOf('长郡') != -1){
          data.schoolId = 3;
        }
        else if(sc.name.indexOf('师大') != -1){
          data.schoolId = 5;
        }
        else if(sc.name.indexOf('麓') != -1){
          data.schoolId = 7;
        }
        await client2.insert("elite_school",data);
      }

    }
  }

}

module.exports = EliteSchool;
