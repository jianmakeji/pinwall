'use strict';

const Service = require('egg').Service;

class ArtifactComment extends Service {

  async list({ offset = 0, limit = 10}) {
    return this.ctx.model.ArtifactComments.findAndCountAll({
      offset,
      limit,
      order: [[ 'createAt', 'desc' ]],
    });
  }

  async findByArtifactIdWithPage({ offset = 0, limit = 10, artifactId = 0}) {
    return this.ctx.model.ArtifactComments.findAndCountAll({
      offset,
      limit,
      order: [[ 'createAt', 'desc' ]],
      where:{
        artifactId:artifactId,
      }
    });
  }

  async create(artifactComments) {
    return this.ctx.model.ArtifactComments.create(artifactComments);
  }

  async update({Id = 0, visible = 0}) {
    const artifact = await this.ctx.model.ArtifactComments.findById(Id);
    if (!artifact) {
      this.ctx.throw(404, 'artifact not found');
    }
    return artifact.update({visible:visible},{where:{Id:Id}});
  }

  async del(Id) {
    const artifact = await this.ctx.model.ArtifactComments.findById(Id);
    if (!artifact) {
      this.ctx.throw(404, 'artifact not found');
    }
    return artifact.destroy();
  }
}

module.exports = ArtifactComment;
