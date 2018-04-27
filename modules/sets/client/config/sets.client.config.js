(function () {
  'use strict';

  angular
    .module('sets')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Sets',
      state: 'sets',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'sets', {
      title: 'List Sets',
      state: 'sets.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sets', {
      title: 'Create Set',
      state: 'sets.create',
      roles: ['user']
    });
  }
}());
