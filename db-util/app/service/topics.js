'use strict';

const Service = require('egg').Service;

class Topics extends Service {

  async transferTopics() {
    const client1 = this.app.mysql.get('db1');
    const client2 = this.app.mysql.get('db2');

    const topics = await client1.select("topics");

    for (const topic of topics){
      let data = {
        Id:topic.id,
        userId:topic.user_id,
        name:topic.name,
        description:topic.description,
        status:topic.status,
        createAt:topic.created_at,
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

  async transferTopicArtifact(){
    const client1 = this.app.mysql.get('db1');
    const client2 = this.app.mysql.get('db2');

    const topic_artifacts = await client1.select("topic_artifact");

    for (const topic_artifact of topic_artifacts){
      let data = {
        topicId:topic_artifact.topic_id,
        artifactId:topic_artifact.artifact_id,
      };
      await client2.insert("topic_artifact",data);
    }
  }
}

module.exports = Topics;
