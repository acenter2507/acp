(function () {
  'use strict';

  angular
    .module('sets')
    .controller('SetsListController', SetsListController);

  SetsListController.$inject = ['SetsService'];

  function SetsListController(SetsService) {
    var vm = this;

    vm.sets = SetsService.query();
  }
}());
