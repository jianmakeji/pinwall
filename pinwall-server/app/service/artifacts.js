'use strict';

const Service = require('egg').Service;

class Artifacts extends Service {

  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Artifacts.findAndCountAll({
      offset,
      limit,
      order: [[ 'createAt', 'desc' ], [ 'Id', 'desc' ]],
    });
  }

  async find(id) {
    const artifact = await this.ctx.model.Artifacts.findById(id);
    if (!artifact) {
      this.ctx.throw(404, 'artifact not found');
    }
    return artifact;
  }

  async create(artifact) {
    return this.ctx.model.Artifacts.create(artifact);
  }

  async update({ id, updates }) {
    const artifact = await this.ctx.model.Artifacts.findById(id);
    if (!artifact) {
      this.ctx.throw(404, 'artifact not found');
    }
    return artifact.update(updates);
  }

  async del(id) {
    const artifact = await this.ctx.model.Artifacts.findById(id);
    if (!artifact) {
      this.ctx.throw(404, 'artifact not found');
    }
    return artifact.destroy();
  }

}

module.exports = Artifacts;
