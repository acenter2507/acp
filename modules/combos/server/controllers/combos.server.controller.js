'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Combo = mongoose.model('Combo'),
  Product = mongoose.model('Product'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

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
    }
  });
};

/**
 * Show the current Combo
 */
exports.read = function (req, res) {
  
  Combo.findById(req.combo._id)
    .populate('products', 'name image brand')
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

  combo = _.extend(combo, req.body);

  combo.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(combo);
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
 * Add product to combo
 */
exports.clearProduct = function (req, res) {
  var combo = req.combo;
  var products = combo.products;
  combo.products = [];
  res.end();

  combo.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      products.forEach(product => {
        Product.removeCombo(product, combo._id);
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
