'use strict';

const Service = require('egg').Service;

class Topics extends Service {

  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Topics.findAndCountAll({
      offset,
      limit,
      order: [[ 'createAt', 'desc' ], [ 'Id', 'desc' ]],
    });
  }

  async find(Id) {
    const topic = await this.ctx.model.Topics.findById(Id);
    if (!topic) {
      this.ctx.throw(404, 'topic not found');
    }
    return topic;
  }

  async create(topic) {
    if (topic.name == '' || topic.name == null){
      throw new Error('名称不能为空');
    }
    else{
      return this.ctx.model.Topics.create(topic);
    }
  }

  async update({ Id, updates }) {
    const topic = await this.ctx.model.Topics.findById(id);
    if (!topic) {
      this.ctx.throw(404, 'topic not found');
    }
    return topic.update(updates);
  }

  async del(id) {
    const topic = await this.ctx.model.Topics.findById(id);
    if (!topic) {
      this.ctx.throw(404, 'topic not found');
    }
    return topic.destroy();
  }

}

module.exports = Topics;
