(function () {
  'use strict';

  angular
    .module('products')
    .controller('ProductsListController', ProductsListController);

  ProductsListController.$inject = ['$scope', 'ProductsService', 'ProductsApi', 'CommonService'];

  function ProductsListController($scope, ProductsService, ProductsApi, CommonService) {
    var vm = this;

    vm.products = [];
    vm.condition = {};

    vm.busy = false;
    vm.page = 1;
    vm.pages = [];
    vm.total = 0;

    function prepareCondition() {
      vm.condition = {
        sort: '-created',
        limit: 20
      };
    }
    
    vm.handleStartSearch = () => {
      vm.page = 1;
      handleSearch();
    };
    function handleSearch() {
      if (vm.busy) return;
      vm.busy = true;
      ProductsApi.search(vm.condition, vm.page)
        .success(res => {
          vm.products = res.docs;
          vm.pages = CommonService.createArrayFromRange(res.pages);
          vm.total = res.total;
          vm.busy = false;
        })
        .error(err => {
          $scope.handleShowToast(err.message, true);
          vm.busy = false;
        });
    }
    vm.handleClearCondition = () => {
      prepareCondition();
    };
    vm.handlePageChanged = page => {
      vm.page = page;
      handleSearch();
    };
  }
}());
