const Subscription = require('egg').Subscription;
const fs = require('fs');
const path = require('path');

class UpdateElasticsearch extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '10s', // 1m 分钟间隔
      type: 'worker', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {

    const ctx = this.ctx;
    const filePath =  path.resolve(this.app.config.static.dir,'project_config');

    if(!fs.existsSync(filePath)){
      fs.mkdirSync(filePath);
    }
    const filename = path.resolve(filePath,'time.properties');

    let fd;
    const thisSyncTime = new Date();
    let lastSyncTime = new Date(fs.readFileSync(filename,'utf-8'));

    try{
      let esArray = await ctx.model.Artifacts.findArtifactByTime(lastSyncTime,0);
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
        ctx.getLogger('elasticLogger').info(artiObj.Id+"\n");
      }

    }
    catch(e){
      this.ctx.getLogger('elasticLogger').info(e.message+"\n");
    }

    //更新数据到es
    try{
      let esArray = await ctx.model.Artifacts.findArtifactByTime(lastSyncTime,1);
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
        ctx.getLogger('elasticLogger').info(artiObj.Id+"\n");
      }
    }
    catch(e){
      ctx.getLogger('elasticLogger').info("ID:"+artiObj.Id+": "+e.message+"\n");
    }

    try {
      fd = fs.openSync(filename, 'w');
      fs.appendFileSync(fd, thisSyncTime +' \n', 'utf8');
    } catch (err) {
      /* Handle the error */
    } finally {
      if (fd !== undefined)
        fs.closeSync(fd);
    }
  }
}

module.exports = UpdateElasticsearch;
