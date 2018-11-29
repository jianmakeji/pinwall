/* jshint indent: 2 */

module.exports = app => {

  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const ArtifactAssets = app.model.define('artifact_assets', {
    Id: {
      type:INTEGER,
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    artifactId: {
      type:INTEGER,
      allowNull: false,
    },
    position: {
      type:INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    name: {
      type:STRING(130),
      allowNull: true
    },
    filename: {
      type:STRING(20),
      allowNull: true
    },
    description: {
      type:TEXT,
      allowNull: true
    },
    type: {
      type:INTEGER,
      allowNull: true
    },
    profileImage: {
      type:STRING(20),
      allowNull: true
    },
    mediaFile: {
      type:STRING(20),
      allowNull: true
    },
    viewUrl: {
      type:STRING(130),
      allowNull: true
    }
  }, {
    tableName: 'artifact_assets'
  });

  ArtifactAssets.associate = function() {
      app.model.ArtifactAssets.belongsTo(app.model.Artifacts, {targetKey: 'Id', foreignKey: 'artifactId'});
  }

  ArtifactAssets.createAssets = async function (artifactAssets) {
    return this.create(artifactAssets);
  }

  ArtifactAssets.delAssetsByArtifactId = async function (artifactId) {

    return artifact.destroy({
      where:{
          artifactId:artifactId,
      },
    });
  }

  return ArtifactAssets;
};
