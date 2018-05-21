(function () {
  'use strict';

  // Combos controller
  angular
    .module('combos')
    .controller('ComboViewController', ComboViewController);

  ComboViewController.$inject = ['$scope', '$state', '$timeout', 'comboResolve', 'ProductsApi', 'CombosApi', 'ngDialog'];

  function ComboViewController($scope, $state, $timeout, combo, ProductsApi, CombosApi, ngDialog) {
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
      }, function () {
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
      }, function () {
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
      }, function () {
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
      if (vm.combo.products.length === 0) return;
      $scope.handleShowConfirm({
        message: '全ての製品を削除しますか？'
      }, function () {
        CombosApi.clearProduct(vm.combo._id)
          .success(function () {
            vm.combo.products = [];
          })
          .error(function (err) {
            $scope.handleShowToast(err.message, true);
          });

      });
    };
    vm.handleCopyCombo = function () {
      CombosApi.copyCombo(vm.combo._id)
        .success(function (data) {
          $state.go('combos.view', { comboId: data._id });
        })
        .error(function (err) {
          $scope.handleShowToast(err.message, true);
        });
    };
    vm.handleShowProduct = function (product) {
      $scope.product = product;
      ngDialog.openConfirm({
        templateUrl: 'productViewTemplate.html',
        appendClassName: 'ngdialog-custom',
        scope: $scope,
        showClose: false,
        width: 800
      }).then(function (res) {
        delete $scope.product;
      }, function (res) {
        delete $scope.product;
      });
    };
    function handleSearchProducts() {
      if (vm.isSearching) return;
      vm.isSearching = true;
      vm.searchResult = [];
      ProductsApi.quickSearch({ key: vm.searchKey, department: true })
        .success(function (products) {
          vm.searchResult = products;
          vm.isSearching = false;
          if (!$scope.$$phase) $scope.$digest();
        })
        .error(function (err) {
          $scope.handleShowToast(err.message, true);
          vm.isSearching = false;
        });
    }
  }
}());
