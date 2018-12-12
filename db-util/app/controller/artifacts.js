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
}

module.exports = ArtifactsController;
