(function () {
  'use strict';

  // Combos controller
  angular
    .module('combos')
    .controller('ComboViewController', ComboViewController);

  ComboViewController.$inject = ['$scope', '$state', 'comboResolve'];

  function ComboViewController($scope, $state, combo) {
    var vm = this;

    vm.combo = combo;

    onCreate();
    function onCreate() {
      $scope.$on('$destroy', function () {
        angular.element('body').removeClass('open-combo-left-aside');
      });
    }

    // Remove existing Combo
    vm.handleDeleteCombo = function () {
      $scope.handleShowConfirm({
        message: vm.combo.name + 'を削除しますか？'
      }, () => {
        vm.combo.$remove(handlePreviousScreen());
      });
    };
    // Back to before state
    function handlePreviousScreen() {
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    vm.handleEndSearchProduct = function () {
      angular.element('body').removeClass('open-left-aside');
    };
    // Add new leader
    vm.handleStartSearchProduct = function () {
      angular.element('body').toggleClass('open-combo-left-aside');
    };
  }
}());
