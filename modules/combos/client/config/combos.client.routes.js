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
        controllerAs: 'vm',
        data: {
          pageTitle: 'Combos List'
        }
      })
      .state('combos.create', {
        url: '/create',
        templateUrl: 'modules/combos/client/views/form-combo.client.view.html',
        controller: 'CombosController',
        controllerAs: 'vm',
        resolve: {
          comboResolve: newCombo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Combos Create'
        }
      })
      .state('combos.edit', {
        url: '/:comboId/edit',
        templateUrl: 'modules/combos/client/views/form-combo.client.view.html',
        controller: 'CombosController',
        controllerAs: 'vm',
        resolve: {
          comboResolve: getCombo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Combo {{ comboResolve.name }}'
        }
      })
      .state('combos.view', {
        url: '/:comboId',
        templateUrl: 'modules/combos/client/views/view-combo.client.view.html',
        controller: 'CombosController',
        controllerAs: 'vm',
        resolve: {
          comboResolve: getCombo
        },
        data: {
          pageTitle: 'Combo {{ comboResolve.name }}'
        }
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
