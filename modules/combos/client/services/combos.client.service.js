// Combos service used to communicate Combos REST endpoints
(function () {
  'use strict';

  angular
    .module('combos')
    .factory('CombosService', CombosService)
    .factory('CombosApi', CombosApi);

  CombosService.$inject = ['$resource'];

  function CombosService($resource) {
    return $resource('api/combos/:comboId', { comboId: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });
  }
  CombosApi.$inject = ['$http'];
  function CombosApi($http) {
    this.search = function(condition, page) {
      return $http.post('/api/combos/search', { condition: condition, page: page }, { ignoreLoadingBar: true });
    };
    this.removeAll = function(productIds) {
      return $http.post('/api/combos/removeAll', { productIds: productIds }, { ignoreLoadingBar: true });
    };
    
    return this;
  }
}());
