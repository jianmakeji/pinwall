/* jshint indent: 2 */

module.exports = app => {

  const {
    STRING,
    INTEGER,
    DATE,
    TEXT,
    BOOLEAN
  } = app.Sequelize;

  const Artifacts = app.model.define('artifacts', {
    Id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    name: {
      type: STRING(130),
      allowNull: false,
      defaultValue: ''
    },
    description: {
      type: TEXT,
      allowNull: true
    },
    profileImage: {
      type: STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    visible: {
      type: BOOLEAN,
      allowNull: true
    },
    jobTag: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    medalCount: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    likeCount: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    commentCount: {
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
      allowNull: true
    }
  }, {
    tableName: 'artifacts'
  });

  Artifacts.associate = function() {
    app.model.Artifacts.belongsTo(app.model.Users, {
      targetKey: 'Id',
      foreignKey: 'userId'
    });
    Artifacts.ArtifactAssets = app.model.Artifacts.hasMany(app.model.ArtifactAssets, {
      sourceKey: 'Id',
      foreignKey: 'artifactId'
    });
    Artifacts.ArtifactComments = app.model.Artifacts.hasMany(app.model.ArtifactComments, {
      sourceKey: 'Id',
      foreignKey: 'artifactId'
    });
    Artifacts.ArtifactScores = app.model.Artifacts.hasMany(app.model.ArtifactScores, {
      sourceKey: 'Id',
      foreignKey: 'artifactId'
    });
    Artifacts.ArtifactTerm = app.model.Artifacts.hasMany(app.model.ArtifactTerm, {
      sourceKey: 'Id',
      foreignKey: 'artifactId'
    });

    app.model.Artifacts.belongsToMany(app.model.Topics, {
      through: {
        model: app.model.TopicArtifact,
        unique: false,
        scope: {
          taggable: 'artifacts'
        }
      },
      foreignKey: 'artifactId',
      constraints: false
    });

    app.model.Artifacts.belongsToMany(app.model.Terms, {
      through: {
        model: app.model.ArtifactTerm,
        unique: false,
        scope: {
          taggable: 'artifacts'
        }
      },
      foreignKey: 'artifactId',
      constraints: false
    });
  };

  Artifacts.listArtifacts = async function({
    offset = 0,
    limit = 10,
    visible = 0,
    jobTag = 0
  }) {

    let condition = {
      offset,
      limit,
      order: [
        ['createAt', 'desc']
      ],
      include: [{
        model: app.model.ArtifactAssets
      }],
    };

    if (jobTag != 0) {
      condition.where.jobTag = jobTag;
    }
    condition.where.visible = visible;

    return await this.findAndCountAll(condition);
  }

  Artifacts.findArtifactById = async function(id) {
    const artifact = await this.findById(id, {
      include: [{
        model: app.model.ArtifactAssets
      }]
    });
    if (!artifact) {
      this.ctx.throw(404, 'artifact not found');
    }
    return artifact;
  }

  Artifacts.createArtifact = async function(artifact) {
    return this.create(artifact, {
      include: [
        Artifacts.ArtifactAssets
      ]
    });
  }

  Artifacts.updateArtifact = async function({
    id,
    updates
  }) {
    const artifact = await this.findById(id);
    if (!artifact) {
      this.ctx.throw(404, 'artifact not found');
    }
    return artifact.update(updates);
  }

  Artifacts.delArtifactById = async function(id) {
    const artifact = await this.findById(id);
    if (!artifact) {
      this.ctx.throw(404, 'artifact not found');
    }
    return artifact.destroy();
  }

  Artifacts.addCommnet = async function(id) {
    await this.update({
      commentCount: app.Sequelize.fn('1 + abs', this.app.Sequelize.col('commentCount'))
    }, {
      where: {
        Id: id
      }
    });
  }

  Artifacts.addMedal = async function(id) {
    await this.update({
      medalCount: app.Sequelize.fn('1 + abs', this.app.Sequelize.col('medalCount'))
    }, {
      where: {
        Id: id
      }
    });
  }

  Artifacts.addlike = async function(id) {
    await this.update({
      likeCount: app.Sequelize.fn('1 + abs', this.app.Sequelize.col('likeCount'))
    }, {
      where: {
        Id: id
      }
    });
  }

  Artifacts.getMedalDataByRandom = async function(){
    return this.findAll({
      where:{
        medalCount:{
          [app.Sequelize.Op.gt]:0
        },
        visible:0
      },
      attributes:['Id','userId','name','profileImage']
    });
  }

  return Artifacts;
};
