(function () {
  'use strict';

  angular
    .module('combos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'セット管理',
      state: 'combos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'combos', {
      title: 'セット一覧',
      state: 'combos.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'combos', {
      title: 'セット作成',
      state: 'combos.create',
      roles: ['*']
    });

    // Add the dropdown search item
    menuService.addSubMenuItem('topbar', 'combos', {
      title: 'セット確認',
      state: 'combos.check',
      roles: ['*']
    });
  }
}());
