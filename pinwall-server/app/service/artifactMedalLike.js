'use strict';

const Service = require('egg').Service;

class ArtifactMedalLike extends Service {

  async create(artifactMedalLike) {
    const mlObj = this.ctx.model.ArtifactMedalLike.findByArtifactIdAndUserId(artifactMedalLike);

    if (!mlObj){
      return false;
    }
    else{
      let transaction;
      try {
        transaction = await this.ctx.model.transaction();
        await this.ctx.model.ArtifactMedalLike.createMedalAndLike(artifactMedalLike, transaction);
        if (artifactMedalLike.tag == 1){
          await this.ctx.model.Artifacts.addMedal(artifactMedalLike.artifactId, transaction);
        }
        else if (artifactMedalLike.tag == 2){
          await this.ctx.model.Artifacts.addlike(artifactMedalLike.artifactId, transaction);
        }

        await transaction.commit();
        return true
      } catch (e) {
        await transaction.rollback();
        return false
      }
    }

  }

}

module.exports = ArtifactMedalLike;
