(function () {
  'use strict';

  // Sets controller
  angular
    .module('sets')
    .controller('SetsController', SetsController);

  SetsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'setResolve'];

  function SetsController ($scope, $state, $window, Authentication, set) {
    var vm = this;

    vm.authentication = Authentication;
    vm.set = set;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Set
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.set.$remove($state.go('sets.list'));
      }
    }

    // Save Set
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.setForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.set._id) {
        vm.set.$update(successCallback, errorCallback);
      } else {
        vm.set.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sets.view', {
          setId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
