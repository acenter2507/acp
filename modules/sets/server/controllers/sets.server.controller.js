'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Set = mongoose.model('Set'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Set
 */
exports.create = function(req, res) {
  var set = new Set(req.body);
  set.user = req.user;

  set.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(set);
    }
  });
};

/**
 * Show the current Set
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var set = req.set ? req.set.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  set.isCurrentUserOwner = req.user && set.user && set.user._id.toString() === req.user._id.toString();

  res.jsonp(set);
};

/**
 * Update a Set
 */
exports.update = function(req, res) {
  var set = req.set;

  set = _.extend(set, req.body);

  set.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(set);
    }
  });
};

/**
 * Delete an Set
 */
exports.delete = function(req, res) {
  var set = req.set;

  set.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(set);
    }
  });
};

/**
 * List of Sets
 */
exports.list = function(req, res) {
  Set.find().sort('-created').populate('user', 'displayName').exec(function(err, sets) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sets);
    }
  });
};

/**
 * Set middleware
 */
exports.setByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Set is invalid'
    });
  }

  Set.findById(id).populate('user', 'displayName').exec(function (err, set) {
    if (err) {
      return next(err);
    } else if (!set) {
      return res.status(404).send({
        message: 'No Set with that identifier has been found'
      });
    }
    req.set = set;
    next();
  });
};
