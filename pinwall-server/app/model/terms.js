/* jshint indent: 2 */

module.exports  = app => {

  const { STRING, INTEGER  } = app.Sequelize;

  const Terms = app.model.define('terms', {
    Id: {
      type: INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: STRING(30),
      allowNull: true
    }
  });

  Terms.associate = function() {

    app.model.Terms.belongsToMany(app.model.Topics, {
        through: {
          model: app.model.TopicTerm,
          unique: false,
          scope: {
            taggable: 'terms'
          }
        },
        foreignKey: 'termId',
        constraints: false
    });

  };

  Terms.listTerms = async function ({ offset = 0, limit = 10 }) {
    return this.ctx.model.Terms.findAndCountAll({
      offset,
      limit,
      order: [[ 'createAt', 'desc' ], [ 'Id', 'desc' ]],
    });
  }

  Terms.findTermById = async function (Id) {
    const term = await this.ctx.model.Terms.findById(Id);
    if (!term) {
      this.ctx.throw(404, 'term not found');
    }
    return term;
  }

  Terms.createTerm = async function (term){
    const termObj = await this.findOne({where:{
      name:term.name
    }});
    if (!termObj){
       return this.create(term);
    }
    else{
       return termObj;
    }
  }

  Terms.updateTerm = async function ({ Id, updates }) {
    const term = await this.ctx.model.Terms.findById(id);
    if (!term) {
      this.ctx.throw(404, 'term not found');
    }
    return term.update(updates);
  }

  Terms.delTermById = async function (id) {
    const term = await this.ctx.model.Terms.findById(id);
    if (!term) {
      this.ctx.throw(404, 'term not found');
    }
    return term.destroy();
  }

  return Terms;
};
