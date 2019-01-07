'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  const pageAuthCheck = app.middleware.pageAuthCheck();
  const ajaxAuthCheck = app.middleware.ajaxAuthCheck();

  router.get('/', controller.home.index);
  router.get('/index', controller.home.index);
  router.get('/login', controller.home.login);
  router.get('/relogin', controller.home.relogin);
  router.get('/wxRelogin', controller.home.wxRelogin);

  router.post('/login',app.passport.authenticate('local', {
       successReturnToOrRedirect : '/index',successFlash: true,
       failureRedirect: '/relogin',failureFlash: true }));

  router.get('/loginByWeixin',app.passport.authenticate('loginByWeixin', {
       successReturnToOrRedirect : '/website/users/bindWeixin',successFlash: true,
       failureRedirect: '/relogin',failureFlash: true,state: 'hello-pinwall', }));
  router.get('/logout', controller.home.logout);
  router.get('/wxLogin', controller.website.users.wxLogin);

  router.get('/upload', controller.home.upload);
  router.get('/uploadWork/:jobTag', pageAuthCheck, controller.home.uploadWork);
  router.get('/editUploadWork', controller.home.uploadWork);

  router.get('/project/:id', controller.home.project);
  router.get('/topics', controller.home.topics);
  router.get('/topicsAbout', controller.home.topicsAbout);
  router.get('/users/:id', controller.home.users);
  router.get('/workFolder/:id', controller.home.workFolder);
  router.get('/userManager', pageAuthCheck, controller.home.userManager);
  router.get('/workManager', pageAuthCheck, controller.home.workManager);
  router.get('/commentManager', pageAuthCheck, controller.home.commentManager);
  router.get('/topicsUpdate/:id', pageAuthCheck, controller.home.topicsUpdate);
  router.get('/children', controller.home.children);
  router.get('/search', controller.home.search);
  router.get('/resetInfo', controller.home.resetInfo);
  router.get('/forgetPwd', controller.home.forgetPwd);
  router.get('/register', controller.home.register);
  router.get('/createTopics', pageAuthCheck, controller.home.createTopics);
  router.get("/completeInfo", controller.home.completeInfo);
  router.get('/getSTSSignature/:fileType', ajaxAuthCheck, controller.website.alioss.getSTSSignature);
  router.get('/getUrlSignature', controller.website.alioss.getUrlSignature);
  router.get('/getCaptcha',controller.website.users.getCaptcha);
  router.get('/checkCaptcha',controller.website.users.checkCaptcha);
  router.get('/sendBackPwdEmail',controller.home.sendBackPwdEmail);

  //自定义接口
  router.get('/website/artifacts/getMedalDataByRandom/:limit', controller.website.artifacts.getMedalDataByRandom);
  router.get('/website/artifacts/getPersonalJob', ajaxAuthCheck, controller.website.artifacts.getPersonalJob);
  router.get('/website/artifacts/getPersonalJobByUserId', controller.website.artifacts.getPersonalJobByUserId);

  router.get('/website/artifactScores/findByArtifactIdWithPage', controller.website.artifactScores.findByArtifactIdWithPage);
  router.get('/website/artifactScores/findByScorerIdWithPage', controller.website.artifactScores.findByScorerIdWithPage);

  router.get('/website/artifactComment/findByArtifactIdWithPage', controller.website.artifactComment.findByArtifactIdWithPage);
  router.get('/website/artifactComment/setCommentVisible', ajaxAuthCheck, controller.website.artifactComment.setCommentVisible);

  router.get('website.users.findByUsersEmail', '/website/users/findByUsersEmail', controller.website.users.findByUsersEmail);
  router.get('website.users.updateAcviveByActiveCodeAndEmail', '/website/users/updateAcviveByActiveCodeAndEmail', controller.website.users.updateAcviveByActiveCodeAndEmail);
  router.put('website.users.updateAcviveByUserId', '/website/users/updateAcviveByUserId/:id', ajaxAuthCheck, controller.website.users.updateAcviveByUserId);
  router.put('website.users.sendBindingEmailCode', '/website/users/sendBindingEmailCode', controller.website.users.sendBindingEmailCode);

  router.get('website.users.bindWeixin', '/website/users/bindWeixin', controller.website.users.bindWeixin);
  router.post('website.users.bindWeixinInfoByEmail', '/website/users/bindWeixinInfoByEmail', controller.website.users.bindWeixinInfoByEmail);
  router.get('website.users.updateWxActive', '/website/users/updateWxActive', controller.website.users.updateWxActive);
  router.post('website.users.createWxUser', '/website/users/createWxUser', controller.website.users.createWxUser);
  router.post('website.users.createUser', '/website/users/createUser', controller.website.users.createUser);
  router.post('website.users.updatePwd', '/website/users/updatePwd',ajaxAuthCheck, controller.website.users.updatePwd);

  router.get('website.users.sendBindingEmailCode', '/website/users/sendBindingEmailCode', controller.website.users.sendBindingEmailCode);
  router.get('website.topics.getTopicAndArtifactById', '/website/topics/getTopicAndArtifactById', controller.website.topics.getTopicAndArtifactById);

  router.get('website.search.searchByKeywords','/website/search/searchByKeywords', controller.website.search.searchByKeywords);
  router.get('website.search.transferData','/website/search/transferData', controller.website.search.transferData);

  router.put('website.topics.updateTopicStatus','/website/topics/updateTopicStatus', controller.website.topics.updateTopicStatus);

  //网站接口
  router.resources('website.users', '/website/users',  ajaxAuthCheck, controller.website.users);
  router.resources('website.artifactComment', '/website/artifactComment', ajaxAuthCheck, controller.website.artifactComment);
  router.resources('website.artifacts', '/website/artifacts', controller.website.artifacts);
  router.resources('website.roles', '/website/roles', ajaxAuthCheck, controller.website.roles);
  router.resources('website.terms', '/website/terms', controller.website.terms);
  router.resources('website.topics', '/website/topics', controller.website.topics);
  router.resources('website.artifactScores', '/website/artifactScores', controller.website.artifactScores);


};
