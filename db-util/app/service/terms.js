'use strict';

const Service = require('egg').Service;

class Terms extends Service {

  async transferTerms() {
    const ctx = this.ctx;
    const client1 = ctx.app.mysql.get('db1');
    const client2 = ctx.app.mysql.get('db2');

    const terms = await client1.select("terms");

    for (const term of terms){
      let data = {
        Id:term.id,
        name:term.name
      };

      await client2.insert("terms",data);
    }
  }

  async transferTopicTerm() {
    const ctx = this.ctx;
    const client1 = ctx.app.mysql.get('db1');
    const client2 = ctx.app.mysql.get('db2');

    const topicTerms = await client1.select("topic_term");

    for (const topicTerm of topicTerms){
      let data = {
        topicId:topicTerm.topic_id,
        termId:topicTerm.term_id
      };

      await client2.insert("topic_term",data);
    }
  }
}

module.exports = Terms;
