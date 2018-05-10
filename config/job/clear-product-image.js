'use strict';

var mongoose = require('mongoose'),
  _ = require('underscore'),
  path = require('path'),
  fs = require('fs');

var product_image_folder = path.resolve('../../modules/products/client/img/');

exports.excute = function () {
  clear_image();
};

function clear_image() {
  fs.readdirSync(product_image_folder).forEach(file => {
    console.log(file);
  });
}