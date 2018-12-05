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
    activeCode: {
      type: STRING(50),
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

    app.model.Users.belongsToMany(app.model.Roles, {
      through: {
        model: app.model.UserRole,
        unique: false
      },
      foreignKey: 'userId',
      constraints: false
    });
  };

  Users.listUsers = async function ({ offset = 0, limit = 10 }) {
    return this.findAndCountAll({
      offset,
      limit,
      order: [[ 'createAt', 'desc' ], [ 'Id', 'desc' ]],
      include:[
        app.model.Roles
      ]
    });
  }

  Users.findUserById = async function (id) {
    const user = await this.findById(id,{
      include:[
        app.model.Roles
      ]
    });
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user;
  }

  Users.createUser = async function (user) {
    return this.create(user);
  }

  Users.updateUser = async function ({ id, updates }) {
    const user = await this.findById(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.update(updates);
  }

  Users.delUserById = async function (id) {
    const user = await this.findById(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.destroy();
  }

  Users.findByOpenId = async function (openId){

    return await this.findAll({
      where:{
        openId:{[this.app.Sequelize.Op.eq]:openId}
      }
    });
  }

  Users.findByUsersEmail = async function (email){
    return await this.findOne({
      where:{
        email:email
      }
    });
  }

  Users.updateUserActiveCodeByEmail = async function(email, activeCode){
    return await this.update({
      activeCode:activeCode
    },{
      where:{
        email:email
      }
    });
  }

  Users.updateAcviveByActiveCodeAndEmail = async function(email,activeCode){
    return await this.update({
      active:1
    },{
      where:{
        email:email,
        activeCode:activeCode
      }
    });
  }

  Users.updateAcviveByUserId = async function(userId){
    return await this.update({
      active:1
    },{
      where:{
        Id:userId
      }
    });
  }

  return Users;
};
