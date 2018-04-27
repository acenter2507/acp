'use strict';

/**
 * Module dependencies
 */
var setsPolicy = require('../policies/sets.server.policy'),
  sets = require('../controllers/sets.server.controller');

module.exports = function(app) {
  // Sets Routes
  app.route('/api/sets').all(setsPolicy.isAllowed)
    .get(sets.list)
    .post(sets.create);

  app.route('/api/sets/:setId').all(setsPolicy.isAllowed)
    .get(sets.read)
    .put(sets.update)
    .delete(sets.delete);

  // Finish by binding the Set middleware
  app.param('setId', sets.setByID);
};
