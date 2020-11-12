'use strict';

const Service = require('egg').Service;
const h5Util = require('../utils/h5Utils');
const fileUtil = require('../utils/fileUtils');
const fs = require('fs');

class Artifacts extends Service {

  async list({ offset = 0, limit = 10, jobTag = 0}) {

    let resultObj = await this.ctx.model.Artifacts.listArtifacts({
      offset,
      limit,
      jobTag,
    });

    const app = this.ctx.app;
    resultObj.rows.forEach((element, index)=>{
      if (element.storageTag == 2){
        element.profileImage = app.signatureUrl(app.imagePath + element.profileImage, "thumb_360_360");
      }
      else{
        element.profileImage = app.qiniuUrlPrefix + element.profileImage;
      }

      if(element.user && element.user.avatarUrl != "" && element.user.avatarUrl != null && !element.user.avatarUrl.includes("qlogo.cn")){
        element.user.avatarUrl = this.ctx.app.signatureUrl(this.ctx.app.headiconPath + element.user.avatarUrl, "thumb_120_120");
      }

      for (let subElement of element.artifact_assets){
        if (subElement.storageTag == 2){
          subElement.profileImage = app.signatureUrl(app.imagePath + subElement.profileImage, "thumb_1000");
        }
        else{
          subElement.profileImage = app.qiniuUrlPrefix + subElement.profileImage;
        }

        if (subElement.type == 2 && subElement.mediaFile != null){
          if (subElement.storageTag == 2){
            subElement.mediaFile = app.signatureUrl(app.pdfPath + subElement.mediaFile);
          }
          else{
            subElement.mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
          }
        }
        else if (subElement.type == 3 && subElement.mediaFile != null){
          if (subElement.storageTag == 2){
            subElement.mediaFile = app.signatureUrl(app.rar_zipPath + subElement.mediaFile);
          }
          else{
            subElement.mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
          }
        }
        else if (subElement.type == 4 && subElement.mediaFile != null){
          if (subElement.storageTag == 2){
            subElement.mediaFile = app.signatureUrl(app.videoPath + subElement.mediaFile);
          }
          else{
            subElement.mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
          }
        }
        else if (subElement.type == 5 && subElement.mediaFile != null){
          let mediaFile = '';
          if (subElement.storageTag == 2){
            mediaFile = app.signatureUrl(app.othersPath + subElement.mediaFile);
          }
          else{
            mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
          }
          subElement.mediaFile = h5Util.getH5Url(artifact.Id, mediaFile, app);
        }
      }

    });

    return resultObj;
  }

  async find(id) {

    const artifact = await this.ctx.model.Artifacts.findArtifactById(id);

    const app = this.ctx.app;

    if (artifact.storageTag == 2){
      artifact.profileImage = app.signatureUrl(app.imagePath + artifact.profileImage, "thumb_360_360");
    }
    else{
      artifact.profileImage = app.qiniuUrlPrefix + artifact.profileImage;
    }

    if(artifact.user && artifact.user.avatarUrl != "" && artifact.user.avatarUrl != null && !artifact.user.avatarUrl.includes("qlogo.cn")){
      artifact.user.avatarUrl = this.ctx.app.signatureUrl(this.ctx.app.headiconPath + artifact.user.avatarUrl, "thumb_120_120");
    }

    for (let subElement of artifact.dataValues.artifact_assets){
      if (subElement.storageTag == 2){
        subElement.profileImage = app.signatureUrl(app.imagePath + subElement.profileImage, "thumb_1000");
      }
      else{
        subElement.profileImage = app.qiniuUrlPrefix + subElement.profileImage;
      }

      if (subElement.type == 2 && subElement.mediaFile != null){
        if (subElement.storageTag == 2){
          subElement.mediaFile = app.signatureUrl(app.pdfPath + subElement.mediaFile);
        }
        else{
          subElement.mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
        }
      }
      else if (subElement.type == 3 && subElement.mediaFile != null){
        if (subElement.storageTag == 2){
          subElement.mediaFile = app.signatureUrl(app.rar_zipPath + subElement.mediaFile);
        }
        else{
          subElement.mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
        }
      }
      else if (subElement.type == 4 && subElement.mediaFile != null){
        if (subElement.storageTag == 2){
          subElement.mediaFile = app.signatureUrl(app.videoPath + subElement.mediaFile);
        }
        else{
          subElement.mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
        }
      }
      else if (subElement.type == 5 && subElement.mediaFile != null){
        let mediaFile = '';
        if (subElement.storageTag == 2){
          mediaFile = app.signatureUrl(app.othersPath + subElement.mediaFile);
        }
        else{
          mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
        }
        subElement.mediaFile = h5Util.getH5Url(artifact.Id, mediaFile, app);
      }
    }

    let ctx = this.ctx;

    if (ctx.user && ctx.user.roles){
      let role = ctx.user.roles[0].name;
      if(role == 'vip'){
        //删除所有分数
        let topicUserId = new Array();
        artifact.topics.forEach((topic)=>{
          topicUserId.push(topic.userId);
        });
        if(!topicUserId.includes(ctx.user.Id)){
          artifact.artifact_scores.length = 0;
          artifact.artifact_scores.length = 1;
        }
      }
      else if (role == 'user'){
        let users = new Array();
        let teamworker = artifact.teamworker;
        if (teamworker){
          let teamArray = JSON.parse(teamworker);

          if (teamArray && (teamArray instanceof Array) && teamArray.length > 0){
            teamArray.forEach((tw)=>{
              users.push(tw.Id);
            });
          }
        }

        if (!(users.includes(ctx.user.Id) || (ctx.user.Id == artifact.user.Id))){
          artifact.artifact_scores.length = 0;
          artifact.artifact_scores.length = 1;
        }
      }
    }
    else{
      artifact.artifact_scores.length = 0;
      artifact.artifact_scores.length = 1;
    }


    return artifact;
  }

  async apiFindArtifactsById(id) {

    const artifactObj = await this.ctx.model.Artifacts.findArtifactById(id);
    const app = this.ctx.app;

    let resultObject = {};
    let assetsArray = [];
    resultObject.artifact = {
      id:artifactObj.Id,
      user_id:artifactObj.userId,
      name:artifactObj.name,
      description:artifactObj.description,

    }

    if (artifactObj.storageTag == 2 ){
      resultObject.artifact.profile_image = app.signatureUrl(app.imagePath + artifactObj.profileImage, "thumb_360_360");
    }
    else{
        resultObject.artifact.profile_image = artifactObj.profileImage;
    }

    if(artifactObj.user && artifactObj.user.avatarUrl != "" && artifactObj.user.avatarUrl != null && !artifactObj.user.avatarUrl.includes("qlogo.cn")){
      resultObject.artifact.user.avatarUrl = this.ctx.app.signatureUrl(this.ctx.app.headiconPath + artifactObj.user.avatarUrl, "thumb_120_120");
    }

    for (let subElement of artifactObj.dataValues.artifact_assets){
      let assetsObj = {};
      assetsObj.name = subElement.name;
      assetsObj.filename = subElement.filename;

      if (subElement.type == 2){
        assetsObj.profile_image = app.signatureUrl(app.imagePath + subElement.profileImage, "thumb_1000");
      }
      else{
        assetsObj.profile_image = app.qiniuUrlPrefix + subElement.profileImage;
      }

      if (subElement.type == 2 && subElement.mediaFile != null){
        if (subElement.storageTag == 2){
          assetsObj.media_file = app.signatureUrl(app.pdfPath + subElement.mediaFile);
        }
        else{
          assetsObj.media_file = app.qiniuUrlPrefix + subElement.mediaFile;
        }
      }
      else if (subElement.type == 3 && subElement.mediaFile != null){
        if (subElement.storageTag == 2){
          assetsObj.media_file = app.signatureUrl(app.rar_zipPath + subElement.mediaFile);
        }
        else{
          assetsObj.media_file = app.qiniuUrlPrefix + subElement.mediaFile;
        }
      }
      else if (subElement.type == 4 && subElement.mediaFile != null){
        if (subElement.storageTag == 2){
          assetsObj.media_file = app.signatureUrl(app.videoPath + subElement.mediaFile);
        }
        else{
          assetsObj.media_file = app.qiniuUrlPrefix + subElement.mediaFile;
        }
      }
      else if (subElement.type == 5 && subElement.mediaFile != null){
        let mediaFile = '';
        if (subElement.storageTag == 2){
          mediaFile = app.signatureUrl(app.othersPath + subElement.mediaFile);
        }
        else{
          mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
        }
        subElement.mediaFile = h5Util.getH5Url(artifact.Id, mediaFile, app);
      }
      assetsArray.push(assetsObj);
    }
    resultObject.artifact.assets = assetsArray;

    return resultObject;
  }

  async create(artifact) {
    if (artifact.topicId == 0 && artifact.jobTag == 2){ //作品集上传
      let transaction;
      try {
        transaction = await this.ctx.model.transaction();
        artifact.visible = 0;
        artifact.storageTag = 2;
        artifact.artifact_assets.forEach((artifactAsset)=>{
          artifactAsset.storageTag = 2;
        });
        const artiObj = await this.ctx.model.Artifacts.createArtifact(artifact,transaction);

        let terms = artifact.terms;
        if(terms){
          for (let term of terms){
            const termObj = await this.ctx.model.Terms.createTerm(term,transaction);
            await this.ctx.model.ArtifactTerm.createArtifactTerm({
              artifactId:artiObj.Id,
              termId:termObj.Id
            },transaction);
          }
        }

        await this.ctx.model.Users.addArtifact(artifact.userId,transaction);
        await transaction.commit();

        return true
      } catch (e) {
        this.ctx.logger.error(e);
        await transaction.rollback();
        return false
      }
    }
    else {
      //作业夹上传
      const topic = await this.ctx.model.Topics.findTopicById(artifact.topicId);
      if(topic){
        if(topic.status == 0)
        {
          let transaction;
          try {
            transaction = await this.ctx.model.transaction();
            artifact.visible = 0;
            artifact.storageTag = 2;
            artifact.artifact_assets.forEach((artifactAsset)=>{
              artifactAsset.storageTag = 2;
            });
            const artiObj = await this.ctx.model.Artifacts.createArtifact(artifact,transaction);
            if (artifact.topicId != 0){
                await this.ctx.model.TopicArtifact.createTopicArtifact(
                    {
                      artifactId:artiObj.Id,
                      topicId:artifact.topicId
                    },transaction);
            }

            let terms = artifact.terms;
            if (terms){
              for (let term of terms){
                const termObj = await this.ctx.model.Terms.createTerm(term,transaction);
                await this.ctx.model.ArtifactTerm.createArtifactTerm({
                  artifactId:artiObj.Id,
                  termId:termObj.Id
                },transaction);
              }
            }

            await this.ctx.model.Users.addArtifact(artifact.userId,transaction);
            await transaction.commit();

            return true
          } catch (e) {
            this.ctx.logger.error(e);
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

  }

  async update({ id, updates }) {
    const ctx = this.ctx;
    let transaction;
    try {
      transaction = await ctx.model.transaction();
      updates.updateAt = new Date();

      const artifact = await ctx.model.Artifacts.findArtifactById(id);

      let updateObject = await ctx.model.Artifacts.updateArtifact({ id, updates },transaction);

      if (updates.artifact_assets && updates.artifact_assets.length > 0){
        await ctx.model.ArtifactAssets.delAssetsByArtifactId(id,transaction);
        for (let artifact_asset of updates.artifact_assets){
            const asset = {};
            asset.position = artifact_asset.position,
            asset.name = artifact_asset.name,
            asset.filename = artifact_asset.filename,
            asset.description = artifact_asset.description,
            asset.type = artifact_asset.type,
            asset.profileImage = artifact_asset.profileImage,
            asset.imagename = artifact_asset.imagename,
            asset.mediaFile = artifact_asset.mediaFile,
            asset.viewUrl = artifact_asset.viewUrl,
            asset.artifactId = id;
            asset.storageTag = 2;
            await ctx.model.ArtifactAssets.createAssets(asset,transaction);
        }
      }

      if (updates.addTerms && updates.addTerms.length > 0){
        for (let term of updates.addTerms){
          const termObj = await ctx.model.Terms.createTerm(term,transaction);
          await ctx.model.ArtifactTerm.createArtifactTerm({
            artifactId:artifact.Id,
            termId:termObj.Id
          },transaction);
        }
      }

      if (updates.deleteTerms && updates.deleteTerms.length > 0){
        await ctx.model.ArtifactTerm.delArtifactTermByArtifactIdAndtermId(id,updates.deleteTerms,transaction);
      }
      await transaction.commit();

      try{
        let artiObj = await this.ctx.model.Artifacts.transterDataToESById(id);
        if (artiObj){
          await ctx.service.esUtils.updateobject(artiObj.Id, artiObj);
          let object = {};
          object.Id = artiObj.Id;
          object.suggest = new Array();

          let name_suggest = {};
          name_suggest.input = artiObj.name;
          name_suggest.weight = 10;
          object.suggest.push(name_suggest);

          let fullname_suggest = {};
          fullname_suggest.input = artiObj.user.fullname;
          fullname_suggest.weight = 16;
          object.suggest.push(fullname_suggest);

          artiObj.terms.forEach((term,index)=>{
            let term_suggest = {};
            term_suggest.input = term.name;
            term_suggest.weight = 8;
            object.suggest.push(term_suggest);
          });
          await ctx.service.esUtils.updateSuggestObject(artiObj.Id, artiObj);
        }
      }
      catch(e){
        ctx.getLogger('elasticLogger').info("update ID:"+id+": "+e.message+"\n");
      }

      let deleteAliOSSArray = new Array();
      try{
        if(artifact.storageTag == 2){
          if(artifact.profileImage != updates.profileImage){
            deleteAliOSSArray.push(ctx.app.imagePath + artifact.profileImage);
          }
        }

        for (const artifactAssets of artifact.dataValues.artifact_assets){
          if (artifactAssets.storageTag == 2){
              if(ctx.app.judgeImageStringInArrayObject(artifactAssets.profileImage,updates.artifact_assets)){
                deleteAliOSSArray.push(ctx.app.imagePath + artifactAssets.profileImage);
              }
          }

          if(artifactAssets.type == 2 &&  artifactAssets.storageTag == 2){
            if(ctx.app.judgeMediaStringInArrayObject(artifactAssets.mediaFile,updates.artifact_assets)){
              deleteAliOSSArray.push(ctx.app.pdfPath + artifactAssets.mediaFile);
            }
          }
          else if(artifactAssets.type == 3 &&  artifactAssets.storageTag == 2){
            if(ctx.app.judgeMediaStringInArrayObject(artifactAssets.mediaFile,updates.artifact_assets)){
              deleteAliOSSArray.push(ctx.app.rar_zipPath + artifactAssets.mediaFile);
            }
          }
          else if(artifactAssets.type == 4 &&  artifactAssets.storageTag == 2){
            if(ctx.app.judgeMediaStringInArrayObject(artifactAssets.mediaFile,updates.artifact_assets)){
              deleteAliOSSArray.push(ctx.app.videoPath + artifactAssets.mediaFile);
            }
          }
          else if(artifactAssets.type == 5 &&  artifactAssets.storageTag == 2){
            if(ctx.app.judgeMediaStringInArrayObject(artifactAssets.mediaFile,updates.artifact_assets)){
              deleteAliOSSArray.push(ctx.app.othersPath + artifactAssets.mediaFile);
              let h5Dir = ctx.app.localH5Path + id;
              fileUtil.delDir(h5Dir);
            }
          }
        }

        if (deleteAliOSSArray.length > 0){
          ctx.app.deleteOssMultiObject(deleteAliOSSArray);
        }
      }
      catch(e){
          ctx.getLogger('aliossLogger').info("delete file:"+deleteAliOSSArray.join(',')+": "+e.message+"\n");
      }

      return true
    } catch (e) {
      this.ctx.logger.error(e);
      await transaction.rollback();
      return false
    }
  }

  async del(id) {
    const ctx = this.ctx;
    let transaction;
    try {
      transaction = await ctx.model.transaction();
      const artifact = await ctx.model.Artifacts.findArtifactById(id);
      await ctx.model.Artifacts.delArtifactById(id, transaction);
      await ctx.model.ArtifactAssets.delAssetsByArtifactId(id, transaction);
      await ctx.model.ArtifactComments.delCommentByArtifactId(id, transaction);
      await ctx.model.ArtifactTerm.delArtifactTermByArtifactId(id, transaction);
      await ctx.model.Users.reduceAllAggData(artifact.userId, artifact.medalCount, artifact.likeCount, artifact.commentCount, transaction);

      try{
        await ctx.service.esUtils.deleteObjectById(id);
        await ctx.service.esUtils.deleteSuggestObjectById(id);
      }
      catch(e){
        ctx.getLogger('elasticLogger').info("delete ID:"+id+": "+e.message+"\n");
      }

      let deleteAliOSSArray = new Array();
      try{
        if (artifact.storageTag == 2){
          deleteAliOSSArray.push(ctx.app.imagePath + artifact.profileImage);
        }

        for (const artifactAssets of artifact.dataValues.artifact_assets){
          if (artifactAssets.storageTag == 2){
            deleteAliOSSArray.push(ctx.app.imagePath + artifactAssets.profileImage);
          }

          if(artifactAssets.type == 2 && artifactAssets.storageTag == 2){
            deleteAliOSSArray.push(ctx.app.pdfPath + artifactAssets.mediaFile);
          }
          else if(artifactAssets.type == 3  && artifactAssets.storageTag == 2){
            deleteAliOSSArray.push(ctx.app.rar_zipPath + artifactAssets.mediaFile);
          }
          else if(artifactAssets.type == 4  && artifactAssets.storageTag == 2){
            deleteAliOSSArray.push(ctx.app.videoPath + artifactAssets.mediaFile);
          }
          else if(artifactAssets.type == 5  && artifactAssets.storageTag == 2){
            deleteAliOSSArray.push(ctx.app.othersPath + artifactAssets.mediaFile);
          }
        }
        if (deleteAliOSSArray.length > 0){
          ctx.app.deleteOssMultiObject(deleteAliOSSArray);
        }

      }
      catch(e){
          ctx.getLogger('aliossLogger').info("delete ID:"+deleteAliOSSArray.join(',')+": "+e.message+"\n");
      }
      await transaction.commit();

      let h5Dir = ctx.app.localH5Path + id;
      fileUtil.delDir(h5Dir);

      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }
  }

  async getMedalDataByRandom(limit){
    const app = this.ctx.app;
    const listData = await this.ctx.model.Artifacts.getMedalDataByRandom();
    const max = listData.length;
    if(max < limit){
        listData.forEach((element, index)=>{
            let profileImage = element.profileImage;
            if (element.storageTag == 2){
                element.profileImage = app.signatureUrl(app.imagePath + profileImage, "thumb_360_360");
            }
            else{
              element.profileImage = app.qiniuUrlPrefix + element.profileImage;
            }
        });

        return listData;
    }
    else{
      const setData = new Set();
      while(setData.size != limit){
        let rand = Math.random();
        let num = Math.floor(rand * max);
        setData.add(num);
      }
      let result = new Array();
      for (let item of setData.values()) {
        let profileImage = listData[item].dataValues.profileImage;
        if (listData[item].dataValues.storageTag == 2){
          listData[item].dataValues.profileImage = app.signatureUrl(app.imagePath + profileImage, "thumb_360_360");
        }
        else{
          listData[item].dataValues.profileImage = app.qiniuUrlPrefix + listData[item].dataValues.profileImage;
        }
        result.push(listData[item]);
      }

      return result;
    }

  }

  async getPersonalJobByFullname(query) {
    const app = this.ctx.app;
    let result = {};
    let user = await this.ctx.model.Users.findUserByFullname(query.fullname);
    result.user = user;
    if(user && user.avatarUrl != "" && user.avatarUrl != null && !user.avatarUrl.includes("qlogo.cn")){
      user.avatarUrl = app.signatureUrl(this.ctx.app.headiconPath + user.avatarUrl, "thumb_120_120");
    }

    if(user.Id){
      query.Id = user.Id;
      let artifacts = await this.ctx.model.Artifacts.getPersonalJobByFullname(query)

      artifacts.rows.forEach((element, index)=>{
        if (element.storageTag == 2){
          element.profileImage = app.signatureUrl(app.imagePath + element.profileImage, "thumb_360_360");
        }
        else{
          element.profileImage = app.qiniuUrlPrefix + element.profileImage;
        }
      });
      result.artifacts = artifacts;
    }

    return result;

  }

  async getPersonalJobByUserId(query,tag) {
    let resultObj = {};
    if(tag == 1){
      resultObj = await this.ctx.model.Artifacts.getPersonalJobByUserId(query);
    }
    else{
      resultObj = await this.ctx.model.Artifacts.getPersonalJobByUserIdH5(query)
    }
    const app = this.ctx.app;
    resultObj.rows.forEach((element, index)=>{
      if (element.storageTag == 2){
        element.profileImage = app.signatureUrl(app.imagePath + element.profileImage, "thumb_360_360");
      }
      else{
        element.profileImage = app.qiniuUrlPrefix + element.profileImage;
      }

      if(element.user && element.user.avatarUrl != "" && element.user.avatarUrl != null && !element.user.avatarUrl.includes("qlogo.cn")){
        element.user.avatarUrl = this.ctx.app.signatureUrl(this.ctx.app.headiconPath + element.user.avatarUrl, "thumb_120_120");
      }

      for (let subElement of element.artifact_assets){
        if (subElement.storageTag == 2){
          subElement.profileImage = app.signatureUrl(app.imagePath + subElement.profileImage, "thumb_1000");
        }
        else{
          subElement.profileImage = app.qiniuUrlPrefix + subElement.profileImage;
        }
        if (subElement.type == 2 && subElement.mediaFile != null){
          if (subElement.storageTag == 2){
            subElement.mediaFile = app.signatureUrl(app.pdfPath + subElement.mediaFile);
          }
          else{
            subElement.mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
          }
        }
        else if (subElement.type == 3 && subElement.mediaFile != null){
          if (subElement.storageTag == 2){
            subElement.mediaFile = app.signatureUrl(app.rar_zipPath + subElement.mediaFile);
          }
          else{
            subElement.mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
          }
        }
        else if (subElement.type == 4 && subElement.mediaFile != null){
          if (subElement.storageTag == 2){
            subElement.mediaFile = app.signatureUrl(app.videoPath + subElement.mediaFile);
          }
          else{
            subElement.mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
          }
        }
        else if (subElement.type == 5 && subElement.mediaFile != null){
          let mediaFile = '';
          if (subElement.storageTag == 2){
            mediaFile = app.signatureUrl(app.othersPath + subElement.mediaFile);
          }
          else{
            mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
          }
          subElement.mediaFile = h5Util.getH5Url(element.Id, mediaFile, app);
        }
      }

    });
    return resultObj;
  }

  async transferArtifacts() {
    let data = await this.ctx.model.Artifacts.transferArtifacts();

    return data;
  }

  async transterInsertDataToES(idArray) {
    const ctx = this.ctx;
    try{
      let esArray = await this.ctx.model.Artifacts.transterDataToES(idArray);
      for (let artiObj of esArray){
        await ctx.service.esUtils.createObject(artiObj.Id, artiObj);

        let object = {};
        object.Id = artiObj.Id;
        object.suggest = new Array();

        let name_suggest = {};
        name_suggest.input = artiObj.name;
        name_suggest.weight = 10;
        object.suggest.push(name_suggest);

        let fullname_suggest = {};
        fullname_suggest.input = artiObj.user.fullname;
        fullname_suggest.weight = 16;
        object.suggest.push(fullname_suggest);

        artiObj.terms.forEach((term,index)=>{
          let term_suggest = {};
          term_suggest.input = term.name;
          term_suggest.weight = 8;
          object.suggest.push(term_suggest);
        });
        await ctx.service.esUtils.createSuggestObject(artiObj.Id, object);
      }
      return true;
    }
    catch(e){
      return false;
    }
  }

  async transterUpdateDataToES(idArray) {
    const ctx = this.ctx;
    try{
      let esArray = await this.ctx.model.Artifacts.transterDataToES(idArray);
      for (let artiObj of esArray){
        await ctx.service.esUtils.updateobject(artiObj.Id, artiObj);
        let object = {};
        object.Id = artiObj.Id;
        object.suggest = new Array();

        let name_suggest = {};
        name_suggest.input = artiObj.name;
        name_suggest.weight = 10;
        object.suggest.push(name_suggest);

        let fullname_suggest = {};
        fullname_suggest.input = artiObj.user.fullname;
        fullname_suggest.weight = 16;
        object.suggest.push(fullname_suggest);

        artiObj.terms.forEach((term,index)=>{
          let term_suggest = {};
          term_suggest.input = term.name;
          term_suggest.weight = 8;
          object.suggest.push(term_suggest);
        });
        await ctx.service.esUtils.updateSuggestObject(artiObj.Id, artiObj);
      }
      return true;
    }
    catch(e){
      return false;
    }
  }

  async updateVisibleById(id, visible){
    const ctx = this.ctx;
    try{
      await this.ctx.model.Artifacts.updateVisibleById(id, visible);
      if(visible == 0){
        let artiObj = await this.ctx.model.Artifacts.transterDataToESById(id);
        if (artiObj){
          await ctx.service.esUtils.createObject(artiObj.Id, artiObj);
          let object = {};
          object.Id = artiObj.Id;
          object.suggest = new Array();

          let name_suggest = {};
          name_suggest.input = artiObj.name;
          name_suggest.weight = 10;
          object.suggest.push(name_suggest);

          let fullname_suggest = {};
          fullname_suggest.input = artiObj.user.fullname;
          fullname_suggest.weight = 16;
          object.suggest.push(fullname_suggest);

          artiObj.terms.forEach((term,index)=>{
            let term_suggest = {};
            term_suggest.input = term.name;
            term_suggest.weight = 8;
            object.suggest.push(term_suggest);
          });
          await ctx.service.esUtils.createSuggestObject(artiObj.Id, object);

        }
      }
      else if (visible == 1){
        await ctx.service.esUtils.deleteObjectById(id);
        await ctx.service.esUtils.deleteSuggestObjectById(id);
      }
      return true;
    }
    catch(e){
      return false;
    }
  }

  async getWxMedalDataByRandom(limit){
    const app = this.ctx.app;
    const listData = await this.ctx.model.Artifacts.getWxMedalDataByRandom();
    const max = listData.length;
    if(max > 0){
        listData.forEach((element, index)=>{
            let profileImage = element.profileImage;
            if (element.storageTag == 2){
                element.profileImage = app.signatureUrl(app.imagePath + profileImage, "thumb_360_360");
            }
        });
    }
    return listData;
  }

  async findWxByCondition(id, role, userId) {

    const artifact = await this.ctx.model.Artifacts.findArtifactById(id);
    const app = this.ctx.app;

    if (artifact.storageTag == 2){
      artifact.profileImage = app.signatureUrl(app.imagePath + artifact.profileImage, "thumb_360_360");
    }

    for (let subElement of artifact.dataValues.artifact_assets){
      if (subElement.storageTag == 2){
        subElement.profileImage = app.signatureUrl(app.imagePath + subElement.profileImage, "thumb_1000");
      }
      else{
        subElement.profileImage = app.qiniuUrlPrefix + subElement.profileImage;
      }

      if (subElement.type == 2 && subElement.mediaFile != null){
        if (subElement.storageTag == 2){
          subElement.mediaFile = app.signatureUrl(app.pdfPath + subElement.mediaFile);
        }
        else{
          subElement.profileImage = app.qiniuUrlPrefix + subElement.mediaFile;
        }
      }
      else if (subElement.type == 3 && subElement.mediaFile != null){
        if (subElement.storageTag == 2){
          subElement.mediaFile = app.signatureUrl(app.rar_zipPath + subElement.mediaFile);
        }
        else{
          subElement.profileImage = app.qiniuUrlPrefix + subElement.mediaFile;
        }
      }
      else if (subElement.type == 4 && subElement.mediaFile != null){
        if (subElement.storageTag == 2){
          subElement.mediaFile = app.signatureUrl(app.videoPath + subElement.mediaFile);
        }
        else{
          subElement.profileImage = app.qiniuUrlPrefix + subElement.mediaFile;
        }
      }
      else if (subElement.type == 5 && subElement.mediaFile != null){
        let mediaFile = '';
        if (subElement.storageTag == 2){
          mediaFile = app.signatureUrl(app.othersPath + subElement.mediaFile);
        }
        else{
          mediaFile = app.qiniuUrlPrefix + subElement.mediaFile;
        }
        subElement.mediaFile = h5Util.getH5Url(artifact.Id, mediaFile, app);
      }
    }

    let ctx = this.ctx;
    if (userId != 0){
      if(role == 'vip'){
        //删除所有分数
        let topicUserId = new Array();
        artifact.topics.forEach((topic)=>{
          topicUserId.push(topic.userId);
        });
        if(!topicUserId.includes(userId)){
          artifact.artifact_scores.length = 0;
          artifact.artifact_scores.length = 1;
        }
      }
      else if (role == 'user'){
        let users = new Array();
        let teamworker = artifact.teamworker;
        if (teamworker){
          let teamArray = JSON.parse(teamworker);

          if (teamArray && (teamArray instanceof Array) && teamArray.length > 0){
            teamArray.forEach((tw)=>{
              users.push(tw.Id);
            });
          }
        }
        if (!(users.includes(userId) || (userId == artifact.user.Id))){
          artifact.artifact_scores.length = 0;
          artifact.artifact_scores.length = 1;
        }
      }
    }
    else{
      artifact.artifact_scores.length = 0;
      artifact.artifact_scores.length = 1;
    }


    return artifact;
  }
}

module.exports = Artifacts;
