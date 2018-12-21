'use strict'

const BaseController = require('../BaseController');

class SearchController extends BaseController{

  async searchByKeywords() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      keyword: ctx.query.keyword,
    };

    try{
      let hits = await ctx.app.elasticsearch.search({
        index: 'megacorp',
        body: {
          query: {
            term: {
              "about": 'albums'
            }
          }
        }
      }).then(function (resp) {
        console.log(resp.hits.hits);
          var hits = resp.hits.hits;

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
    for (let object of transferData){
      console.log(object.Id);
      await ctx.app.elasticsearch.create({
        index: 'pinwall',
        type: 'artifacts',
        id: object.Id,
        body: object
      });
    }

  }
}

module.exports = SearchController;
