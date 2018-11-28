/* jshint indent: 2 */

module.exports = app => {

  const { STRING, INTEGER, DATE, TEXT,BOOLEAN } = app.Sequelize;

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
    createAt: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateAt: {
      type: DATE,
      allowNull: true
    }
  });

  Artifacts.associate = function() {
    app.model.Artifacts.belongsTo(app.model.Users, {targetKey: 'Id', foreignKey: 'userId'});
    app.model.Artifacts.hasMany(app.model.ArtifactAssets,{sourceKey:'Id',foreignKey: 'artifactId'});
    app.model.Artifacts.hasMany(app.model.ArtifactComments,{sourceKey:'Id',foreignKey: 'artifactId'});
    app.model.Artifacts.hasMany(app.model.ArtifactScores,{sourceKey:'Id',foreignKey: 'artifactId'});
    app.model.Artifacts.hasMany(app.model.ArtifactTerm,{sourceKey:'Id',foreignKey: 'artifactId'});

    Artifacts.belongsToMany(Topics, {
        through: {
          model: TopicArtifact,
          unique: false,
          scope: {
            taggable: 'artifacts'
          }
        },
        foreignKey: 'artifactId',
        constraints: false
    });
  };

  Artifacts.findByIdWithTeacher = async function(id, teacherId) {
    return await this.findOne({
      where: { id, teacherId: teacherId },
    });
  };

  return Artifacts;
};
