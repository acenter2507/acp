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
        limit: 50
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

    vm.handleClearCondition = function () {
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
    vm.handleDeleteProducts = function () {
      var products = _.where(vm.products, { isChecked: true });
      if (products.length === 0) return;
      $scope.handleShowConfirm({
        message: '選択した製品をすべて削除しますか？'
      }, () => {
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
    vm.handleDeleteProduct = function (product) {
      $scope.handleShowConfirm({
        message: product.name + 'を削除しますか？'
      }, () => {
        var rs_product = new ProductsService({ _id: product._id });
        rs_product.$remove(function () {
          vm.products = _.without(vm.products, product);
        });
      });
    };
    vm.handleCheckedAll = function () {
      vm.products.forEach(function (p) { p.isChecked = vm.checkedAll; });
    };
  }
}());
