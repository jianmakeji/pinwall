'use strict';

const Service = require('egg').Service;

class ArtifactScore extends Service {

  async list({
    offset = 0,
    limit = 10
  }) {
    return this.ctx.model.ArtifactScores.findAndCountAll({
      offset,
      limit,
      order: [
        ['createAt', 'desc']
      ],
    });
  }

  async findByArtifactIdWithPage({
    offset = 0,
    limit = 10,
    artifactId = 0
  }) {
    return this.ctx.model.ArtifactScores.findAndCountAll({
      offset,
      limit,
      order: [
        ['createAt', 'desc']
      ],
      where: {
        artifactId: artifactId,
      }
    });
  }

  async findByArtifactIdAndScorerId({
    scorerId = 0,
    artifactId = 0
  }) {
    return this.ctx.model.ArtifactScores.findAndCountAll({
      offset,
      limit,
      order: [
        ['createAt', 'desc']
      ],
      where: {
        artifactId: artifactId,
      }
    });
  }

  async create(artifactScores) {
    return this.ctx.model.ArtifactScores.create(artifactScores);
  }

  async update({
    artifactId = 0,
    scorerId = 0,
    score = 0
  }) {
    const artifactScores = await this.ctx.model.ArtifactScores.findByArtifactIdAndScorerId(scorerId,artifactId);
    if (!artifact) {
      this.ctx.throw(404, 'artifact not found');
    }
    return artifact.update({
      score: score
    }, {
      where: {
        artifactId: artifactId,
        scorerId: scorerId
      }
    });
  }

  async del(Id) {
    const artifact = await this.ctx.model.ArtifactScores.findById(Id);
    if (!artifact) {
      this.ctx.throw(404, 'artifact not found');
    }
    return artifact.destroy();
  }
}

module.exports = ArtifactScore;
