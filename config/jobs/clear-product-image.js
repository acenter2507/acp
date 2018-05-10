'use strict';

var mongoose = require('mongoose'),
  _ = require('underscore'),
  path = require('path'),
  fs = require('fs');

var product_image_folder = path.resolve('./modules/products/client/img/');

exports.excute = function () {
  clear_image();
};

function clear_image() {
  console.log('Runing job');
  var products = [];
  get_products()
    .then(function (_products) {
      products = _products;
      fs.readdirSync(product_image_folder).forEach(file => {
        products = _products;
        var product = _.findWhere(products, { image: file });
        if (!product) {
          var filePath = product_image_folder + '/' + file;
          return fs.unlink(filePath);
        }
      });

    })
    .catch(function (err) {
      return;
    });
}
function get_products() {
  var Product = mongoose.model('Product');
  return new Promise(function (resolve, reject) {
    Product.find().exec(function (err, products) {
      if (err) return reject();
      return resolve(products);
    });
  });
}