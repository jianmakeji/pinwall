'use strict';

const Service = require('egg').Service;

class Terms extends Service {

  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Terms.findAndCountAll({
      offset,
      limit,
      order: [[ 'createAt', 'desc' ], [ 'Id', 'desc' ]],
    });
  }

  async find(Id) {
    const term = await this.ctx.model.Terms.findById(Id);
    if (!term) {
      this.ctx.throw(404, 'term not found');
    }
    return term;
  }

  async create(term) {
    if (term.name == '' || term.name == null){
      throw new Error('名称不能为空');
    }
    else{
      const termObj = await this.ctx.model.Terms.findAll({
        where:{
          name:term.name
        }
      });
      if (termObj.length == 0){
        return this.ctx.model.Terms.create(term);
      }
      else{
        return termObj[0];
      }
    }

  }

  async update({ Id, updates }) {
    const term = await this.ctx.model.Terms.findById(id);
    if (!term) {
      this.ctx.throw(404, 'term not found');
    }
    return term.update(updates);
  }

  async del(id) {
    const term = await this.ctx.model.Terms.findById(id);
    if (!term) {
      this.ctx.throw(404, 'term not found');
    }
    return term.destroy();
  }
}

module.exports = Terms;
