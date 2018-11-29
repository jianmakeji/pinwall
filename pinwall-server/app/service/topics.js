'use strict';

const Service = require('egg').Service;

class Topics extends Service {

  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Topics.listTopics({
      offset,
      limit,
    });
  }

  async find(Id) {
    const topic = await this.ctx.model.Topics.findById(Id);
    return topic;
  }

  async create(topic) {
    return this.ctx.model.Topics.create(topic);
  }

  async update({ Id, updates }) {
    const topic = await this.ctx.model.Topics.update({ Id, updates });
    return topic;
  }

  async del(id) {
    const topic = await this.ctx.model.Topics.del(id);
    return topic;
  }

}

module.exports = Topics;
