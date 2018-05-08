(function () {
  'use strict';

  angular
    .module('combos')
    .controller('ComboCheckController', ComboCheckController);

  ComboCheckController.$inject = ['CombosService', 'comboResolve', 'ProductsApi'];

  function ComboCheckController(CombosService, combo, ProductsApi) {
    var vm = this;

    vm.combo = combo;
    vm.form = {};

    vm.check = {
      dirty: false,
      checking: false,
      success: false,
      message: '',
      checkedProducts: [],
      duplicateProducts: [],
      uncheckProducts: vm.combo.products,
      wrongSetProducts: []
    };

    vm.handleInputCode = function () {
      vm.check.dirty = true;
      if (vm.check.checking) return;
      vm.check.checking = true;

      var product = _.findWhere(vm.combo.products, { qr_code: vm.qr_code });
      // セットに追加されていない場合
      if (!product) {
        ProductsApi.getProductByQRCode(vm.qr_code)
          .success(function (product) {
            vm.check.wrongSetProducts.push(product);
            vm.check.success = false;
            vm.check.checking = false;
            vm.check.message = product.name + 'は現在のセットに追加されていない。';
          })
          .error(function (err) {
            vm.check.success = false;
            vm.check.checking = false;
            vm.check.message = '入力された製品の情報がみつかりません！';
          });
      } else {
        // セットに追加されました
        // 重複チェック
        var duplicate_Product = _.findWhere(vm.check.checkedProducts, { _id: product._id });
        if (duplicate_Product) {
          vm.check.duplicateProducts.push(product);
          vm.check.success = false;
          vm.check.message = product.name + 'の製品は既にチェックされました。';
        } else {
          vm.check.checkedProducts.push(product);
          vm.check.uncheckProducts = _.without(vm.check.uncheckProducts, { _id: product._id });
          vm.check.success = true;
          vm.check.message = product.name + 'の製品はチェックされました。！';
        }
        vm.qr_code = '';
        vm.form.inputForm = {};
        vm.check.checking = false;
      }

    };


  }
}());
