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

  async findCommentById(id) {
    return this.ctx.model.ArtifactComments.findCommentById(id);
  }

  async create(artifactComments) {
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      await this.ctx.model.ArtifactComments.createComment(artifactComments, transaction);
      await this.ctx.model.Artifacts.addCommnet(artifactComments.artifactId, transaction);
      await this.ctx.model.Users.addCommnet(artifactComments.artifactUserId, transaction);
      await transaction.commit();
      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }

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
