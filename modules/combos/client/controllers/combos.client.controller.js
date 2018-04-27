(function () {
  'use strict';

  // Combos controller
  angular
    .module('combos')
    .controller('CombosController', CombosController);

  CombosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'comboResolve'];

  function CombosController ($scope, $state, $window, Authentication, combo) {
    var vm = this;

    vm.authentication = Authentication;
    vm.combo = combo;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
