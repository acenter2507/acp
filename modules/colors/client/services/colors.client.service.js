// Colors service used to communicate Colors REST endpoints
(function () {
  'use strict';

  angular
    .module('colors')
    .factory('ColorsService', ColorsService);

  ColorsService.$inject = ['$resource'];

  function ColorsService($resource) {
    return $resource('api/colors/:colorId', {
      colorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
