/* jshint indent: 2 */

module.exports = app => {

  const { INTEGER } = app.Sequelize;

  const UserRole = app.model.define('user_role', {
    userId: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    roleId: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    }
  });

  return UserRole;
};
