/* jshint indent: 2 */

module.exports = app => {

  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize;

  const Users = app.model.define('users', {
    Id: {
      type: INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: STRING(64),
      allowNull: true
    },
    mobile: {
      type: STRING(15),
      allowNull: true
    },
    password: {
      type: STRING(64),
      allowNull: false,
      defaultValue: ''
    },
    openId: {
      type: STRING(64),
      allowNull: true
    },
    nickname: {
      type: STRING(30),
      allowNull: true
    },
    avatarUrl: {
      type: STRING(200),
      allowNull: true
    },
    gender: {
      type: INTEGER(3),
      allowNull: true
    },
    province: {
      type: STRING(20),
      allowNull: true
    },
    city: {
      type: STRING(20),
      allowNull: true
    },
    country: {
      type: STRING(20),
      allowNull: true
    },
    active: {
      type: BOOLEAN,
      allowNull: true
    },
    createAt: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    confirmedAt: {
      type: DATE,
      allowNull: true
    }
  }, {
    tableName: 'users'
  });

  Users.associate = function() {
    app.model.Users.hasMany(app.model.Artifacts,{sourceKey:'Id',foreignKey: 'userId'});
    app.model.Users.hasMany(app.model.Topics,{sourceKey:'Id',foreignKey: 'userId'});

    Users.belongsToMany(Roles, {
      through: {
        model: UserRole,
        unique: false,
        scope: {
          taggable: 'users'
        }
      },
      foreignKey: 'userId',
      constraints: false
    });
  };

  return Users;
};
