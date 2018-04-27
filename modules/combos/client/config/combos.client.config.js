(function () {
  'use strict';

  angular
    .module('combos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Combos',
      state: 'combos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'combos', {
      title: 'List Combos',
      state: 'combos.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'combos', {
      title: 'Create Combo',
      state: 'combos.create',
      roles: ['user']
    });
  }
}());
