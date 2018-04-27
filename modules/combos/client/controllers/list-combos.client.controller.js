(function () {
  'use strict';

  angular
    .module('combos')
    .controller('CombosListController', CombosListController);

  CombosListController.$inject = ['CombosService'];

  function CombosListController(CombosService) {
    var vm = this;

    vm.combos = CombosService.query();
  }
}());
