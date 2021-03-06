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
    this.search = function (condition, page) {
      return $http.post('/api/products/search', { condition: condition, page: page }, { ignoreLoadingBar: true });
    };
    this.removeAll = function (productIds) {
      return $http.post('/api/products/removeAll', { productIds: productIds }, { ignoreLoadingBar: true });
    };
    this.quickSearch = function (condition) {
      return $http.post('/api/products/quickSearch', { condition: condition }, { ignoreLoadingBar: true });
    };
    this.getProductByQRCode = function (qr_code) {
      return $http.post('/api/products/getProductByQRCode', { qr_code: qr_code }, { ignoreLoadingBar: true });
    };
    return this;
  }
}());
