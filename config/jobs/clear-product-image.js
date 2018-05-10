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
  fs.readdirSync(product_image_folder).forEach(file => {
    console.log(file);
    verify_image(filename);
  });
}
function verify_image(filename) {
  console.log(typeof filename);
}