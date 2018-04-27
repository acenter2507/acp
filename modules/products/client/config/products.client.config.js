(function () {
  'use strict';

  angular
    .module('products')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: '製品管理',
      state: 'products',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'products', {
      title: '製品一覧',
      state: 'products.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'products', {
      title: '製品登録',
      state: 'products.create',
      roles: ['*']
    });
  }
}());
