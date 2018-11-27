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

  return Terms;
};
