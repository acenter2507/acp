(function () {
  'use strict';

  angular
    .module('colors')
    .controller('ColorsListController', ColorsListController);

  ColorsListController.$inject = ['ColorsService'];

  function ColorsListController(ColorsService) {
    var vm = this;

    vm.colors = ColorsService.query();
  }
}());
