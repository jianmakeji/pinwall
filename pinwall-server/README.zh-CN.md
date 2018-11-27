# pinwall-server
# pinwall 项目服务器端

## 初始化项目

```bash
$ npm install
```
##运行单元测试
```bash
$ npm test
```
##数据库初始化
###初始化 Migrations 配置文件和目录
```bash
$ npx sequelize init:config
$ npx sequelize init:migrations
$ npx sequelize init:seeders
$ npx sequelize init:models
```
### 修改 database/config.json配置文件为指定数据库
### 使用Migration 文件来创建
$ npx sequelize migration:generate --name=init-user
### 升级数据库
$ npx sequelize db:migrate
### 如果有问题需要回滚，可以通过 `db:migrate:undo` 回退一个变更
$ npx sequelize db:migrate:undo
### 可以通过 `db:migrate:undo:all` 回退到初始状态
$ npx sequelize db:migrate:undo:all


## 快速入门

<!-- 在此次添加使用文档 -->

如需进一步了解，参见 [egg 文档][egg]。

### 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
$ npm start
$ npm stop
```

### 单元测试

- [egg-bin] 内置了 [mocha], [thunk-mocha], [power-assert], [istanbul] 等框架，让你可以专注于写单元测试，无需理会配套工具。
- 断言库非常推荐使用 [power-assert]。
- 具体参见 [egg 文档 - 单元测试](https://eggjs.org/zh-cn/core/unittest)。

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。
- 使用 `npm run autod` 来自动检测依赖更新，详细参见 [autod](https://www.npmjs.com/package/autod) 。


[egg]: https://eggjs.org
