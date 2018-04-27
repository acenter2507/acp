'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Combo = mongoose.model('Combo'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Combo
 */
exports.create = function(req, res) {
  var combo = new Combo(req.body);
  combo.user = req.user;

  combo.save(function(err) {
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
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var combo = req.combo ? req.combo.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  combo.isCurrentUserOwner = req.user && combo.user && combo.user._id.toString() === req.user._id.toString();

  res.jsonp(combo);
};

/**
 * Update a Combo
 */
exports.update = function(req, res) {
  var combo = req.combo;

  combo = _.extend(combo, req.body);

  combo.save(function(err) {
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
exports.delete = function(req, res) {
  var combo = req.combo;

  combo.remove(function(err) {
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
exports.list = function(req, res) {
  Combo.find().sort('-created').populate('user', 'displayName').exec(function(err, combos) {
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
 * Combo middleware
 */
exports.comboByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Combo is invalid'
    });
  }

  Combo.findById(id).populate('user', 'displayName').exec(function (err, combo) {
    if (err) {
      return next(err);
    } else if (!combo) {
      return res.status(404).send({
        message: 'No Combo with that identifier has been found'
      });
    }
    req.combo = combo;
    next();
  });
};
