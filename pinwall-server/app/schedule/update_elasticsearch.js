const Subscription = require('egg').Subscription;
const fs = require('fs');
const path = require('path');

class UpdateElasticsearch extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '10s', // 1m 分钟间隔
      type: 'worker', // 指定所有的 worker 都需要执行
    };
  }


  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const filePath =  path.resolve(this.app.config.static.dir,'project_config');

    if(!fs.existsSync(filePath)){
      fs.mkdirSync(filePath);
    }
    const filename = path.resolve(filePath,'time.properties');

    let fd;
    const thisSyncTime = new Date();

    fs.readFile(filename, function (err, data) {
       if (err) {
          return console.error(err);
       }
       const lastSyncTime = new Date(data.toString());
       console.log('last sync time :' + lastSyncTime);

    });

    try {
      fd = fs.openSync(filename, 'w');
      fs.appendFileSync(fd, thisSyncTime +' \n', 'utf8');
    } catch (err) {
      /* Handle the error */
    } finally {
      if (fd !== undefined)
        fs.closeSync(fd);
    }

  }
}

module.exports = UpdateElasticsearch;
