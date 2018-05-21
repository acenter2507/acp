(function () {
  'use strict';

  angular
    .module('combos')
    .controller('CombosListController', CombosListController);

  CombosListController.$inject = ['$scope', '$state', 'CombosService', 'CombosApi', 'CommonService'];

  function CombosListController($scope, $state, CombosService, CombosApi, CommonService) {
    var vm = this;

    vm.combos = [];
    vm.condition = {};

    vm.busy = false;
    vm.page = 1;
    vm.pages = [];
    vm.total = 0;

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
      CombosApi.search(vm.condition, vm.page)
        .success(function (res) {
          vm.combos = res.docs;
          vm.pages = CommonService.createArrayFromRange(res.pages);
          vm.total = res.total;
          vm.busy = false;
        })
        .error(function (err) {
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
        vm.combos.forEach(function (p) { p.isChecked = false; });
      }
    };
    vm.handleDeleteCombos = function () {
      var combos = _.where(vm.combos, { isChecked: true });
      if (combos.length === 0) return;
      $scope.handleShowConfirm({
        message: '選択したセットをすべて削除しますか？'
      }, function () {
        var comboIds = _.pluck(combos, '_id');
        CombosApi.removeAll(comboIds)
          .success(function (data) {
            combos.forEach(function (p) { vm.combos = _.without(vm.combos, p); });
            vm.isSelecting = false;
            vm.checkedAll = false;
          })
          .error(function (err) {
            $scope.handleShowToast(err.message, true);
          });
      });
    };
    vm.handleDeleteCombo = function (combo) {
      $scope.handleShowConfirm({
        message: combo.name + 'を削除しますか？'
      }, function () {
        var rs_combo = new CombosService({ _id: combo._id });
        rs_combo.$remove(function () {
          vm.combos = _.without(vm.combos, combo);
        });
      });
    };
    vm.handleCopyCombo = function (combo) {
      CombosApi.copyCombo(combo._id)
        .success(function (data) {
          $state.go('combos.view', { comboId: data._id });
        })
        .error(function (err) {
          $scope.handleShowToast(err.message, true);
        });
    };
    vm.handleCheckedAll = function () {
      vm.combos.forEach(function (p) { p.isChecked = vm.checkedAll; });
    };
  }
}());
