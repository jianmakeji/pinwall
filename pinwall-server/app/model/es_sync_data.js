/* jshint indent: 2 */
const moment = require('moment');
module.exports = app => {

  const { INTEGER, DATE } = app.Sequelize;

  const EsSyncData = app.model.define('esSyncData', {
    Id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    syncType: {
      type: INTEGER(8),
      allowNull: false,
      defaultValue: 1
    },
    lastSyncTime: {
      type: DATE,
      allowNull: true,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP'),
      get(){
        return moment(this.getDataValue('lastSyncTime')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    tableName: 'es_sync_data'
  });

  EsSyncData.createEsSyncData = async function (syncType, date) {
    return this.create({
      syncType: syncType,
      lastSyncTime: date
    });
  }

  EsSyncData.getDateBySyncType = async function (syncType) {
    return this.findAll({
      where:{
        syncType:syncType
      }
    });
  }

  EsSyncData.updateDate = async function (syncType, date) {
    return this.update({
      lastSyncTime:date
    },{
      where:{
        syncType:syncType
      }
    });
  }

  return EsSyncData;
};
