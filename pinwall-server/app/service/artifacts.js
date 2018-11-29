'use strict';

const Service = require('egg').Service;

class Artifacts extends Service {

  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Artifacts.listArtifacts({
      offset,
      limit,
    });
  }

  async find(id) {
    const artifact = await this.ctx.model.Artifacts.findArtifactById(id);
    return artifact;
  }

  async create(artifact) {
    return await this.ctx.model.Artifacts.createArtifact(artifact);
  }

  async update({ id, updates }) {
    return await this.ctx.model.Artifacts.updateArtifact({ id, updates });
  }

  async del(id) {
    return await this.ctx.model.Artifacts.delArtifactById(id);
  }

}

module.exports = Artifacts;
