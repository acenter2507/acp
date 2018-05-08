'use strict';

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');

module.exports = function(app) {
  app.route('/api/products/image').post(products.image);
  app.route('/api/products/search').post(products.search);
  app.route('/api/products/quickSearch').post(products.quickSearch);
  app.route('/api/products/removeAll').post(products.removeAll);
  app.route('/api/products/getProductByQRCode').post(products.getProductByQRCode);
  // Products Routes
  app.route('/api/products')//.all(productsPolicy.isAllowed)
    .get(products.list)
    .post(products.create);

  app.route('/api/products/:productId')//.all(productsPolicy.isAllowed)
    .get(products.read)
    .put(products.update)
    .delete(products.delete);

  // Finish by binding the Product middleware
  app.param('productId', products.productByID);
};
