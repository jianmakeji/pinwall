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

  router.get('/terms/transferTerms', controller.terms.transferTerms);
  router.get('/terms/transferTopicTerm', controller.terms.transferTopicTerm);
};
