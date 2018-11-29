/* jshint indent: 2 */

module.exports  = app => {

  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const Topics = app.model.define('topics', {
    Id: {
      type: INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: INTEGER(11),
      allowNull: true
    },
    name: {
      type: STRING(64),
      allowNull: true
    },
    description: {
      type: TEXT,
      allowNull: true
    },
    status: {
      type: INTEGER(6),
      allowNull: true
    },
    createAt: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateAt: {
      type: DATE,
      allowNull: true,
      defaultValue: '0000-00-00 00:00:00'
    }
  });

  Topics.associate = function() {
    app.model.Topics.belongsTo(app.model.Users, {targetKey: 'Id', foreignKey: 'userId'});

    app.model.Topics.belongsToMany(app.model.Terms, {
        through: {
          model: app.model.TopicTerm,
          unique: false,
          scope: {
            taggable: 'topicTerms'
          }
        },
        foreignKey: 'topicId',
        constraints: false
    });

    app.model.Topics.belongsToMany(app.model.Artifacts, {
        through: {
          model: app.model.TopicArtifact,
          unique: false,
          scope: {
            taggable: 'topicsArtifact'
          }
        },
        foreignKey: 'topicId',
        constraints: false
    });
  };

  Topics.listTopics = async function ({ offset = 0, limit = 10 }) {
    return this.ctx.model.Topics.findAndCountAll({
      offset,
      limit,
      order: [[ 'createAt', 'desc' ], [ 'Id', 'desc' ]],
    });
  }

  Topics.findTopicById = async function (Id) {
    const topic = await this.ctx.model.Topics.findById(Id);
    if (!topic) {
      this.ctx.throw(404, 'topic not found');
    }
    return topic;
  }

  Topics.createTopic = async function (topic) {
    if (topic.name == '' || topic.name == null){
      throw new Error('名称不能为空');
    }
    else{
      return this.ctx.model.Topics.create(topic);
    }
  }

  Topics.updateTopic = async function ({ Id, updates }) {
    const topic = await this.ctx.model.Topics.findById(id);
    if (!topic) {
      this.ctx.throw(404, 'topic not found');
    }
    return topic.update(updates);
  }

  Topics.delTopicById = async function (id) {
    const topic = await this.ctx.model.Topics.findById(id);
    if (!topic) {
      this.ctx.throw(404, 'topic not found');
    }
    return topic.destroy();
  }

  return Topics;
};
