'use strict'

const BaseController = require('../BaseController');

class SearchController extends BaseController{

  async searchByKeywords() {
    const ctx = this.ctx;

    const limit = ctx.helper.parseInt(ctx.query.limit);
    const offset = ctx.helper.parseInt(ctx.query.offset);
    const keyword = ctx.query.keyword;

    try{
      let hits = await ctx.app.elasticsearch.search({
        index: ctx.app.es_index,
        body: {
          from : offset,
          size : limit,
          query: {
            query_string: {
              query: keyword
            }
          }
        }
      }).then(function (resp) {
        console.log(resp.hits.hits);
          var hits = resp.hits;

          return hits;
      }, function (err) {
          console.trace(err.message);
      });

      super.success(hits);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async transferData(){
    const ctx = this.ctx;
    let transferData = await ctx.service.artifacts.transferArtifacts();
    console.log(transferData.length);
    await await ctx.service.esUtils.batchCreateObject(transferData);
    console.log('end...');
  }
}

module.exports = SearchController;
