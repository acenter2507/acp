'use strict';

var mongoose = require('mongoose'),
  _ = require('underscore'),
  path = require('path'),
  fs = require('fs');
var product_image_folder = './modules/products/client/img/';
var product_image_path = path.resolve(product_image_folder);

exports.excute = function () {
  clear_image();
};

function clear_image() {
  console.log('Runing job');
  var products = [];
  get_products()
    .then(function (_products) {
      products = _products;
      fs.readdirSync(product_image_path).forEach(file => {
        products = _products;
        var product = _.findWhere(products, { image: product_image_folder + file });
        if (!product) {
          var filePath = product_image_path + '/' + file;
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