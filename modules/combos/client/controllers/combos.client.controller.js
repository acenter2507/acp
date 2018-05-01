(function () {
  'use strict';

  // Combos controller
  angular
    .module('combos')
    .controller('CombosController', CombosController);

  CombosController.$inject = ['$scope', '$state', 'comboResolve'];

  function CombosController ($scope, $state, combo) {
    var vm = this;

    vm.combo = combo;
    vm.form = {};

    // Remove existing Combo
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.combo.$remove($state.go('combos.list'));
      }
    }

    // Save Combo
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.comboForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.combo._id) {
        vm.combo.$update(successCallback, errorCallback);
      } else {
        vm.combo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('combos.view', {
          comboId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
