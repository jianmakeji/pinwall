'use strict';

const Service = require('egg').Service;

class Topics extends Service {

  async list({ offset = 0, limit = 10,jobTag = 0, subLimit = 10, status = 0 }) {
    return this.ctx.model.Topics.listTopics({
      offset,
      limit,
      jobTag,
      subLimit,
      status,
    });
  }

  async find(Id) {
    const topic = await this.ctx.model.Topics.findTopicById(Id);
    return topic;
  }

  async create(topic) {
    return this.ctx.model.Topics.createTopic(topic);
  }

  async update({ Id, updates }) {
    const topic = await this.ctx.model.Topics.updateTopic({ Id, updates });
    return topic;
  }

  async del(id) {
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      await this.ctx.model.Topics.delTopicById(id,transaction);
      await this.ctx.model.TopicTerm.delTopicTermByTopicId(id,transaction);
      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }
  }

  async getTopicAndArtifactById({ offset = 0, limit = 10, topicId = 0 }) {
    const topic = await this.ctx.model.Topics.getTopicAndArtifactById({
      offset,
      limit,
      topicId
    });
    return topic;
  }
}

module.exports = Topics;
