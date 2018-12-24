'use strict';

const Service = require('egg').Service;

class Artifacts extends Service {

  async list({ offset = 0, limit = 10, visible = 0, jobTag = 0}) {

    return this.ctx.model.Artifacts.listArtifacts({
      offset,
      limit,
      visible,
      jobTag,
    });
  }

  async find(id) {
    const artifact = await this.ctx.model.Artifacts.findArtifactById(id);
    return artifact;
  }

  async create(artifact) {
    artifact.userId = 4862;
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      const artiObj = await this.ctx.model.Artifacts.createArtifact(artifact,transaction);
      let terms = artifact.terms;
      for (let term of terms){
        const termObj = await this.ctx.model.Terms.createTerm(term,transaction);
        await this.ctx.model.ArtifactTerm.createArtifactTerm({
          artifactId:artiObj.Id,
          termId:termObj.Id
        },transaction);
      }
      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }
  }

  async update({ id, updates }) {
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      let updateObject = await this.ctx.model.Artifacts.updateArtifact({ id, updates },transaction);
      await this.ctx.service.esUtils.updateobject(id, updates);
      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }
  }

  async del(id) {
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      const artifact = await this.ctx.model.Artifacts.findArtifactById(id);
      await this.ctx.model.Artifacts.delArtifactById(id, transaction);
      await this.ctx.model.ArtifactAssets.delAssetsByArtifactId(id, transaction);
      await this.ctx.model.ArtifactComments.delCommentByArtifactId(id, transaction);
      await this.ctx.model.ArtifactTerm.delArtifactTermByArtifactId(id, transaction);
      await this.ctx.model.Users.reduceAllAggData(artifact.userId, artifact.medalCount, artifact.likeCount, artifact.commentCount, transaction);
      await this.ctx.service.esUtils.deleteObjectById(id);
      await transaction.commit();
      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }
  }

  async getMedalDataByRandom(limit){
    const listData = await this.ctx.model.Artifacts.getMedalDataByRandom();
    const max = listData.length;
    let result = new Array();
    for (let i = 0; i < limit; i++){
      let rand = Math.random();
      let num = Math.floor(rand * max);
      result.push(listData[num]);
    }
    return result;
  }

  async getPersonalJobByUserId(query) {
    return await this.ctx.model.Artifacts.getPersonalJobByUserId(query);
  }

  async transferArtifacts() {
    return await this.ctx.model.Artifacts.transferArtifacts();
  }
}

module.exports = Artifacts;
