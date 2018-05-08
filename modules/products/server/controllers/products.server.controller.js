'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  Combo = mongoose.model('Combo'),
  config = require(path.resolve('./config/config')),
  multer = require('multer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('underscore');

/**
 * Create a Product
 */
exports.create = function (req, res) {
  var product = new Product(req.body);
  product.user = req.user;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.user && product.user._id.toString() === req.user._id.toString();

  res.jsonp(product);
};

/**
 * Update a Product
 */
exports.update = function (req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Delete an Product
 */
exports.delete = function (req, res) {
  var product = req.product;

  product.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      product.combos.forEach(combo => {
        Combo.removeProduct(combo, product._id);
      });
      res.jsonp(product);
    }
  });
};

/**
 * List of Products
 */
exports.list = function (req, res) {
  Product.find().sort('-created').populate('user', 'displayName').exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(products);
    }
  });
};

/**
 * Change Products image
 */
exports.image = function (req, res) {
  var upload = multer(config.uploads.productImage).single('productImage');
  var productImageFilter = require(path.resolve('./config/lib/multer')).productImageFilter;
  upload.fileFilter = productImageFilter;
  upload(req, res, function (uploadError) {
    if (uploadError) return res.status(400).send({ message: '写真をアップロードできません！' });
    var imageUrl = config.uploads.productImage.dest + req.file.filename;
    return res.jsonp(imageUrl);
  });
};
exports.search = function (req, res) {
  var page = req.body.page || 1;
  var condition = req.body.condition || {};

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
  if (and_arr.length > 0) {
    query = { $and: and_arr };
  }
  Product.paginate(query, {
    sort: condition.sort,
    page: page,
    populate: [
      { path: 'combos' }
    ],
    limit: condition.limit
  }).then(products => {
    res.jsonp(products);
  }, err => {
    return res.status(400).send({ message: 'データを取得できません！' });
  });
};

exports.removeAll = function (req, res) {
  var ids = req.body.productIds || [];

  Product.remove({ _id: { $in: ids } })
    .exec(function (err) {
      if (err)
        return res.status(400).send({ message: '製品を削除できません！' });
      res.end();
      ids.forEach(productId => {
        Combo.find({ products: productId }).exec((err, combos) => {
          combos.forEach(combo => {
            Combo.removeProduct(combo._id, productId);
          });
        });
      });
    });
};

/**
 * Tìm kiếm user với key và list ignore
 */
exports.quickSearch = function (req, res) {
  var condition = req.body.condition || {};
  var key = condition.key;

  var ands = [];
  if (key && key.length > 0) {
    var key_lower = key.toLowerCase();
    var key_upper = key.toUpperCase();
    var or_arr = [
      { search: { $regex: '.*' + key + '.*' } },
      { search: { $regex: '.*' + key_lower + '.*' } },
      { search: { $regex: '.*' + key_upper + '.*' } }
    ];
    ands.push({ $or: or_arr });
  } else {
    return res.jsonp([]);
  }

  var query = { $and: ands };
  Product.find(query)
    .select('name image brand')
    .exec((err, products) => {
      if (err) res.status(400).send(err);
      res.jsonp(products);
    });
};

/**
 * Tìm kiếm Product với QRCode
 */
exports.getProductByQRCode = function (req, res) {
  var qr_code = req.body.qr_code;
  if (!qr_code || qr_code.length === 0) {
    return res.status(400).send({ message: '製品の情報がみつかりません' });
  }

  Product.findOne({ qr_code: qr_code })
    .select('name image brand qr_code')
    .exec((err, product) => {
      if (err || !product) return res.status(400).send(err);
      return res.jsonp(product);
    });
};

/**
 * Product middleware
 */
exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No Product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};
