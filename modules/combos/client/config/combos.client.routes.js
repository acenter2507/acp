(function () {
  'use strict';

  angular
    .module('combos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('combos', {
        abstract: true,
        url: '/combos',
        template: '<ui-view/>'
      })
      .state('combos.list', {
        url: '',
        templateUrl: 'modules/combos/client/views/list-combos.client.view.html',
        controller: 'CombosListController',
        controllerAs: 'vm'
      })
      .state('combos.create', {
        url: '/create',
        templateUrl: 'modules/combos/client/views/form-combo.client.view.html',
        controller: 'CombosController',
        controllerAs: 'vm',
        resolve: { comboResolve: newCombo }
      })
      .state('combos.edit', {
        url: '/:comboId/edit',
        templateUrl: 'modules/combos/client/views/form-combo.client.view.html',
        controller: 'CombosController',
        controllerAs: 'vm',
        resolve: { comboResolve: getCombo }
      })
      .state('combos.check', {
        url: '/:comboId/check',
        templateUrl: 'modules/combos/client/views/check-combo.client.view.html',
        controller: 'ComboCheckController',
        controllerAs: 'vm',
        resolve: { comboResolve: getCombo }
      })
      .state('combos.view', {
        url: '/:comboId',
        templateUrl: 'modules/combos/client/views/view-combo.client.view.html',
        controller: 'ComboViewController',
        controllerAs: 'vm',
        resolve: { comboResolve: getCombo }
      });
  }

  getCombo.$inject = ['$stateParams', 'CombosService'];

  function getCombo($stateParams, CombosService) {
    return CombosService.get({
      comboId: $stateParams.comboId
    }).$promise;
  }

  newCombo.$inject = ['CombosService'];

  function newCombo(CombosService) {
    return new CombosService();
  }
}());
