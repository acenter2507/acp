(function () {
  'use strict';

  angular
    .module('combos')
    .controller('ComboCheckController', ComboCheckController);

  ComboCheckController.$inject = ['$scope', '$timeout', 'CombosService', 'comboResolve', 'ProductsApi', 'ngDialog'];

  function ComboCheckController($scope, $timeout, CombosService, combo, ProductsApi, ngDialog) {
    var vm = this;

    vm.combo = combo;
    vm.form = {};

    vm.isChecking = true;

    prepareCheckData();
    function prepareCheckData() {
      vm.check = {
        dirty: false,
        checking: false,
        success: false,
        message: '',
        checkedProducts: [],
        duplicateProducts: [],
        uncheckProducts: _.clone(vm.combo.products),
        wrongSetProducts: []
      };
      validateProducts();
    }

    function validateProducts() {
      vm.combo.products.forEach(function (product) {
        if (_.findWhere(vm.check.uncheckProducts, { _id: product._id })) {
          product.result = 2;
        }
        if (_.findWhere(vm.check.checkedProducts, { _id: product._id })) {
          product.result = 1;
        }
        // if (_.findWhere(vm.check.duplicateProducts, { _id: product._id })) {
        //   product.result = 3;
        // }
      });
      if (!$scope.$$phase) $scope.$digest();
    }

    vm.handleInputCode = function () {
      vm.check.dirty = true;
      if (vm.check.checking) return;

      vm.check.checking = true;
      vm.check.message = '確認中...';

      var product = _.findWhere(vm.combo.products, { qr_code: vm.qr_code });
      // セットに追加されていない場合
      if (!product) {
        ProductsApi.getProductByQRCode(vm.qr_code)
          .success(function (_product) {
            vm.check.wrongSetProducts.push(_.clone(_product));
            vm.check.result = 3;
            handleCheckResult(_product);
          })
          .error(function (err) {
            $timeout(function () {
              vm.check.result = 4;
              handleCheckResult();
            }, 3000);
          });
      } else {
        // セットに追加されました
        // 重複チェック
        var duplicate_Product = _.findWhere(vm.check.checkedProducts, { _id: product._id });
        if (duplicate_Product) {
          vm.check.duplicateProducts.push(_.clone(product));
          vm.check.result = 2;
          handleCheckResult(product);
        } else {
          vm.check.checkedProducts.push(_.clone(product));
          vm.check.uncheckProducts = _.without(vm.check.uncheckProducts, product);
          vm.check.result = 1;
          handleCheckResult(product);
        }
      }

      function handleCheckResult(product) {
        // 1: ok - 2: duplicate - 3: notin - 4: not exists
        switch (vm.check.result) {
          case 1:
            vm.check.message = product.name + 'の製品を確認しました。！';
            break;
          case 2:
            vm.check.message = product.name + 'の製品は重複です。';
            break;
          case 3:
            vm.check.message = product.name + 'は現在のセットに追加されていない。';
            break;
          case 4:
            vm.check.message = 'コードが存在しません！';
            break;
        }
        vm.qr_code = '';
        vm.form.inputForm = {};
        vm.check.checking = false;
        validateProducts();
      }

    };
    vm.handleResetCheck = function () {
      if (!vm.isChecking) return;
      prepareCheckData();
      $timeout(function () {
        $('#qr_code').focus();
      }, 100);
    };
    vm.handleStopCheck = function () {
      vm.isChecking = false;
    };
    vm.handleStartCheck = function () {
      vm.isChecking = true;
      prepareCheckData();
      $timeout(function () {
        $('#qr_code').focus();
      }, 100);

    };
    vm.handleConfirmProduct = function (product) {
      if (!vm.isChecking) return;
      if (product.result !== 2) return;
      vm.check.checkedProducts.push(_.clone(product));
      handleCheckResult(product);
    };
    vm.handleShowProduct = function (product) {
      $scope.product = product;
      ngDialog.openConfirm({
        templateUrl: 'productViewTemplate.html',
        scope: $scope,
        showClose: false,
        width: 800
      }).then(function (res) {
        delete $scope.product;
      }, function (res) {
        delete $scope.product;
      });
    };
  }
}());
