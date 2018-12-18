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
    jobTag: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
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
  }, {
    tableName: 'topics'
  });

  Topics.associate = function() {
    app.model.Topics.belongsTo(app.model.Users, {targetKey: 'Id', foreignKey: 'userId'});

    app.model.Topics.belongsToMany(app.model.Terms, {
        through: {
          model: app.model.TopicTerm,
          unique: false
        },
        foreignKey: 'topicId',
        constraints: false
    });

    app.model.Topics.belongsToMany(app.model.Artifacts, {
        through: {
          model: app.model.TopicArtifact,
          unique: false
        },
        foreignKey: 'topicId',
        constraints: false
    });
  };

  Topics.listTopics = async function ({ offset = 0, limit = 10, jobTag = 0, subLimit = 0,status = 0 }) {

    let condition = {
      offset,
      limit,
      order: [[ 'createAt', 'desc' ]],
      where:{

      },
      include:[
        {
          model: app.model.Users,
          attributes:['Id','email','fullname','nickname','avatarUrl']
        },{
          model: app.model.Artifacts,
          through:{
            attributes:['topicId','artifactId'],
          },
          attributes:['Id','profileImage']
        }
      ]
    };

    let countCondition = {
      where:{

      }
    };

    if (jobTag != 0){
      condition.where.jobTag = jobTag;
      countCondition.where.jobTag = jobTag;
    }

    if (status != -1){
      condition.where.status = status;
      countCondition.where.status = status;
    }

    let resultData = await this.findAll(condition);

    resultData.forEach((element, index)=>{
      const artifactSize = element.artifacts.length;
      element.user.gender = artifactSize;

      if (artifactSize > subLimit && subLimit != 0){
        let tempArray = element.artifacts.slice(0, subLimit);
        element.artifacts.length = 0;
        tempArray.forEach((artifact, index)=>{
          element.artifacts.push(artifact);
        });
      }
    });

    let result = {};
    result.rows = resultData;
    result.count = await this.count(countCondition);
    return result;
  }

  Topics.findTopicById = async function (Id) {
    const topic = await this.ctx.model.Topics.findById(Id);
    if (!topic) {
      throw new Error('topic not found');
    }
    return topic;
  }

  Topics.createTopic = async function (topic) {
    if (topic.name == '' || topic.name == null){
      throw new Error('名称不能为空');
    }
    else{
      return await this.create(topic);
    }
  }

  Topics.updateTopic = async function ({ Id, updates }) {
    const topic = await this.ctx.model.Topics.findById(id);
    if (!topic) {
      throw new Error('topic not found');
    }
    return await topic.update(updates);
  }

  Topics.delTopicById = async function (id) {
    const topic = await this.ctx.model.Topics.findById(id);
    if (!topic) {
      throw new Error('topic not found');
    }
    return await topic.destroy();
  }

  return Topics;
};
