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

    // Start function
    prepareCondition();
    handleSearch();

    function prepareCondition() {
      vm.condition = {
        sort: '-created',
        limit: 20
      };
    }

    vm.handleStartSearch = function () {
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

    vm.handleClearCondition = function() {
      prepareCondition();
    };

    vm.handlePageChanged = function (page) {
      vm.page = page;
      handleSearch();
    };

    vm.isSelecting = false;
    vm.checkedAll = false;
    vm.handleStartSelectRow = function () {
      vm.isSelecting = !vm.isSelecting;

      if (!vm.isSelecting) {
        vm.products.forEach(function (p) { p.isChecked = false; });
      }
    };
    vm.handleStartDeleteProducts = function () {
      $scope.handleShowConfirm({
        message: '選択した製品をすべて削除しますか？'
      }, () => {
        var products = _.where(vm.products, { isChecked: true });
        var productIds = _.pluck(products, '_id');
        ProductsApi.removeAll(productIds)
          .success(data => {
            products.forEach(function (p) { vm.products = _.without(vm.products, p); });
          })
          .error(err => {
            $scope.handleShowToast(err.message, true);
          });
      });
    };
    vm.handleCheckedAll = function () {
      vm.products.forEach(function (p) { p.isChecked = vm.checkedAll; });
    };
  }
}());
