'use strict';

const Service = require('egg').Service;

class Topics extends Service {

  async list({ offset = 0, limit = 10,jobTag = 0, subLimit = 10, status = 0,userId=0,visible = 0 }) {
    let resultObj = await this.ctx.model.Topics.listTopics({
      offset,
      limit,
      jobTag,
      subLimit,
      status,
      userId,
    });

    const app = this.ctx.app;
    resultObj.rows.forEach((element, index)=>{

          for (let subElement of element.artifacts){
              if (subElement.profileImage.indexOf('pinwall.fzcloud') == -1){
            subElement.profileImage = app.signatureUrl(app.imagePath + subElement.profileImage, "thumb_360_360");
          }
        }
    });

    return resultObj;
  }

  async searchTopics({ offset = 0, limit = 10,jobTag = 0, subLimit = 10, status = 0,userId = 0,keyword='',visible = 0 }) {
    let resultObj = await this.ctx.model.Topics.searchTopics({
      offset,
      limit,
      jobTag,
      subLimit,
      status,
      userId,
      keyword,
    });

    const app = this.ctx.app;
    resultObj.rows.forEach((element, index)=>{

          for (let subElement of element.artifacts){
              if (subElement.profileImage.indexOf('pinwall.fzcloud') == -1){
                subElement.profileImage = app.signatureUrl(app.imagePath + subElement.profileImage, "thumb_360_360");
              }
          }
    });

    return resultObj;
  }


  async find(Id) {
    const topic = await this.ctx.model.Topics.findTopicById(Id);
    return topic;
  }

  async create(topic) {
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      const topicObj = await this.ctx.model.Topics.createTopic(topic,transaction);
      let terms = topic.terms;
      if(terms && terms.length > 0){
        for (let term of terms){
          const termObj = await this.ctx.model.Terms.createTerm(term,transaction);
          await this.ctx.model.TopicTerm.createTopicTerm({
            topicId:topicObj.Id,
            termId:termObj.Id
          },transaction);
        }
      }

      await transaction.commit();
      return true
    } catch (e) {
     console.log(e.message);
      await transaction.rollback();
      return false
    }
  }

  async update({ Id, updates }) {

    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      updates.updateAt = new Date();
      let updateObject = await this.ctx.model.Topics.updateTopic({ Id, updates },transaction);

      if (updates.addTerms && updates.addTerms.length > 0){
        for (let term of updates.addTerms){
          const termObj = await this.ctx.model.Terms.createTerm(term,transaction);
          await this.ctx.model.TopicTerm.createTopicTerm({
            topicId:topicObj.Id,
            termId:termObj.Id
          },transaction);
        }
      }

      if (updates.deleteTerms && updates.deleteTerms.length > 0){
        await this.ctx.model.TopicTerm.delTopicTermByTopicIdAndtermIds(id,updates.deleteTerms,transaction);
      }
      await transaction.commit();

      return true
    } catch (e) {
        console.log(e);
      await transaction.rollback();
      return false
    }
  }

  async del(id) {
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      await this.ctx.model.Topics.delTopicById(id,transaction);
      await this.ctx.model.TopicTerm.delTopicTermByTopicId(id,transaction);
      await transaction.commit();
      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }
  }

  async getTopicAndArtifactById({ offset = 0, limit = 10, topicId = 0, role = 'user', score = 0 }) {
    const topic = await this.ctx.model.Topics.getTopicAndArtifactById({
      offset,
      limit,
      topicId,
      role,
      score
    });

    const app = this.ctx.app;

    topic.rows.artifacts.forEach((element, index)=>{
      if (element.profileImage.indexOf('pinwall.fzcloud') == -1){
        element.profileImage = app.signatureUrl(app.imagePath + element.profileImage, "thumb_360_360");
      }

      if (this.ctx.user){
        if(role == 'vip' && topic.rows.userId != this.ctx.user.Id){
          //删除所有分数
          element.artifact_scores = null;
        }
        else if (role == 'user'){
          let users = new Array();
          users.push(this.ctx.user.Id);
          let teamworker = element.teamworker;
          if (teamworker){
            let teamArray = JSON.parse(teamworker);
            teamArray.forEach((tw)=>{
              users.push(tw.Id);
            });
          }
          
          if (!users.includes(element.user.Id)){
            element.artifact_scores = null;
          }
        }
      }
      else{
        element.artifact_scores = null;
      }
    });

    return topic;
  }

  async updateTopicStatus(topicId,status){
    return await this.ctx.model.Topics.updateTopicStatus(topicId,status);
  }

  async findArtifactByTopicId(topicId){
    return await this.ctx.model.Topics.findArtifactByTopicId(topicId);
  }

  async countTopicsByUserId(userId){
    return await this.ctx.model.Topics.countTopicsByUserId(userId);
  }
}

module.exports = Topics;
