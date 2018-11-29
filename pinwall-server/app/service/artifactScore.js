'use strict';

const Service = require('egg').Service;

class ArtifactScore extends Service {

  async list({
    offset = 0,
    limit = 10
  }) {
    return this.ctx.model.ArtifactScores.listArtifactScores({
      offset,
      limit,
    });
  }

  async findByArtifactIdWithPage({
    offset = 0,
    limit = 10,
    artifactId = 0
  }) {
    return this.ctx.model.ArtifactScores.findByArtifactIdWithPage({
      offset,
      limit,
      artifactId
    });
  }

  async findByArtifactIdAndScorerId({
    scorerId = 0,
    artifactId = 0
  }) {
    return this.ctx.model.ArtifactScores.findByArtifactIdAndScorerId({
      scorerId,
      artifactId
    });
  }

  async create(artifactScores) {
    return this.ctx.model.ArtifactScores.createArtifactScores(artifactScores);
  }

  async update({
    artifactId = 0,
    scorerId = 0,
    score = 0
  }) {
    const artifactScores = await this.ctx.model.ArtifactScores.updateScore(artifactId,scorerId,score);
    return artifactScores;
  }

  async del(Id) {
    const artifact = await this.ctx.model.ArtifactScores.delArtifactScores(Id);
    return artifact;
  }
}

module.exports = ArtifactScore;
