'use strict';

const Controller = require('egg').Controller;

class ArtifactsController extends Controller {

  async transferArtifacts(){
    const ctx = this.ctx;
    try{
      await ctx.service.artifacts.transferArtifacts();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

  async transferArtifactsAssets(){
    const ctx = this.ctx;
    try{
      await ctx.service.artifacts.transferArtifactsAssets();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

  async transferArtifactsTerm(){
    const ctx = this.ctx;
    try{
      await ctx.service.artifacts.transferArtifactsTerm();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

  async updateHtml5Type(){
    const ctx = this.ctx;
    try{
      await ctx.service.artifacts.updateHtml5Type();
      ctx.body = '操作成功';
    }
    catch(e){
      ctx.body = e.message;
    }
  }

  async selectData(){
    const ctx = this.ctx;
    try{
      let data = await ctx.service.artifacts.selectData();
      ctx.body = data;
    }
    catch(e){
      ctx.body = e.message;
    }
  }

  async updateArtifactStorageTag(){
    const ctx = this.ctx;

    let result = await ctx.service.artifacts.updateArtifactStorageTag();

  }

  async updateArtifactAssetsStorageTag(){
    const ctx = this.ctx;

    let result = await ctx.service.artifacts.updateArtifactAssetsStorageTag();

  }

  async downloadQiniuFiles(){
    const ctx = this.ctx;

    let result = await ctx.service.artifacts.downloadQiniuFiles();
  }

  async testQiniuFileUploadToAliOSS(){
    const ctx = this.ctx;

    let result = ctx.service.artifacts.testQiniuFileUploadToAliOSS();
    ctx.body = '操作成功';
  }

  async testQiniuDetailFileUploadToAliOSS(){
    const ctx = this.ctx;

    let result = ctx.service.artifacts.testQiniuDetailFileUploadToAliOSS();
    ctx.body = '操作成功';
  }

  async checkPdfData(){
    const ctx = this.ctx;

    let result = await ctx.service.artifacts.checkPdfData();
    ctx.body = '操作成功';
  }


  async downloadQiniuDetailFiles(){
    const ctx = this.ctx;

    let result = await ctx.service.artifacts.downloadQiniuFiles();
  }

  async downloadQiniuDetailFiles2(){
    const ctx = this.ctx;

    let result = await ctx.service.artifacts.downloadQiniuFiles();
  }
}

module.exports = ArtifactsController;
