(function () {
  'use strict';

  // Products controller
  angular
    .module('products')
    .controller('ProductsController', ProductsController);

  ProductsController.$inject = ['$window', '$scope', '$state', 'productResolve', 'FileUploader', 'ngDialog'];

  function ProductsController($window, $scope, $state, product, FileUploader, ngDialog) {
    var vm = this;

    vm.product = product;
    vm.form = {};

    vm.busy = false;

    onCreate();
    function onCreate() {
      vm.imageUrl = vm.product.avatar || './modules/products/client/img/placeholder.png';
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
    }

    // Called after the user selected a new picture file
    vm.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            // $scope.imageURL = fileReaderEvent.target.result;
            handleCropImage(fileReaderEvent.target.result);
          }, 0);
        };
      }
    };
    // Called after the user has successfully uploaded a new picture
    vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      vm.product.avatar = response;
      handleSaveProduct();
      vm.cancelUpload();
    };
    // Called after the user has failed to uploaded a new picture
    vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
      vm.busy = false;
      $scope.handleShowToast(response, true);
      // Clear upload buttons
      vm.cancelUpload();
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
        if (!res.value) return;
        vm.imageUrl = res.value;
        var blob = dataURItoBlob(res.value);
        vm.uploader.queue[0]._file = blob;
        delete $scope.sourceImageUrl;
        vm.isGetAvatarFromFile = true;
      });
    }
    // Cancel the upload process
    vm.cancelUpload = function () {
      vm.uploader.clearQueue();
    };

    // Save Department
    vm.handleStartSaveProduct = function (isValid) {
      if (vm.busy) return;
      vm.busy = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        vm.busy = false;
        return false;
      }
      vm.uploader.uploadAll();
      if (vm.isGetAvatarFromFile) {
        vm.uploader.uploadAll();
      } else {
        handleSaveDepartment();
      }

    };
    
    function handleSaveProduct() {
      if (vm.product._id) {
        vm.product.$update(successCallback, errorCallback);
      } else {
        vm.product.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
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
  }
}());
