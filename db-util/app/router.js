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
  router.get('/artifact/updateHtml5Type', controller.artifacts.updateHtml5Type);
  router.get('/artifact/selectData', controller.artifacts.selectData);
  router.get('/artifact/updateArtifactStorageTag', controller.artifacts.updateArtifactStorageTag);
  router.get('/artifact/updateArtifactAssetsStorageTag', controller.artifacts.updateArtifactAssetsStorageTag);
  router.get('/artifact/downloadQiniuFiles', controller.artifacts.downloadQiniuFiles);
  router.get('/artifact/downloadQiniuDetailFiles', controller.artifacts.downloadQiniuDetailFiles);
  router.get('/artifact/downloadQiniuDetailFiles2', controller.artifacts.downloadQiniuDetailFiles2);
  router.get('/artifact/testQiniuFileUploadToAliOSS', controller.artifacts.testQiniuFileUploadToAliOSS);
  router.get('/artifact/testQiniuDetailFileUploadToAliOSS', controller.artifacts.testQiniuDetailFileUploadToAliOSS);
  router.get('/artifact/checkPdfData', controller.artifacts.checkPdfData);

  router.get('/prometheus/comment/transferComments', controller.prometheus.comment.transferComments);
  router.get('/prometheus/eliteCourse/transferEliteCourse', controller.prometheus.eliteCourse.transferEliteCourse);
  router.get('/prometheus/eliteSchool/transferEliteSchool', controller.prometheus.eliteSchool.transferEliteSchool);
  router.get('/prometheus/favourite/transferFavourite', controller.prometheus.favourite.transferFavourite);
  router.get('/prometheus/prometheusUsers/transferPrometheusUsers', controller.prometheus.prometheusUsers.transferPrometheusUsers);
  router.get('/prometheus/specialCourse/transferSpecialCourse', controller.prometheus.specialCourse.transferSpecialCourse);
  router.get('/prometheus/specialColumn/transferSpecialColumn', controller.prometheus.specialColumn.transferSpecialColumn);
};
