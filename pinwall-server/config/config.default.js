'use strict';

const path = require('path');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1543291095941_2061';

  // add your config here
  config.middleware = [];

  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'pinwall',
    timezone: '+08:00',
    define: {
      freezeTableName: true,
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci',
      },
      timestamps: false,
    },
    pool: {
      max: 5,
      min: 1,
      acquire: 30000,
      idle: 10000
    },
  };

  config.elasticsearch = {
   app: true,
   client: {
        host: [
          {
              // host: '106.14.41.180',
              // auth: 'elastic:pinwall001@#',
              host: '192.168.3.101',
              auth: 'pinwall:pinwall@1221',
              protocol: 'http',
              port: 9200
          }
        ]
      }
  };

  config.security = {
    csrf:{
      enable:false,
      ignoreJSON:true
    },
    domainWhiteList: ['*']
  };

  config.cors = {
      origin:'*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
  };

  config.assets = {
    publicPath: '/public/',
  };

  config.passportWeiXin = {
    clientID: '',
    secret: '',
    callbackURL: '/auth/weixin/callback',
    scope:'snsapi_userinfo',
  };

  config.onerror = {
    // 线上页面发生异常时，重定向到这个页面上
    errorPageUrl: '/50x.html',
  };

  config.notfound= {
    pageUrl: '/404.html',
  };

  config.logger = {
    dir: 'D:\logs',
    appLogName: `${appInfo.name}-web.log`,
    coreLogName: 'egg-web.log',
    agentLogName: 'egg-agent.log',
    errorLogName: 'common-error.log',
  };

  config.customLogger = {
    elasticLogger:{
      file: path.join(appInfo.root,'logs/transfer.log'),
    },
    aliossLogger:{
      file: path.join(appInfo.root,'logs/alioss.log'),
    },
  };

  config.logrotator = {
    filesRotateBySize: [
      path.join(appInfo.root, 'logs', appInfo.name, '-web.log'),
      path.join(appInfo.root, 'logs', appInfo.name, 'egg-web.log'),
    ],
    maxFileSize: 0.3 * 1024 * 1024 * 1024,
  };

  return config;
};
