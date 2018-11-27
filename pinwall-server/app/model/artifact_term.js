/* jshint indent: 2 */

module.exports = app => {

  const {  INTEGER  } = app.Sequelize;

  const ArtifactTerm = app.model.define('artifact_term', {
    artifactId: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    termId: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    }
  });

  return ArtifactTerm;
};
