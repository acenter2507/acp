(function () {
  'use strict';

  // Colors controller
  angular
    .module('colors')
    .controller('ColorsController', ColorsController);

  ColorsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'colorResolve'];

  function ColorsController ($scope, $state, $window, Authentication, color) {
    var vm = this;

    vm.authentication = Authentication;
    vm.color = color;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Color
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.color.$remove($state.go('colors.list'));
      }
    }

    // Save Color
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.colorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.color._id) {
        vm.color.$update(successCallback, errorCallback);
      } else {
        vm.color.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('colors.view', {
          colorId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
