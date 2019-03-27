'use strict';

const Service = require('egg').Service;

class Comment extends Service {

  async transferComment() {
    const client1 = this.app.mysql.get('db3');
    const client2 = this.app.mysql.get('db4');

    const comments = await client1.select("comment");

    for (const comment of comments){
      let data = {
        Id:comment.Id,
        userId:comment.userId,
        content:comment.content,
        // category:comment.,
        // specialCourseId:comment.,
        // eliteCourseId:comment.,
        created_at:comment.created_at,
        updated_at:comment.updated_at,
      };

      if (topic.name.indexOf("毕业设计") == -1)
      {
        data.jobTag = 1;
      }
      else{
        data.jobTag = 2;
      }
      await client2.insert("topics",data);
    }
  }

}

module.exports = Comment;
