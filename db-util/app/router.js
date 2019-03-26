'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/users/transferUsers', controller.users.transferUsers);
  router.get('/users/transferRoles', controller.users.transferRoles);
  router.get('/users/transferUserRoles', controller.users.transferUserRoles);

  router.get('/topics/transferTopics', controller.topics.transferTopics);
  router.get('/topics/transferTopicArtifact', controller.topics.transferTopicArtifact);

  router.get('/terms/transferTerms', controller.terms.transferTerms);
  router.get('/terms/transferTopicTerm', controller.terms.transferTopicTerm);

  router.get('/artifact/transferArtifacts', controller.artifacts.transferArtifacts);
  router.get('/artifact/transferArtifactsAssets', controller.artifacts.transferArtifactsAssets);
  router.get('/artifact/transferArtifactsTerm', controller.artifacts.transferArtifactsTerm);

  router.get('/prometheus/comment/transferComments', controller.prometheus.comment.transferComments);
  router.get('/prometheus/eliteCourse/transferEliteCourse', controller.prometheus.users.transferEliteCourse);
  router.get('/prometheus/favourite/transferFavourite', controller.prometheus.favourite.transferFavourite);
  router.get('/prometheus/prometheusUsers/transferPrometheusUsers', controller.prometheus.prometheusUsers.transferPrometheusUsers);
  router.get('/prometheus/specialCourse/transferSpecialCourse', controller.prometheus.specialCourse.transferSpecialCourse);
  router.get('/prometheus/specialColumn/transferSpecialColumn', controller.prometheus.specialColumn.transferSpecialColumn);
};
