'use strict';

const Service = require('egg').Service;

class Artifacts extends Service {

  async list({ offset = 0, limit = 10, visible = 0, jobTag = 0}) {

    let resultObj = await this.ctx.model.Artifacts.listArtifacts({
      offset,
      limit,
      visible,
      jobTag,
    });

    const app = this.ctx.app;
    resultObj.rows.forEach((element, index)=>{
      if (element.profileImage.indexOf('pinwall.fzcloud') == -1){
        element.profileImage = app.signatureUrl(app.imagePath + element.profileImage, "thumb_360_360");

        for (let subElement of element.artifact_assets){
          subElement.profileImage = app.signatureUrl(app.imagePath + subElement.profileImage, "thumb_1000");
          if (subElement.type == 2 && subElement.mediaFile != null){
            subElement.mediaFile = app.signatureUrl(app.pdfPath + subElement.mediaFile);
          }
          else if (subElement.type == 3 && subElement.mediaFile != null){
            subElement.mediaFile = app.signatureUrl(app.rar_zipPath + subElement.mediaFile);
          }
          else if (subElement.type == 4 && subElement.mediaFile != null){
            subElement.mediaFile = app.signatureUrl(app.videoPath + subElement.mediaFile);
          }
        }
      }

    });

    return resultObj;
  }

  async find(id) {

    const artifact = await this.ctx.model.Artifacts.findArtifactById(id);
    const app = this.ctx.app;

    if (artifact.profileImage.indexOf('pinwall.fzcloud') == -1){
      artifact.profileImage = app.signatureUrl(app.imagePath + artifact.profileImage, "thumb_360_360");

        for (let subElement of artifact.artifact_assets){
          subElement.profileImage = app.signatureUrl(app.imagePath + subElement.profileImage, "thumb_1000");
          if (subElement.type == 2 && subElement.mediaFile != null){
            subElement.mediaFile = app.signatureUrl(app.pdfPath + subElement.mediaFile);
          }
          else if (subElement.type == 3 && subElement.mediaFile != null){
            subElement.mediaFile = app.signatureUrl(app.rar_zipPath + subElement.mediaFile);
          }
          else if (subElement.type == 4 && subElement.mediaFile != null){
            subElement.mediaFile = app.signatureUrl(app.videoPath + subElement.mediaFile);
          }
        }
    }

    return artifact;
  }

  async create(artifact) {
    const topic = await this.ctx.model.Topics.findTopicById(artifact.topicId);
    if(topic){
      if(topic.status == 0)
      {
        let transaction;
        try {
          transaction = await this.ctx.model.transaction();
          artifact.visible = 0;
          const artiObj = await this.ctx.model.Artifacts.createArtifact(artifact,transaction);
          if (artifact.topicId != 0){
              await this.ctx.model.TopicArtifact.createTopicArtifact(
                  {
                    artifactId:artiObj.Id,
                    topicId:artifact.topicId
                  },transaction);
          }

          let terms = artifact.terms;
          for (let term of terms){
            const termObj = await this.ctx.model.Terms.createTerm(term,transaction);
            await this.ctx.model.ArtifactTerm.createArtifactTerm({
              artifactId:artiObj.Id,
              termId:termObj.Id
            },transaction);
          }
          await transaction.commit();
          try{
            let esObject = await this.ctx.model.Artifacts.findArtifactById(artiObj.Id);
            await this.ctx.service.esUtils.createObject(artiObj.Id, esObject);
          }
          catch(e){
            this.ctx.getLogger('elasticLogger').info("ID:"+artiObj.Id+": "+e.message+"\n");
          }

          return true
        } catch (e) {
            console.log(e);
          await transaction.rollback();
          return false
        }
      }
      else if(topic.status == 1){
        return false;
      }

    }
    else{
      return false;
    }
  }

  async update({ id, updates }) {
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      updates.updateAt = new Date();
      let updateObject = await this.ctx.model.Artifacts.updateArtifact({ id, updates },transaction);
      const artifact = await this.ctx.model.Artifacts.findArtifactById(id);

      if (updates.artifact_assets && updates.artifact_assets.length > 0){
        await this.ctx.model.ArtifactAssets.delAssetsByArtifactId(id,transaction);
        for (let artifact_asset of updates.artifact_assets){
            const asset = {};
            asset.position = artifact_asset.position,
            asset.name = artifact_asset.name,
            asset.filename = artifact_asset.filename,
            asset.description = artifact_asset.description,
            asset.type = artifact_asset.type,
            asset.profileImage = artifact_asset.profileImage,
            asset.mediaFile = artifact_asset.mediaFile,
            asset.viewUrl = artifact_asset.viewUrl,
            asset.artifactId = id;
            await this.ctx.model.ArtifactAssets.createAssets(asset,transaction);
        }
      }

      if (updates.addTerms && updates.addTerms.length > 0){
        for (let term of updates.addTerms){
          const termObj = await this.ctx.model.Terms.createTerm(term,transaction);
          await this.ctx.model.ArtifactTerm.createArtifactTerm({
            artifactId:artifact.Id,
            termId:termObj.Id
          },transaction);
        }
      }

      if (updates.deleteTerms && updates.deleteTerms.length > 0){
        await this.ctx.model.ArtifactTerm.delArtifactTermByArtifactIdAndtermId(id,updates.deleteTerms,transaction);
      }
      await transaction.commit();

      try{
        let esObject = await this.ctx.model.Artifacts.findArtifactById(id);
        await this.ctx.service.esUtils.updateobject(id, esObject);
      }
      catch(e){
        this.ctx.getLogger('elasticLogger').info("ID:"+artiObj.Id+": "+e.message+"\n");
      }

      try{
        let deleteAliOSSArray = new Array();
        if ((updates.profileImage != '' || updates.profileImage != null) && updates.profileImage != artifact.profileImage){
          deleteAliOSSArray.push(ctx.app.imagePath + artifact.profileImage);
        }

        for (const artifactAssets of artifact.artifact_assets){
            for(const updateAssets of updates.artifact_assets){
                if (artifactAssets.profileImage != updateAssets.profileImage){
                    deleteAliOSSArray.push(ctx.app.imagePath + artifactAssets.profileImage);
                }

                if (artifactAssets.mediaFile != updateAssets.mediaFile){
                    if(artifactAssets.type == 2){
                      deleteAliOSSArray.push(ctx.app.pdfPath + artifactAssets.mediaFile);
                    }
                    else if(artifactAssets.type == 3){
                      deleteAliOSSArray.push(ctx.app.rar_zipPath + artifactAssets.mediaFile);
                    }
                    else if(artifactAssets.type == 4){
                      deleteAliOSSArray.push(ctx.app.videoPath + artifactAssets.mediaFile);
                    }
                }
            }
        }
        if (deleteAliOSSArray.length > 0){
          this.ctx.app.deleteOssMultiObject(deleteAliOSSArray);
        }
      }
      catch(e){
          this.ctx.getLogger('aliossLogger').info("delete file:"+deleteAliOSSArray.join(',')+": "+e.message+"\n");
      }

      return true
    } catch (e) {
            console.log(e);
        console.log(e.message);
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

      try{
        await this.ctx.service.esUtils.deleteObjectById(id);
      }
      catch(e){
        this.ctx.getLogger('elasticLogger').info("delete ID:"+id+": "+e.message+"\n");
      }

      try{
        let deleteAliOSSArray = new Array();
        deleteAliOSSArray.push(ctx.app.imagePath + artifact.profileImage);
        for (const artifactAssets of artifact.artifactAssets){
          if (artifactAssets.type == 1){
            deleteAliOSSArray.push(ctx.app.imagePath + artifact.profileImage);
          }
          else if(artifactAssets.type == 2){
            deleteAliOSSArray.push(ctx.app.imagePath + artifact.profileImage);
            deleteAliOSSArray.push(ctx.app.pdfPath + artifact.mediaFile);
          }
          else if(artifactAssets.type == 3){
            deleteAliOSSArray.push(ctx.app.imagePath + artifact.profileImage);
            deleteAliOSSArray.push(ctx.app.rar_zipPath + artifact.mediaFile);
          }
          else if(artifactAssets.type == 4){
            deleteAliOSSArray.push(ctx.app.imagePath + artifact.profileImage);
            deleteAliOSSArray.push(ctx.app.videoPath + artifact.mediaFile);
          }
        }
        if (deleteAliOSSArray.length > 0){
          this.ctx.app.deleteOssMultiObject(deleteAliOSSArray);
        }

      }
      catch(e){
          this.ctx.getLogger('aliossLogger').info("delete ID:"+deleteAliOSSArray.join(',')+": "+e.message+"\n");
      }
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
    const setData = new Set();
    while(setData.size != limit){
      let rand = Math.random();
      let num = Math.floor(rand * max);
      setData.add(num);
    }
    let result = new Array();
    for (let item of setData.values()) {
      result.push(listData[item]);
    }

    return result;
  }

  async getPersonalJobByUserId(query) {
    let resultObj = await this.ctx.model.Artifacts.getPersonalJobByUserId(query);
    const app = this.ctx.app;
    resultObj.rows.forEach((element, index)=>{
      if (element.profileImage.indexOf('pinwall.fzcloud') == -1){
        element.profileImage = app.signatureUrl(app.imagePath + element.profileImage, "thumb_360_360");

        for (let subElement of element.artifact_assets){
          subElement.profileImage = app.signatureUrl(app.imagePath + subElement.profileImage, "thumb_1000");
          if (subElement.type == 2 && subElement.mediaFile != null){
            subElement.mediaFile = app.signatureUrl(app.pdfPath + subElement.mediaFile);
          }
          else if (subElement.type == 3 && subElement.mediaFile != null){
            subElement.mediaFile = app.signatureUrl(app.rar_zipPath + subElement.mediaFile);
          }
          else if (subElement.type == 4 && subElement.mediaFile != null){
            subElement.mediaFile = app.signatureUrl(app.videoPath + subElement.mediaFile);
          }
        }
      }

    });
    return resultObj;
  }

  async transferArtifacts() {
    let data = await this.ctx.model.Artifacts.transferArtifacts();

    return data;
  }
}

module.exports = Artifacts;
