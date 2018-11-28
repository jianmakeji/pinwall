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

  return Topics;
};
