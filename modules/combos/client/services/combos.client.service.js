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
    this.removeAll = function(comboIds) {
      return $http.post('/api/combos/removeAll', { comboIds: comboIds }, { ignoreLoadingBar: true });
    };
    this.addProduct = function(comboId, productId) {
      return $http.post('/api/combos/' + comboId + '/addProduct', { productId: productId }, { ignoreLoadingBar: true });
    };
    this.removeProduct = function(comboId, productId) {
      return $http.post('/api/combos/' + comboId + '/removeProduct', { productId: productId }, { ignoreLoadingBar: true });
    };
    this.clearProduct = function(comboId) {
      return $http.post('/api/combos/' + comboId + '/clearProduct', { }, { ignoreLoadingBar: true });
    };
    this.copyCombo = function(comboId) {
      return $http.post('/api/combos/' + comboId + '/copyCombo', { }, { ignoreLoadingBar: true });
    };
    
    return this;
  }
}());
