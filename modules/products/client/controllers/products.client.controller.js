(function () {
  'use strict';

  // Products controller
  angular
    .module('products')
    .controller('ProductsController', ProductsController);

  ProductsController.$inject = ['$timeout', '$window', '$scope', '$state', 'productResolve', 'FileUploader', 'ngDialog', 'CommonService'];

  function ProductsController($timeout, $window, $scope, $state, product, FileUploader, ngDialog, CommonService) {
    var vm = this;

    vm.product = product;
    vm.form = {};

    vm.busy = false;

    onCreate();
    function onCreate() {
      // 画面チェック
      if (vm.product._id) {
        vm.product.intro_date = (vm.product.intro_date) ? new Date(vm.product.intro_date) : vm.product.intro_date;
        vm.product.exchange_date = (vm.product.exchange_date) ? new Date(vm.product.exchange_date) : vm.product.exchange_date;
      } else {
        vm.product.image = './modules/core/client/img/brand/placeholder.png';
      }
      vm.imageUrl = vm.product.image;
      prepareUploader();
    }

    function prepareUploader() {
      vm.uploader = new FileUploader({
        url: 'api/products/image',
        alias: 'productImage'
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
        vm.product.image = response;
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
          vm.imageUrl = vm.product.image;
          delete $scope.sourceImageUrl;
          return;
        }
        var blob;
        if (res.value === 1) {
          vm.imageUrl = data;
          blob = CommonService.dataURItoBlob(data);
          vm.uploader.queue[0]._file = blob;
          vm.isGetAvatarFromFile = true;
          delete $scope.sourceImageUrl;
        } else {
          vm.imageUrl = res.value;
          blob = CommonService.dataURItoBlob(res.value);
          vm.uploader.queue[0]._file = blob;
          vm.isGetAvatarFromFile = true;
          delete $scope.sourceImageUrl;
        }
      });
    }
    // Save Product
    vm.handleStartSaveProduct = function (isValid) {
      if (vm.busy) return;
      vm.busy = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        vm.busy = false;
        return false;
      }
      if (vm.isGetAvatarFromFile) {
        vm.uploader.uploadAll();
      } else {
        product.image = vm.imageUrl;
        handleSaveProduct();
      }

    };
    // Cancel
    vm.handleCancelInput = function () {
      $scope.handleShowConfirm({
        message: '操作を止めますか？'
      }, function () {
        handlePreviousScreen();
      });
    };
    // Remove existing Product
    vm.handleDeleteProduct = function () {
      $scope.handleShowConfirm({
        message: vm.product.name + 'を削除しますか？'
      }, function () {
        vm.product.$remove(handlePreviousScreen());
      });
    };

    function handleSaveProduct() {

      if (vm.product._id) {
        vm.product.$update(successCallback, errorCallback);
      } else {
        vm.product.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.product.intro_date = (vm.product.intro_date) ? new Date(vm.product.intro_date) : vm.product.intro_date;
        vm.product.exchange_date = (vm.product.exchange_date) ? new Date(vm.product.exchange_date) : vm.product.exchange_date;
        vm.busy = false;
        $state.go('products.view', {
          productId: res._id
        });
      }

      function errorCallback(res) {
        vm.busy = false;
        $scope.handleShowToast(res.data.message, true);
      }
    }
    // Back to before state
    function handlePreviousScreen() {
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }
  }
}());
