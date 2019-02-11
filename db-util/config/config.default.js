'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1544522699838_5670';

  // add your config here
  config.middleware = [];

  config.mysql = {
    clients: {
      // clientId, 获取client实例，需要通过 app.mysql.get('clientId') 获取
      db1: {
        // host
        host: '192.168.3.110',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: 'root',
        // 数据库名
        database: 'design_pinwall3',
      },
      db2: {
        // host
        host: '192.168.3.110',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: 'root',
        // 数据库名
        database: 'pinwall',
      },
    },
    // 所有数据库配置的默认值
    default: {

    },

    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  return config;
};
