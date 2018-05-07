(function () {
  'use strict';

  // Combos controller
  angular
    .module('combos')
    .controller('ComboViewController', ComboViewController);

  ComboViewController.$inject = ['$scope', '$state', '$timeout', 'comboResolve', 'ProductsApi'];

  function ComboViewController($scope, $state, $timeout, combo, ProductsApi) {
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
    function handleSearchProducts() {
      if (vm.isSearching) return;
      vm.isSearching = true;
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
