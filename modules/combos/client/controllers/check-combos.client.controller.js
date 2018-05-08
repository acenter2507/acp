(function () {
  'use strict';

  angular
    .module('combos')
    .controller('ComboCheckController', ComboCheckController);

  ComboCheckController.$inject = ['$scope', '$timeout', 'CombosService', 'comboResolve', 'ProductsApi'];

  function ComboCheckController($scope, $timeout, CombosService, combo, ProductsApi) {
    var vm = this;

    vm.combo = combo;
    vm.form = {};

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
      vm.combo.products.forEach(product => {
        if (_.findWhere(vm.check.uncheckProducts, { _id: product._id })) {
          product.result = 2;
        }
        if (_.findWhere(vm.check.checkedProducts, { _id: product._id })) {
          product.result = 1;
        }
        if (_.findWhere(vm.check.duplicateProducts, { _id: product._id })) {
          product.result = 3;
        }
      });
      if (!$scope.$$phase) $scope.$digest();
    }

    vm.handleInputCode = function () {
      vm.check.dirty = true;
      if (vm.check.checking) return;

      vm.check.checking = true;

      var product = _.findWhere(vm.combo.products, { qr_code: vm.qr_code });
      // セットに追加されていない場合
      if (!product) {
        ProductsApi.getProductByQRCode(vm.qr_code)
          .success(function (product) {
            vm.check.wrongSetProducts.push(_.clone(product));
            handleCheckResult(3);
          })
          .error(function (err) {
            $timeout(handleCheckResult(4), 5000);
          });
      } else {
        // セットに追加されました
        // 重複チェック
        var duplicate_Product = _.findWhere(vm.check.checkedProducts, { _id: product._id });
        if (duplicate_Product) {
          vm.check.duplicateProducts.push(product);
          handleCheckResult(2);
        } else {
          vm.check.checkedProducts.push(_.clone(product));
          vm.check.uncheckProducts = _.without(vm.check.uncheckProducts, product);
          handleCheckResult(1);
        }
      }

      function handleCheckResult(result) {
        // 1: ok - 2: duplicate - 3: notin - 4: not exists
        switch (result) {
          case 1:
            vm.check.success = true;
            vm.check.message = product.name + 'の製品を確認しました。！';
            break;
          case 2:
            vm.check.success = false;
            vm.check.message = product.name + 'の製品は重複です。';
            break;
          case 3:
            vm.check.success = false;
            vm.check.message = product.name + 'は現在のセットに追加されていない。';
            break;
          case 4:
            vm.check.success = false;
            vm.check.message = '入力された製品の情報がみつかりません！';
            break;
        }
        vm.qr_code = '';
        vm.form.inputForm = {};
        vm.check.checking = false;
        validateProducts();
      }

    };
    vm.handleReset = function () {
      prepareCheckData();
    };
  }
}());
