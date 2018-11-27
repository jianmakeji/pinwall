/* jshint indent: 2 */

module.exports = app => {

  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Roles = app.model.define('roles', {
    Id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: STRING(30),
      allowNull: false,
      defaultValue: ''
    },
    description: {
      type: STRING(100),
      allowNull: true
    }
  });

  return Roles;
};
