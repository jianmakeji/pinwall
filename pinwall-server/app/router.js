'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/login', controller.home.login);
  router.post('/login',app.passport.authenticate('local', { successRedirect: '/authCallback' }));
  router.get('/authCallback', controller.home.index);
  router.get('/logout', controller.home.logout);
  router.get('/upload', controller.home.upload);
  router.get('/uploadWork', controller.home.uploadWork);
  router.get('/project/:id', controller.home.project);
  router.get('/topics', controller.home.topics);
  router.get('/topicsAbout', controller.home.topicsAbout);
  router.get('/users/:id', controller.home.users);
  router.get('/workFolder', controller.home.workFolder);
  router.get('/userManager', controller.home.userManager);
  router.get('/workManager', controller.home.workManager);
  router.get('/commentManager', controller.home.commentManager);
  router.get('/children', controller.home.children);

  app.get("/auth/weixin", app.passport.authenticate('loginByWeixinClient'));
  app.get("/auth/weixin/callback",app.passport.authenticate('loginByWeixinClient',{ successRedirect: '/authCallback',failureRedirect: '/login' }));

  //自定义接口
  router.get('/website/artifacts/getMedalDataByRandom/:limit', controller.website.artifacts.getMedalDataByRandom);
  router.get('/website/artifacts/getPersonalJobByUserId',controller.website.artifacts.getPersonalJobByUserId);

  router.get('/website/artifactScores/findByArtifactIdWithPage', controller.website.artifactScores.findByArtifactIdWithPage);
  router.get('/website/artifactScores/findByScorerIdWithPage', controller.website.artifactScores.findByScorerIdWithPage);

  router.get('/website/artifactComment/findByArtifactIdWithPage', controller.website.artifactComment.findByArtifactIdWithPage);
  router.get('/website/artifactComment/setCommentVisible', controller.website.artifactComment.setCommentVisible);

  router.get('website.users.findByUsersEmail', '/website/users/findByUsersEmail', controller.website.users.findByUsersEmail);
  router.put('website.users.updateAcviveByActiveCodeAndEmail', '/website/users/updateAcviveByActiveCodeAndEmail', controller.website.users.updateAcviveByActiveCodeAndEmail);
  router.put('website.users.updateAcviveByUserId', '/website/users/updateAcviveByUserId/:id', controller.website.users.updateAcviveByUserId);

  router.get('website.users.sendBindingEmailCode', '/website/users/sendBindingEmailCode', controller.website.users.sendBindingEmailCode);

  //网站接口
  router.resources('website.users', '/website/users', controller.website.users);
  router.resources('website.artifactComment', '/website/artifactComment', controller.website.artifactComment);
  router.resources('website.artifacts', '/website/artifacts', controller.website.artifacts);
  router.resources('website.roles', '/website/roles', controller.website.roles);
  router.resources('website.terms', '/website/terms', controller.website.terms);
  router.resources('website.topics', '/website/topics', controller.website.topics);
  router.resources('website.artifactScores', '/website/artifactScores', controller.website.artifactScores);


};
