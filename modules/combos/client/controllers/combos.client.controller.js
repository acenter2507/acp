(function () {
  'use strict';

  // Combos controller
  angular
    .module('combos')
    .controller('CombosController', CombosController);

  CombosController.$inject = ['$timeout', '$scope', '$state', 'comboResolve', 'ColorsService', 'FileUploader', '$window'];

  function CombosController($timeout, $scope, $state, combo, ColorsService, FileUploader, $window) {
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
      } else {
        vm.combo.image = './modules/core/client/img/brand/placeholder.png';
      }
      vm.imageUrl = vm.combo.image;
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
      // Called after the user selected a new picture file
      vm.uploader.onAfterAddingFile = function (fileItem) {
        if ($window.FileReader) {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(fileItem._file);

          fileReader.onload = function (fileReaderEvent) {
            $timeout(function () {
              handleCropImage(fileReaderEvent.target.result);
            }, 0);
          };
        }
      };
      // Called after the user has successfully uploaded a new picture
      vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
        vm.combo.image = response;
        handleSaveProduct();
        vm.uploader.clearQueue();
      };
      // Called after the user has failed to uploaded a new picture
      vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
        vm.busy = false;
        $scope.handleShowToast(response, true);
        vm.uploader.clearQueue();
      };
    }
    // Cancel the upload process
    vm.cancelUpload = function () {
      vm.uploader.clearQueue();
    };

    // Change user profile picture
    function handleCropImage(data) {
      $scope.sourceImageUrl = data;
      $scope.desImageUrl = {};
      var mDialog = ngDialog.open({
        template: 'modules/core/client/views/templates/crop-image.dialog.template.html',
        scope: $scope
      });
      mDialog.closePromise.then(function (res) {
        if (!res.value || res.value === '$document') {
          vm.uploader.clearQueue();
          vm.imageUrl = vm.combo.image;
          delete $scope.sourceImageUrl;
          return;
        }
        var blob;
        if (res.value === 1) {
          vm.imageUrl = data;
          blob = dataURItoBlob(data);
          vm.uploader.queue[0]._file = blob;
          vm.isGetAvatarFromFile = true;
          delete $scope.sourceImageUrl;
        } else {
          vm.imageUrl = res.value;
          blob = dataURItoBlob(res.value);
          vm.uploader.queue[0]._file = blob;
          vm.isGetAvatarFromFile = true;
          delete $scope.sourceImageUrl;
        }
      });
    }

    vm.handleStartSaveCombo = function () {
      if (vm.busy) return;
      vm.busy = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.comboForm');
        vm.busy = false;
        return false;
      }
      if (vm.isGetAvatarFromFile) {
        vm.uploader.uploadAll();
      } else {
        combo.image = vm.imageUrl;
        handleSaveCombo();
      }

    };
    function handleSaveCombo() {
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
    }

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
