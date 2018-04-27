// Combos service used to communicate Combos REST endpoints
(function () {
  'use strict';

  angular
    .module('combos')
    .factory('CombosService', CombosService);

  CombosService.$inject = ['$resource'];

  function CombosService($resource) {
    return $resource('api/combos/:comboId', {
      comboId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
