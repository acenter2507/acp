// Products service used to communicate Products REST endpoints
(function () {
  'use strict';

  angular
    .module('products')
    .factory('ProductsService', ProductsService)
    .factory('ProductsApi', ProductsApi);

  ProductsService.$inject = ['$resource'];

  function ProductsService($resource) {
    return $resource('api/products/:productId', { productId: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });
  }
  ProductsApi.$inject = ['$http'];
  function ProductsApi($http) {
    this.search = (condition, page) => {
      return $http.post('/api/products/search', { condition: condition, page: page }, { ignoreLoadingBar: true });
    };
    return this;
  }
}());
