'use strict';

const BaseController = require('../BaseController');
const { STS } = require('ali-oss');
const fs = require('fs');
const path = require('path');
const fileUtil = require('../../utils/fileUtils');

class AliOSSController extends BaseController {

  async getSTSSignature() {

    const ctx = this.ctx;
    const aliConfigObj = ctx.app.aliConfig();

    const fileType = ctx.params.fileType;

    let dir = '';
    if (fileType == 1){
      dir = ctx.app.imagePath;
    }
    else if (fileType == 2){
      dir = ctx.app.pdfPath;
    }
    else if (fileType == 3){
      dir = ctx.app.rar_zipPath;
    }
    else if (fileType == 4){
      dir = ctx.app.videoPath;
    }
    else{
      dir = ctx.app.othersPath;
    }

    let host = "http://" + aliConfigObj.bucket + "." + aliConfigObj.endpoint;

    var policy = {
      "Version": "1",
      "Statement": [
        {
            "Effect": "Allow",
            "Action": [
            "oss:GetObject",
            "oss:PutObject"
            ],
            "Resource": [
            "acs:oss:*:*:pinwall",
            "acs:oss:*:*:pinwall/*"
            ]
        }
      ]
  };

    let roleSessionName = 'jianma-001';

    const client = new STS({
      accessKeyId: aliConfigObj.AccessKeyId,
      accessKeySecret: aliConfigObj.AccessKeySecret
    });

    await client.assumeRole(aliConfigObj.RoleArn, policy, aliConfigObj.TokenExpireTime, roleSessionName).then((result) => {
      result.credentials.host = host;
      result.credentials.dir = dir;
      ctx.body = result;
    }).catch((err) => {
      super.failure(err);
    });
  }

  async getUrlSignature(){
    const ctx = this.ctx;

    ctx.body = ctx.app.signatureUrl(ctx.query.objectPath,ctx.query.thumbName);
  }

  async deleteAliossFile(){
    const ctx = this.ctx;
    const fileType = ctx.params.fileType;

    let dir = '';
    if (fileType == 1){
      dir = ctx.app.imagePath;
    }
    else if (fileType == 2){
      dir = ctx.app.pdfPath;
    }
    else if (fileType == 3){
      dir = ctx.app.rar_zipPath;
    }
    else if (fileType == 4){
      dir = ctx.app.videoPath;
    }
    else{
      dir = ctx.app.othersPath;
    }

    try{
      ctx.app.deleteOssObject(dir + ctx.query.filename);
      super.success('删除成功!');
    }
    catch(e){
      super.failure(e);
    }

  }

  async deleteH5Path(){
    const app = this.ctx.app;
    const artifactId = this.ctx.params.artifactId;
    let h5Dir = path.join(app.localH5Path, artifactId + path.sep);

    let pathExist = fs.existsSync(h5Dir);

    if (pathExist){
      fileUtil.delDir(h5Dir);
    }
    super.success('操作成功!');
  }
}

module.exports = AliOSSController;
