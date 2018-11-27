'use strict';

const Controller = require('egg').Controller;
const { STS } = require('ali-oss');
const fs = require('fs');
const path = require('path');

class AliOSSController extends Controller {

  async getSTSSignature() {

    const ctx = this.ctx;
    const aliConfigObj = ctx.app.aliConfig();

    const fileType = ctx.params.fileType;
    let dir = '';
    if (fileType == 1){
      dir = ctx.app.courseImagePath;
    }
    else if (fileType == 2){
      dir = ctx.app.courseVideoPath;
    }
    else if (fileType == 3){
      dir = ctx.app.articleImagePath;
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
      ctx.body = ctx.app.failure(err);
    });
  }

  async getUrlSignature(){
    const ctx = this.ctx;
    ctx.body = ctx.app.signatureUrl(ctx.query.objectPath);
  }
}

module.exports = AliOSSController;
