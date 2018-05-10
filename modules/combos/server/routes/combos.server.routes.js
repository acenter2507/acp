'use strict';

/**
 * Module dependencies
 */
var combosPolicy = require('../policies/combos.server.policy'),
  combos = require('../controllers/combos.server.controller');

module.exports = function (app) {

  app.route('/api/combos/search').post(combos.search);
  app.route('/api/combos/removeAll').post(combos.removeAll);

  // Combos Routes
  app.route('/api/combos')//.all(combosPolicy.isAllowed)
    .get(combos.list)
    .post(combos.create);

  app.route('/api/combos/:comboId')//.all(combosPolicy.isAllowed)
    .get(combos.read)
    .put(combos.update)
    .delete(combos.delete);

  app.route('/api/combos/:comboId/addProduct').post(combos.addProduct);
  app.route('/api/combos/:comboId/removeProduct').post(combos.removeProduct);
  app.route('/api/combos/:comboId/clearProduct').post(combos.clearProduct);
  app.route('/api/combos/:comboId/copyCombo').post(combos.copyCombo);

  // Finish by binding the Combo middleware
  app.param('comboId', combos.comboByID);
};
