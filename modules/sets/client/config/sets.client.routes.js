(function () {
  'use strict';

  angular
    .module('sets')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sets', {
        abstract: true,
        url: '/sets',
        template: '<ui-view/>'
      })
      .state('sets.list', {
        url: '',
        templateUrl: 'modules/sets/client/views/list-sets.client.view.html',
        controller: 'SetsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sets List'
        }
      })
      .state('sets.create', {
        url: '/create',
        templateUrl: 'modules/sets/client/views/form-set.client.view.html',
        controller: 'SetsController',
        controllerAs: 'vm',
        resolve: {
          setResolve: newSet
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sets Create'
        }
      })
      .state('sets.edit', {
        url: '/:setId/edit',
        templateUrl: 'modules/sets/client/views/form-set.client.view.html',
        controller: 'SetsController',
        controllerAs: 'vm',
        resolve: {
          setResolve: getSet
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Set {{ setResolve.name }}'
        }
      })
      .state('sets.view', {
        url: '/:setId',
        templateUrl: 'modules/sets/client/views/view-set.client.view.html',
        controller: 'SetsController',
        controllerAs: 'vm',
        resolve: {
          setResolve: getSet
        },
        data: {
          pageTitle: 'Set {{ setResolve.name }}'
        }
      });
  }

  getSet.$inject = ['$stateParams', 'SetsService'];

  function getSet($stateParams, SetsService) {
    return SetsService.get({
      setId: $stateParams.setId
    }).$promise;
  }

  newSet.$inject = ['SetsService'];

  function newSet(SetsService) {
    return new SetsService();
  }
}());
