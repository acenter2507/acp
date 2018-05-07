(function () {
  'use strict';

  // Combos controller
  angular
    .module('combos')
    .controller('ComboViewController', ComboViewController);

  ComboViewController.$inject = ['$scope', '$state', '$timeout', 'comboResolve', 'ProductsApi', 'CombosApi'];

  function ComboViewController($scope, $state, $timeout, combo, ProductsApi, CombosApi) {
    var vm = this;

    vm.combo = combo;

    vm.isSearching = false;
    vm.searchKey = '';
    vm.searchResult = [];

    onCreate();
    function onCreate() {
      $scope.$on('$destroy', function () {
        angular.element('body').removeClass('open-combo-left-aside');
      });
    }

    // Remove existing Combo
    vm.handleDeleteCombo = function () {
      $scope.handleShowConfirm({
        message: vm.combo.name + 'を削除しますか？'
      }, () => {
        vm.combo.$remove(handlePreviousScreen());
      });
    };
    // Back to before state
    function handlePreviousScreen() {
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    vm.handleEndSearchProduct = function () {
      angular.element('body').removeClass('open-combo-left-aside');
    };
    // Add new leader
    vm.handleStartSearchProduct = function () {
      angular.element('body').toggleClass('open-combo-left-aside');
    };
    vm.handleSearchChanged = function () {
      if (vm.searchKey === '') return;
      if (vm.searchTimer) {
        $timeout.cancel(vm.searchTimer);
        vm.searchTimer = undefined;
      }
      vm.searchTimer = $timeout(handleSearchProducts, 500);
    };
    // Add a product to combo
    vm.handleAddProductToCombo = function (product) {
      var checkObj = _.findWhere(vm.combo.products, { _id: product._id });
      if (checkObj) {
        $scope.handleShowToast(product.name + 'の製品が既にこのセットに入っています！', true);
        return;
      }
      $scope.handleShowConfirm({
        message: product.name + 'を' + vm.combo.name + 'に追加しますか？'
      }, () => {
        CombosApi.addProduct(vm.combo._id, product._id)
          .success(function () {
            vm.combo.products.push(product);
            vm.searchResult = _.without(vm.searchResult, product);
            if (!$scope.$$phase) $scope.$digest();
          })
          .error(function (err) {
            $scope.handleShowToast(err.message, true);
          });
      });
    };
    // Remove product from combo
    vm.handleRemoveProductFromCombo = function (product) {
      $scope.handleShowConfirm({
        message: product.name + 'をセットから削除しますか？'
      }, () => {
        CombosApi.removeProduct(vm.combo._id, product._id)
          .success(function () {
            vm.combo.products = _.without(vm.combo.products, product);
          })
          .error(function (err) {
            $scope.handleShowToast(err.message, true);
          });
      });
    };
    vm.handleClearProduct = function () {
      $scope.handleShowConfirm({
        message: '全ての製品を削除しますか？'
      }, () => {
        CombosApi.clearProduct(vm.combo._id)
        .success(function () {
          vm.combo.products = [];
        })
        .error(function (err) {
          $scope.handleShowToast(err.message, true);
        });

      });
    };
    function handleSearchProducts() {
      if (vm.isSearching) return;
      vm.isSearching = true;
      vm.searchResult = [];
      ProductsApi.quickSearch({ key: vm.searchKey, department: true })
        .success(products => {
          vm.searchResult = products;
          vm.isSearching = false;
          if (!$scope.$$phase) $scope.$digest();
        })
        .error(err => {
          $scope.handleShowToast(err.message, true);
          vm.isSearching = false;
        });
    }
  }
}());
