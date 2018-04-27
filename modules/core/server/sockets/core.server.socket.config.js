'use strict';

const _ = require('underscore');
// Create the chat configuration
module.exports = function (io, socket) {
  socket.on('init', function (req) {
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
  });
};
