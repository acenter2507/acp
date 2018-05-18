'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Color = mongoose.model('Color'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Color
 */
exports.create = function(req, res) {
  var color = new Color(req.body);
  color.user = req.user;

  color.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(color);
    }
  });
};

/**
 * Show the current Color
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var color = req.color ? req.color.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  color.isCurrentUserOwner = req.user && color.user && color.user._id.toString() === req.user._id.toString();

  res.jsonp(color);
};

/**
 * Update a Color
 */
exports.update = function(req, res) {
  var color = req.color;

  color = _.extend(color, req.body);

  color.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(color);
    }
  });
};

/**
 * Delete an Color
 */
exports.delete = function(req, res) {
  var color = req.color;

  color.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(color);
    }
  });
};

/**
 * List of Colors
 */
exports.list = function(req, res) {
  Color.find().sort('-created').populate('user', 'displayName').exec(function(err, colors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(colors);
    }
  });
};

/**
 * Color middleware
 */
exports.colorByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Color is invalid'
    });
  }

  Color.findById(id).populate('user', 'displayName').exec(function (err, color) {
    if (err) {
      return next(err);
    } else if (!color) {
      return res.status(404).send({
        message: 'No Color with that identifier has been found'
      });
    }
    req.color = color;
    next();
  });
};
