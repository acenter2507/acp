(function () {
  'use strict';

  // Combos controller
  angular
    .module('combos')
    .controller('CombosController', CombosController);

  CombosController.$inject = ['$scope', '$state', 'comboResolve', 'ColorsService', 'FileUploader'];

  function CombosController($scope, $state, combo, ColorsService, FileUploader) {
    var vm = this;

    vm.combo = combo;
    vm.colors = ColorsService.query();
    vm.form = {};

    onCreate();
    function onCreate() {
      // 画面チェック
      if (vm.combo._id) {
        vm.combo.datetime = (vm.combo.datetime) ? new Date(vm.combo.datetime) : vm.combo.datetime;
        vm.combo.sterilize_date = (vm.combo.sterilize_date) ? new Date(vm.combo.sterilize_date) : vm.combo.sterilize_date;
      }
      prepareUploader();
    }

    function prepareUploader() {
      vm.uploader = new FileUploader({
        url: 'api/combos/image',
        alias: 'comboImage'
      });
      vm.uploader.filters.push({
        name: 'imageFilter',
        fn: function (item, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      });
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
      }, function () {
        vm.combo.$remove(handlePreviousScreen());
      });
    };
    // Cancel
    vm.handleCancelInput = function () {
      $scope.handleShowConfirm({
        message: '操作を止めますか？'
      }, function () {
        handlePreviousScreen();
      });
    };
    // Back to before state
    function handlePreviousScreen() {
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }
  }
}());
