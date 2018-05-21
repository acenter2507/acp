'use strict';

var CronJob = require('cron').CronJob,
  clear_product_image = require('../jobs/clear-product-image');
  clear_combo_image = require('../jobs/clear-combo-image');


var test_job = new CronJob({
  cronTime: '* * * * *',
  onTick: function() {
    // rank_user.excute();
  },
  start: false,
  timeZone: 'Asia/Tokyo'
});
var clear_image_job = new CronJob({
  cronTime: '0 0 0 1 * *',
  onTick: function() {
    clear_product_image.excute();
    clear_combo_image.excute();
  },
  start: false,
  timeZone: 'Asia/Tokyo'
});
function start() {
  clear_image_job.start();
}
exports.start = start;
