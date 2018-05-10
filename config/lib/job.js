'use strict';

var CronJob = require('cron').CronJob,
  clear_product_image = require('../jobs/clear-product-image');


var test_job = new CronJob({
  cronTime: '* * * * *',
  onTick: function() {
    // rank_user.excute();
  },
  start: false,
  timeZone: 'Asia/Tokyo'
});
var clear_product_image_job = new CronJob({
  cronTime: '0 0 0 1 * *', //every 24hours (every midnight)
  onTick: function() {
    clear_product_image.excute();
  },
  start: false,
  timeZone: 'Asia/Tokyo'
});
function start() {
  clear_product_image_job.start();
}
exports.start = start;
