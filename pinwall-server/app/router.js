'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  //网站接口
  router.resources('website.users', '/website/users', controller.website.users);
  router.resources('website.artifactComment', '/website/artifactComment', controller.website.artifactComment);
  router.resources('website.artifacts', '/website/artifacts', controller.website.artifacts);
  router.resources('website.roles', '/website/roles', controller.website.roles);
  router.resources('website.terms', '/website/terms', controller.website.terms);
  router.resources('website.topics', '/website/topics', controller.website.topics);
  router.resources('website.artifactScores', '/website/artifactScores', controller.website.artifactScores);

  //自定义接口
  router.get('/website/artifactScores/findByArtifactIdWithPage', controller.website.artifactScores.findByArtifactIdWithPage);
  router.get('/website/artifactScores/findByScorerIdWithPage', controller.website.artifactScores.findByScorerIdWithPage);

  router.get('/website/artifactComment/findByArtifactIdWithPage', controller.website.artifactComment.findByArtifactIdWithPage);
  router.get('/website/artifactComment/setCommentVisible', controller.website.artifactComment.setCommentVisible);



};
