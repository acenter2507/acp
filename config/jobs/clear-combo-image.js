'use strict';

var mongoose = require('mongoose'),
  _ = require('underscore'),
  path = require('path'),
  fs = require('fs');
var combo_image_folder = './modules/combos/client/img/';
var combo_image_path = path.resolve(combo_image_folder);

exports.excute = function () {
  clear_image();
};

function clear_image() {
  console.log('Runing job');
  var combos = [];
  get_combos()
    .then(function (_combos) {
      combos = _combos;
      fs.readdirSync(combo_image_path).forEach(file => {
        combos = _combos;
        var combo = _.findWhere(combos, { image: combo_image_folder + file });
        if (!combo) {
          var filePath = combo_image_path + '/' + file;
          return fs.unlink(filePath);
        }
      });

    })
    .catch(function (err) {
      return;
    });
}
function get_combos() {
  var Combo = mongoose.model('Combo');
  return new Promise(function (resolve, reject) {
    Product.find().exec(function (err, combos) {
      if (err) return reject();
      return resolve(combos);
    });
  });
}