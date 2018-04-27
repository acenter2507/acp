// Sets service used to communicate Sets REST endpoints
(function () {
  'use strict';

  angular
    .module('sets')
    .factory('SetsService', SetsService);

  SetsService.$inject = ['$resource'];

  function SetsService($resource) {
    return $resource('api/sets/:setId', {
      setId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
