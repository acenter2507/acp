(function () {
  'use strict';

  angular
    .module('combos')
    .controller('ComboCheckController', ComboCheckController);

  ComboCheckController.$inject = ['CombosService', 'comboResolve'];

  function ComboCheckController(CombosService, combo) {
    var vm = this;

    vm.combo = combo;
    vm.form = {};

    vm.isChecking = false;
    vm.checkedProducts = 0;
    vm.uncheckProducts = 0;
    vm.wrongSetProducts = 0;

    vm.handleInputCode = function() {
      console.log(vm.inputCode);
    };

    
  }
}());
