'use strict';

const Service = require('egg').Service;

class ArtifactComment extends Service {

  async list({ offset = 0, limit = 10}) {
    return this.ctx.model.ArtifactComments.listComments({
      offset,
      limit,
    });
  }

  async findByArtifactIdWithPage({ offset = 0, limit = 10, artifactId = 0}) {
    return this.ctx.model.ArtifactComments.findByArtifactIdWithPage({
      offset,
      limit,
      artifactId,
    });
  }

  async create(artifactComments) {
    return this.ctx.model.ArtifactComments.createComment(artifactComments);
  }

  async update({Id = 0, visible = 0}) {
    const artifact = await this.ctx.model.ArtifactComments.setVisible(Id);
    return artifact;
  }

  async del(Id) {
    const artifact = await this.ctx.model.ArtifactComments.delCommentById(Id);

    return artifact;
  }
}

module.exports = ArtifactComment;
