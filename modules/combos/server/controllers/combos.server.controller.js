'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Combo = mongoose.model('Combo'),
  Color = mongoose.model('Color'),
  Product = mongoose.model('Product'),
  config = require(path.resolve('./config/config')),
  multer = require('multer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('underscore');

/**
 * Create a Combo
 */
exports.create = function (req, res) {
  var combo = new Combo(req.body);
  combo.user = req.user;

  combo.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(combo);
      var colorId = (combo.color) ? combo.color._id || combo.color : '';
      Color.setCombo(colorId, combo._id);
    }
  });
};

/**
 * Show the current Combo
 */
exports.read = function (req, res) {

  Combo.findById(req.combo._id)
    .populate('products')
    .populate('color')
    .exec(function (err, combo) {
      if (err)
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      return res.jsonp(combo);
    });
};

/**
 * Update a Combo
 */
exports.update = function (req, res) {
  var combo = req.combo;

  var oldColorId = (combo.color) ? combo.color._id || combo.color : '';

  combo = _.extend(combo, req.body);

  combo.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(combo);
      var newColorId = (combo.color) ? combo.color._id || combo.color : '';
      if (oldColorId !== newColorId) {
        Color.removeCombo(oldColorId);
        Color.setCombo(newColorId, combo._id);
      }
    }
  });
};

/**
 * Delete an Combo
 */
exports.delete = function (req, res) {
  var combo = req.combo;

  combo.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var colorId = (combo.color) ? combo.color._id || combo.color : '';
      Color.removeCombo(colorId);
      combo.products.forEach(product => {
        Product.removeCombo(product, combo._id);
      });
      res.jsonp(combo);
    }
  });
};

/**
 * List of Combos
 */
exports.list = function (req, res) {
  Combo.find().sort('-created').populate('user', 'displayName').exec(function (err, combos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(combos);
    }
  });
};

exports.search = function (req, res) {
  var page = req.body.page || 1;
  var condition = req.body.condition || {};
  console.log(condition);

  var query = {};
  var and_arr = [];
  if (condition.key && condition.key !== '') {
    var key_lower = condition.key.toLowerCase();
    var key_upper = condition.key.toUpperCase();
    var or_arr = [
      { search: { $regex: '.*' + condition.key + '.*' } },
      { search: { $regex: '.*' + key_lower + '.*' } },
      { search: { $regex: '.*' + key_upper + '.*' } }
    ];
    and_arr.push({ $or: or_arr });
  }
  if (condition.qr_code && condition.qr_code !== '') {
    and_arr.push({ qr_code: condition.qr_code });
  }
  if (and_arr.length > 0) {
    query = { $and: and_arr };
  }
  Combo.paginate(query, {
    sort: condition.sort,
    page: page,
    populate: [
      { path: 'products' },
      { path: 'color' }
    ],
    limit: condition.limit
  }).then(combos => {
    res.jsonp(combos);
  }, err => {
    return res.status(400).send({ message: 'データを取得できません！' });
  });
};

exports.removeAll = function (req, res) {
  var ids = req.body.comboIds || [];

  Combo.find({ _id: { $in: ids } })
    .exec(function (err, combos) {
      var promise = [];
      combos.forEach(combo => {
        promise.push(clearInfoOfCombo(combo));
      });
      Promise.all(promise);
    });

  // Combo.remove({ _id: { $in: ids } })
  //   .exec(function (err) {
  //     if (err)
  //       return res.status(400).send({ message: 'セットを削除できません！' });
  //     res.end();
  //     ids.forEach(comboId => {
        
  //       Product.find({ combos: comboId }).exec((err, products) => {
  //         products.forEach(product => {
  //           Product.removeCombo(product._id, comboId);
  //         });
  //       });
  //     });
  //   });

    function clearInfoOfCombo(combo) {
      var colorId = combo.color._id || combo.color;
      Color.removeCombo(colorId);
      Product.find({ combos: combo._id }).exec((err, products) => {
        products.forEach(product => {
          Product.removeCombo(product._id, combo._id);
        });
      });
      combo.remove();
    }
};

/**
 * Delete product from combo
 */
exports.removeProduct = function (req, res) {
  var productId = req.body.productId;
  var combo = req.combo;

  Combo.removeProduct(combo._id, productId)
    .then(() => {
      return Product.removeCombo(productId, combo._id);
    })
    .then(() => {
      combo.products.forEach(product => {
        Product.removeCombo(product, combo._id);
      });
      return res.jsonp();
    });
};

/**
 * Add product to combo
 */
exports.addProduct = function (req, res) {
  var productId = req.body.productId;
  var combo = req.combo;

  if (!combo) return res.status(400).send({ message: 'セットが存在しません！' });

  Combo.addProduct(combo._id, productId)
    .then(() => {
      return Product.addCombo(productId, combo._id);
    })
    .then(() => {
      return res.jsonp();
    });
};

/**
 * Remove all product in combo
 */
exports.clearProduct = function (req, res) {
  var combo = req.combo;
  var products = combo.products;
  combo.products = [];

  combo.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      products.forEach(product => {
        Product.removeCombo(product, combo._id);
      });
      res.end();
    }
  });
};

/**
 * Copy new combo
 */
exports.copyCombo = function (req, res) {
  var newCombo = new Combo({
    name: req.combo.name,
    image: req.combo.image,
    color_code: req.combo.color_code,
    datetime: req.combo.datetime,
    author: req.combo.author,
    sterilize_date: req.combo.sterilize_date,
    search: req.combo.search,
    products: req.combo.products
  });

  newCombo.save(function (err) {
    if (err) {
      return res.status(400).send({ message: 'セットをコピーできません！' });
    } else {
      res.jsonp(newCombo);
      req.combo.products.forEach(product => {
        Product.addCombo(product, newCombo._id);
      });
    }
  });
};

/**
 * Combo middleware
 */
exports.comboByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Combo is invalid'
    });
  }

  Combo.findById(id).exec(function (err, combo) {
    if (err) {
      return next(err);
    } else if (!combo) {
      return res.status(404).send({
        message: 'セットが存在しません！'
      });
    }
    req.combo = combo;
    next();
  });
};

/**
 * Change Combo image
 */
exports.image = function (req, res) {
  var upload = multer(config.uploads.comboImage).single('comboImage');
  var comboImageFilter = require(path.resolve('./config/lib/multer')).imageFilter;
  upload.fileFilter = comboImageFilter;
  upload(req, res, function (uploadError) {
    if (uploadError) return res.status(400).send({ message: '写真をアップロードできません！' });
    var imageUrl = config.uploads.comboImage.dest + req.file.filename;
    return res.jsonp(imageUrl);
  });
};