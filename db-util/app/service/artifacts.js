'use strict';

const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const request = require('request');
const PassThrough = require('stream').PassThrough;
let OSS = require('ali-oss');

class Artifacts extends Service {

  async transferArtifacts() {
    const ctx = this.ctx;
    const client1 = ctx.app.mysql.get('db1');
    const client2 = ctx.app.mysql.get('db2');

    const artifacts = await client1.select("artifacts");

    for (const artifact of artifacts) {
      console.log(artifact.id);
      let data = {
        Id: artifact.id,
        userId:artifact.user_id,
        name: artifact.name,
        description:artifact.description,
        profileImage:artifact.profile_image,
        jobTag:1,
        createAt:artifact.created_at,
        updateAt:artifact.updated_at,
      };

      if (artifact.visible == 't'){
        data.visible = 0;
      }
      else{
        data.visible = 1;
      }

      const resultList1 = await client1.query('select ars.* from artifact_scores ars, users u,user_role ur where ars.scorer_id = u.id and u.id=ur.user_id and artifact_id=? and ur.role_id = 1', [artifact.id]);
      for (const ar of resultList1){
        let likeData = {
          tag:2,
          userId:ar.scorer_id,
          artifactId:ar.artifact_id,
        };
        await client2.insert("artifact_medal_like",likeData);
      }
      const resultCount1 = await client1.query('select count(*)  as count from artifact_scores ars, users u,user_role ur where ars.scorer_id = u.id and u.id=ur.user_id and artifact_id=? and ur.role_id = 1', [artifact.id]);
      data.likeCount = resultCount1[0].count;

      const resultList2 = await client1.query('select ars.* from artifact_scores ars, users u,user_role ur where ars.scorer_id = u.id and u.id=ur.user_id and artifact_id=? and ur.role_id > 1', [artifact.id]);
      for (const ar of resultList2){
        let likeData = {
          tag:1,
          userId:ar.scorer_id,
          artifactId:ar.artifact_id,
        };
        await client2.insert("artifact_medal_like",likeData);
      }

      const resultCount2 = await client1.query('select count(*)  as count from artifact_scores ars, users u,user_role ur where ars.scorer_id = u.id and u.id=ur.user_id and artifact_id=? and ur.role_id > 1', [artifact.id]);

      data.medalCount = resultCount2[0].count;

      const resultList3 =  await client1.query('select acs.* from artifact_comments acs where artifact_id=?',[artifact.id]);
      for (const ar of resultList3){
        let commentData = {
          content:ar.content,
          commenterId:ar.commenter_id,
          artifactId:ar.artifact_id,
          commentAt:ar.commented_at
        };

        if (ar.visible == 't'){
          commentData.visible = 0;
        }
        else{
          commentData.visible = 1;
        }

        await client2.insert("artifact_comments",commentData);
      }

      const resultCount3 = await client1.query('select count(*) as count from artifact_comments acs, users u where acs.commenter_id = u.id and artifact_id=?', [artifact.id]);

      data.commentCount = resultCount3[0].count;
      await client2.insert("artifacts", data);
    }
  }

  async updateHtml5Type(){
    const ctx = this.ctx;
    const client1 = ctx.app.mysql.get('db1');
    const client2 = ctx.app.mysql.get('db2');

    const artifact_assets = await client1.query("select artifact_id,pos from artifact_assets where type = 256 ");
    console.log(artifact_assets.length);
    console.log(artifact_assets[0].pos);
    console.log(artifact_assets[0].artifact_id);
    for(let i = 0; i < artifact_assets.length; i++){
      console.log(artifact_assets[i].artifact_id+"  "+artifact_assets[i].pos);
      const result = await client2.query('update artifact_assets set type = 5 where artifactId = ? and position = ?', [artifact_assets[i].artifact_id, artifact_assets[i].pos]);
      console.log('---------------');
      console.log(result);
    }

  }

  async transferArtifactsAssets() {
    const ctx = this.ctx;
    const client1 = ctx.app.mysql.get('db1');
    const client2 = ctx.app.mysql.get('db2');

    const artifact_assets = await client1.query("select * from artifact_assets where artifact_id > 23000 and artifact_id <= 30000 ");
    let i = 0;
    for (let artifact_asset of artifact_assets) {
      console.log(i++);

      let data = {
        artifactId:artifact_asset.artifact_id,
        position:artifact_asset.pos,
        name:artifact_asset.name,
        filename:artifact_asset.filename,
        imagename:artifact_asset.profile_filename,
        description:artifact_asset.description,
      };
      if (artifact_asset.type == 128){
        data.type = 2;
      }
      else if (artifact_asset.type == 32){
        data.type = 3;
      }
      else if (artifact_asset.type == 4){
        data.type = 4;
      }
      else if (artifact_asset.type == 256){
        data.type = 5;
      }
      else{
        data.type = 1;
      }

      if(artifact_asset.profile_image != '' && artifact_asset.profile_image != 'http://pinwall.fzcloud.design-engine.org/')
      {
        data.profileImage = artifact_asset.profile_image;
      }

      if(artifact_asset.media_file != '' && artifact_asset.media_file != 'http://pinwall.fzcloud.design-engine.org/')
      {
        data.mediaFile = artifact_asset.media_file;
      }

      if(artifact_asset.view_url != '' && artifact_asset.view_url != 'http://pinwall.fzcloud.design-engine.org/')
      {
        data.viewUrl = artifact_asset.view_url;
      }

      await client2.insert("artifact_assets", data);
    }
  }

  async transferArtifactsTerm() {
    const ctx = this.ctx;
    const client1 = ctx.app.mysql.get('db1');
    const client2 = ctx.app.mysql.get('db2');

    const artifact_terms = await client1.select("artifact_term");

    for (const artifact_term of artifact_terms) {
      let data = {
        artifactId:artifact_term.artifact_id,
        termId:artifact_term.term_id,
      };

      await client2.insert("artifact_term", data);
    }
  }

  async selectData(){
    const ctx = this.ctx;
    const client2 = ctx.app.mysql.get('db2');
    const artifacts = await client2.query("select * from artifacts ");
    let data = new Array();
    for (const artifact of artifacts){
      let topicsArtifact = await client2.query("select * from topic_artifact where artifactId = ? ", artifact.Id);

      if (topicsArtifact.length == 0){
        data.push(artifact.Id);
      }
    }
    return data;
  }

  async updateArtifactStorageTag(){
    const ctx = this.ctx;
    const client = ctx.app.mysql.get('db');
    const artifacts = await client.query("select * from artifacts ");
    for (const artifact of artifacts){
      console.log(artifact.Id);
      if(artifact.profileImage.indexOf('pinwall.fzcloud') != -1){
        let imageUrl = artifact.profileImage.replace('http://pinwall.fzcloud.design-engine.org','');
        const result = await client.query('update artifacts set profileImage = ?,storageTag = ? where Id = ?', [imageUrl, 1, artifact.Id]);
      }
      else{
        const result = await client.query('update artifacts set storageTag = ? where Id = ?', [2, artifact.Id]);
      }
    }
  }

  async updateArtifactAssetsStorageTag(){
    const ctx = this.ctx;
    const client = ctx.app.mysql.get('db');
    const artifacts = await client.query("select * from artifact_assets where Id > 150000 and Id <= 200000 ");
    //console.log(artifacts[0].mediaFile);

    for (const artifact of artifacts){
      console.log(artifact.Id);
      if(artifact.profileImage.indexOf('pinwall.fzcloud') != -1){
        let imageUrl = artifact.profileImage.replace('http://pinwall.fzcloud.design-engine.org','');
        let mediaFile = null;
        if(artifact.mediaFile != null && artifact.mediaFile != '' && artifact.mediaFile.indexOf('pinwall.fzcloud') != -1){
          mediaFile = artifact.mediaFile.replace('http://pinwall.fzcloud.design-engine.org','');
        }
        else{
          mediaFile = artifact.mediaFile;
        }

        let viewUrl = null;
        if(artifact.viewUrl != null && artifact.viewUrl != '' && artifact.viewUrl.indexOf('pinwall.fzcloud') != -1){
          viewUrl = artifact.viewUrl.replace('http://pinwall.fzcloud.design-engine.org','');
        }
        else{
          viewUrl = artifact.viewUrl;
        }

        const result = await client.query('update artifact_assets set profileImage = ?,mediaFile = ?,viewUrl = ?, storageTag = ? where Id = ?', [imageUrl, mediaFile, viewUrl, 1, artifact.Id]);
      }
      else if(artifact.profileImage.indexOf('design.hnu.edu.cn') != -1){
        let imageUrl = artifact.profileImage.replace('http://design.hnu.edu.cn','');
        const result = await client.query('update artifact_assets set profileImage = ?, storageTag = ? where Id = ?', [imageUrl,3, artifact.Id]);
      }
      else{
        const result = await client.query('update artifact_assets set storageTag = ? where Id = ?', [2, artifact.Id]);
      }
    }
  }

  async downloadQiniuFiles(){
    const ctx = this.ctx;
    const client = ctx.app.mysql.get('db');
    const artifacts = await client.query("select * from artifacts where storageTag=1 and Id < 600");
    for (const artifact of artifacts){
      console.log(artifact.Id +' | '+ artifact.profileImage);
      let extname = path.extname(artifact.profileImage);
      let filename = ctx.helper.randomString(20) + extname;
      let stream = fs.createWriteStream('F:\\qiniu\\artifacts\\'+filename);
      let uri = 'https://qiniu.pinwall.cn' + artifact.profileImage;
      request(uri).pipe(stream).on('close', function(){
        client.query('update artifacts set profileImage = ? where Id = ?', [filename, artifact.Id]);
      });

    }
  }

  async testQiniuFileUploadToAliOSS(){
    const ctx = this.ctx;
    const client = ctx.app.mysql.get('db');
    const artifacts = await client.query("select * from artifacts where storageTag=1 and Id >= 20000");

    const config = ctx.helper.aliConfig();
    let ossClient = new OSS({
      region: config.region,
      accessKeyId: config.AccessKeyId,
      accessKeySecret: config.AccessKeySecret,
      bucket: config.bucket,
    });

    for (const artifact of artifacts){
      let fileType = artifact.type;
        console.log(artifact.Id +' | '+ artifact.profileImage);
        let extname = path.extname(artifact.profileImage);
        let filename = ctx.helper.randomString(20) + extname;
        let objectName = ctx.helper.imagePath  + filename;
        let uri = 'https://qiniu.pinwall.cn' + artifact.profileImage;
        let stream = request(uri).on('error', err => {
            console.log('错误：'+artifact.Id +' | '+ err);
        }).pipe(PassThrough());
        try {
          console.log(objectName);
          let result = await ossClient.putStream(objectName, stream);
          client.query('update artifacts set profileImage = ? where Id = ?', [filename, artifact.Id]);
          console.log(result);
        } catch (e) {
          console.log(e)
        }
        console.log('====================================');
      }
  }

  async downloadQiniuDetailFiles(){
    const ctx = this.ctx;
    const client = ctx.app.mysql.get('db');
    const artifact_assets = await client.query("select * from artifact_assets where storageTag=1 and Id > 0 and Id < 1000");
    for (const artifact_asset of artifact_assets){
      let fileType = artifact_asset.type;
      let dir = '';
      if (fileType == 1){
        dir = 'F:\\qiniu\\artifact_assets\\images\\';
        let extname = path.extname(artifact.profileImage);
        let filename = ctx.helper.randomString(20) + extname;
        let stream = fs.createWriteStream(dir + filename);
        let uri = 'https://qiniu.pinwall.cn' + artifact.profileImage;
        request(uri).pipe(stream).on('close', function(){
          client.query('update artifact_assets set profileImage = ? where Id = ?', [filename, artifact.Id]);

        });
      }
      else if (fileType == 2){
        dir = 'F:\\qiniu\\artifact_assets\\pdf\\';
        let extname = path.extname(artifact.profileImage);
        let filename = ctx.helper.randomString(20) + extname;
        let stream = fs.createWriteStream('F:\\qiniu\\artifact_assets\\images\\' + filename);
        let uri = 'https://qiniu.pinwall.cn' + artifact.profileImage;
        request(uri).pipe(stream).on('close', function(){
          let pdf_extname = path.extname(artifact.mediaFile);
          let pdf_filename = ctx.helper.randomString(20) + pdf_extname;
          let pdf_stream = fs.createWriteStream(dir + pdf_filename);
          let pdf_uri = 'https://qiniu.pinwall.cn' + artifact.mediaFile;
          request(pdf_uri).pipe(pdf_stream).on('close', function(){
            client.query('update artifact_assets set profileImage = ?,mediaFile = ?,viewUrl =? where Id = ?', [filename,pdf_filename,pdf_filename,artifact.Id]);
          });
        });
      }
      else if (fileType == 3){
        dir = 'F:\\qiniu\\artifact_assets\\rar\\';
        let extname = path.extname(artifact.profileImage);
        let filename = ctx.helper.randomString(20) + extname;
        let stream = fs.createWriteStream('F:\\qiniu\\artifact_assets\\images\\' + filename);
        let uri = 'https://qiniu.pinwall.cn' + artifact.profileImage;
        request(uri).pipe(stream).on('close', function(){
          let rar_extname = path.extname(artifact.mediaFile);
          let rar_filename = ctx.helper.randomString(20) + rar_extname;
          let rar_stream = fs.createWriteStream(dir + rar_filename);
          let rar_uri = 'https://qiniu.pinwall.cn' + artifact.mediaFile;
          request(rar_uri).pipe(rar_stream).on('close', function(){
            client.query('update artifact_assets set profileImage = ?,mediaFile = ?,viewUrl =? where Id = ?', [filename,rar_filename,rar_filename,artifact.Id]);
          });
        });
      }
      else if (fileType == 4){
        dir = 'F:\\qiniu\\artifact_assets\\video\\';
        let extname = path.extname(artifact.profileImage);
        let filename = ctx.helper.randomString(20) + extname;
        let stream = fs.createWriteStream('F:\\qiniu\\artifact_assets\\images\\' + filename);
        let uri = 'https://qiniu.pinwall.cn' + artifact.profileImage;
        request(uri).pipe(stream).on('close', function(){
          let video_extname = path.extname(artifact.mediaFile);
          let video_filename = ctx.helper.randomString(20) + video_extname;
          let video_stream = fs.createWriteStream(dir + video_filename);
          let video_uri = 'https://qiniu.pinwall.cn' + artifact.mediaFile;
          request(video_uri).pipe(video_stream).on('close', function(){
            client.query('update artifact_assets set profileImage = ?,mediaFile = ?,viewUrl =? where Id = ?', [filename,video_filename,video_filename,artifact.Id]);
          });
        });
      }
    }
  }

  async testQiniuDetailFileUploadToAliOSS(){
    const ctx = this.ctx;
    const client = ctx.app.mysql.get('db');
    const artifact_assets = await client.query("select * from artifact_assets where type=3 and Id in (103265)");

    const config = ctx.helper.aliConfig();
    let ossClient = new OSS({
      region: config.region,
      accessKeyId: config.AccessKeyId,
      accessKeySecret: config.AccessKeySecret,
      bucket: config.bucket,
    });

    for (let artifact_asset of artifact_assets){
      let fileType = artifact_asset.type;
      console.log('ID:'+artifact_asset.Id);
      if (fileType == 1){
        let extname = path.extname(artifact_asset.profileImage);
        let filename = ctx.helper.randomString(20) + extname;
        let objectName = ctx.helper.imagePath  + filename;
        let uri = 'https://qiniu.pinwall.cn' + artifact_asset.profileImage;
        //let uri = artifact_asset.profileImage;
        let stream = request(uri).on('error', err => {
            console.log('错误：'+artifact_asset.Id +' | '+ err);
        }).pipe(PassThrough());

        try {
          let result = await ossClient.putStream(objectName, stream);
          client.query('update artifact_assets set profileImage = ? where Id = ?', [filename, artifact_asset.Id]);
        } catch (e) {
          console.log(e)
        }
      }
      else if (fileType == 2){
        let extname = path.extname(artifact_asset.profileImage);
        let filename = ctx.helper.randomString(20) + extname;
        let uri = 'https://qiniu.pinwall.cn' + artifact_asset.profileImage;
        let objectName = ctx.helper.imagePath  + filename;
        let stream = request(uri).on('error', err => {
            console.log('错误：'+artifact_asset.Id +' | '+ err);
        }).pipe(PassThrough());
        try {
          let result = await ossClient.putStream(objectName, stream);
          let pdf_extname = path.extname(artifact_asset.mediaFile);
          let pdf_filename = ctx.helper.randomString(20) + pdf_extname;
          let pdf_objectName = ctx.helper.pdfPath + pdf_filename;
          let pdf_uri = 'https://qiniu.pinwall.cn' + artifact_asset.mediaFile;
          let pdfStream = request(pdf_uri).on('error', err => {
              console.log('错误：'+artifact_asset.Id +' | '+ err);
          }).pipe(PassThrough());
          await ossClient.putStream(pdf_objectName, pdfStream,{
            timeout:240000
          });
          client.query('update artifact_assets set profileImage = ?,mediaFile = ?,viewUrl =? where Id = ?', [filename,pdf_filename,pdf_filename,artifact_asset.Id]);

        } catch (e) {
          console.log(e)
        }
      }
      else if (fileType == 3){
        let extname = path.extname(artifact_asset.profileImage);
        let filename = ctx.helper.randomString(20) + extname;
        let uri = 'https://qiniu.pinwall.cn' + artifact_asset.profileImage;
        let objectName = ctx.helper.imagePath  + filename;
        let stream = request(uri).on('error', err => {
            console.log('错误：'+artifact_asset.Id +' | '+ err);
        }).pipe(PassThrough());
        try {
          let result = await ossClient.putStream(objectName, stream);
          let rar_extname = path.extname(artifact_asset.mediaFile);
          let rar_filename = ctx.helper.randomString(20) + rar_extname;
          let rar_objectName = ctx.helper.rar_zipPath + rar_filename;
          let rar_uri = 'https://qiniu.pinwall.cn' + artifact_asset.mediaFile;
          let rarStream = request(rar_uri).on('error', err => {
              console.log('错误：'+artifact_asset.Id +' | '+ err);
          }).pipe(PassThrough());
          await ossClient.putStream(rar_objectName, rarStream,{
            timeout:1720000
          });
          client.query('update artifact_assets set profileImage = ?,mediaFile = ?,viewUrl =? where Id = ?', [filename,rar_filename,rar_filename,artifact_asset.Id]);
        } catch (e) {
          console.log(e)
        }
      }
      else if (fileType == 4){
        // let extname = path.extname(artifact_asset.profileImage);
        // let filename = ctx.helper.randomString(20) + extname;
        // let uri = 'https://qiniu.pinwall.cn' + artifact_asset.profileImage;
        // let objectName = ctx.helper.imagePath  + filename;
        // let stream = request(uri).on('error', err => {
        //     console.log('错误：'+artifact_asset.Id +' | '+ err);
        // }).pipe(PassThrough());
        try {
          //let result = await ossClient.putStream(objectName, stream);
          let video_extname = path.extname(artifact_asset.mediaFile);
          let video_filename = ctx.helper.randomString(20) + video_extname;
          let video_objectName = ctx.helper.videoPath + video_filename;
          //let video_uri = 'https://qiniu.pinwall.cn' + artifact_asset.mediaFile;
          let videoStream = request(artifact_asset.mediaFile).on('error', err => {
              console.log('错误：'+artifact_asset.Id +' | '+ err);
          }).pipe(PassThrough());
          await ossClient.putStream(video_objectName, videoStream,{
            timeout:2720000
          });
          client.query('update artifact_assets set mediaFile = ?,viewUrl =? where Id = ?', [video_filename,video_filename,artifact_asset.Id]);
        } catch (e) {
          console.log(e)
        }

      }
    }
  }

  async downloadQiniuDetailFiles2(){
    const ctx = this.ctx;
    const client = ctx.app.mysql.get('db');
    const artifact_assets = await client.query("select * from artifact_assets where storageTag=3");
    let dir = 'F:\\qiniu\\artifact_assets\\video\\';
    let video_extname = path.extname(artifact.mediaFile);
    let video_filename = ctx.helper.randomString(20) + video_extname;
    let video_stream = fs.createWriteStream(dir + video_filename);
    let video_uri = artifact.mediaFile;
    request(video_uri).pipe(video_stream).on('close', function(){
      client.query('update artifact_assets set profileImage = ?,mediaFile = ?,viewUrl =? where Id = ?', ['',video_filename,video_filename,artifact.Id]);
    });
  }

  async checkPdfData(){
    const ctx = this.ctx;
    const client = ctx.app.mysql.get('db');
    const artifact_assets = await client.query("select * from artifact_assets where storageTag=1 and type=3");
    console.log(artifact_assets);
    let count = 0;
    for (let assets of artifact_assets){
      count = count + 1;
      if(assets.mediaFile.endsWith('.pdf')){
        client.query('update artifact_assets set type = ? where Id = ?', [2,assets.Id]);
      }
    }
    console.log(count);
  }
}

module.exports = Artifacts;
