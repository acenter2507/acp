(function () {
  'use strict';

  // Combos controller
  angular
    .module('combos')
    .controller('ComboViewController', ComboViewController);

  ComboViewController.$inject = ['$scope', '$state', 'comboResolve'];

  function ComboViewController($scope, $state, combo) {
    var vm = this;

    vm.combo = combo;
    vm.form = {};

    onCreate();
    function onCreate() {
      // 画面チェック
      if (vm.combo._id) {
        vm.combo.datetime = (vm.combo.datetime) ? new Date(vm.combo.datetime) : vm.combo.datetime;
        vm.combo.sterilize_date = (vm.combo.sterilize_date) ? new Date(vm.combo.sterilize_date) : vm.combo.sterilize_date;
      }
    }

    vm.handleSaveCombo = function () {
      if (vm.combo._id) {
        vm.combo.$update(successCallback, errorCallback);
      } else {
        vm.combo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.combo.datetime = (vm.combo.datetime) ? new Date(vm.combo.datetime) : vm.combo.datetime;
        vm.combo.sterilize_date = (vm.combo.sterilize_date) ? new Date(vm.combo.sterilize_date) : vm.combo.sterilize_date;
        vm.busy = false;
        $state.go('combos.view', { comboId: res._id });
      }

      function errorCallback(res) {
        vm.busy = false;
        $scope.handleShowToast(res.data.message, true);
      }
    };
    // Remove existing Combo
    vm.handleDeleteCombo = function () {
      $scope.handleShowConfirm({
        message: vm.combo.name + 'を削除しますか？'
      }, () => {
        vm.combo.$remove(handlePreviousScreen());
      });
    };
    // Cancel
    vm.handleCancelInput = () => {
      $scope.handleShowConfirm({
        message: '操作を止めますか？'
      }, () => {
        handlePreviousScreen();
      });
    };
    // Back to before state
    function handlePreviousScreen() {
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }
  }
}());
