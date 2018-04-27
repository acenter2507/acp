(function () {
  'use strict';

  angular
    .module('combos')
    .controller('ComboCheckController', ComboCheckController);

  ComboCheckController.$inject = ['CombosService'];

  function ComboCheckController(CombosService) {
    var vm = this;

    vm.combos = CombosService.query();
  }
}());
