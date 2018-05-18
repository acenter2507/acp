(function () {
  'use strict';

  angular
    .module('colors')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('colors', {
        abstract: true,
        url: '/colors',
        template: '<ui-view/>'
      })
      .state('colors.list', {
        url: '',
        templateUrl: 'modules/colors/client/views/list-colors.client.view.html',
        controller: 'ColorsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Colors List'
        }
      })
      .state('colors.create', {
        url: '/create',
        templateUrl: 'modules/colors/client/views/form-color.client.view.html',
        controller: 'ColorsController',
        controllerAs: 'vm',
        resolve: {
          colorResolve: newColor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Colors Create'
        }
      })
      .state('colors.edit', {
        url: '/:colorId/edit',
        templateUrl: 'modules/colors/client/views/form-color.client.view.html',
        controller: 'ColorsController',
        controllerAs: 'vm',
        resolve: {
          colorResolve: getColor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Color {{ colorResolve.name }}'
        }
      })
      .state('colors.view', {
        url: '/:colorId',
        templateUrl: 'modules/colors/client/views/view-color.client.view.html',
        controller: 'ColorsController',
        controllerAs: 'vm',
        resolve: {
          colorResolve: getColor
        },
        data: {
          pageTitle: 'Color {{ colorResolve.name }}'
        }
      });
  }

  getColor.$inject = ['$stateParams', 'ColorsService'];

  function getColor($stateParams, ColorsService) {
    return ColorsService.get({
      colorId: $stateParams.colorId
    }).$promise;
  }

  newColor.$inject = ['ColorsService'];

  function newColor(ColorsService) {
    return new ColorsService();
  }
}());
