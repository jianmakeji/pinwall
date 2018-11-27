/* jshint indent: 2 */

module.exports  = app => {

  const { BOOLEAN, INTEGER, DATE, TEXT } = app.Sequelize;

  const ArtifactComments = app.model.define('artifact_comments', {
    Id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    artifactId: {
      type: INTEGER,
      allowNull: true
    },
    commenterId: {
      type: INTEGER,
      allowNull: true
    },
    content: {
      type: TEXT,
      allowNull: true
    },
    commentAt: {
      type: DATE,
      allowNull: false,
      defaultValue:  app.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    visible: {
      type: BOOLEAN,
      allowNull: true
    }
  });

  return ArtifactComments;
};
