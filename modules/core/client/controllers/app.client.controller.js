'use strict';

angular.module('core').controller('AppController', AppController);

AppController.$inject = ['$scope', 'toastr', 'ngDialog', '$timeout', 'Socket'];

function AppController($scope, toastr, ngDialog, $timeout, Socket) {

  prepareScopeListener();
  // prepareDeviceChecking();

  function prepareScopeListener() {
    // Listen webapp state change
    $scope.$on('$stateChangeSuccess', function () {
      if (angular.element('body').hasClass('aside-menu-show')) {
        angular.element('body').removeClass('aside-menu-show');
      }
    });
  }
  // Init socket
  function prepareSocketListener() {
    if (!Socket.socket) {
      Socket.connect();
    }
    Socket.emit('init');
  }
  // function prepareDeviceChecking() {
  //   var parser = new UAParser();
  //   var result = parser.getResult();
  //   $scope.isMobile = result.device && (result.device.type === 'tablet' || result.device.type === 'mobile');
  // }
  /**
   * HANDLES
   */
  // Hiển thị thông báo bình thường
  $scope.handleShowToast = function (msg, error) {
    if (error)
      return toastr.error(msg, 'エラー');
    return toastr.success(msg, '完了');
  };
  // Hiển thị confirm xác nhận
  $scope.handleShowConfirm = function (content, resolve, reject) {
    $scope.dialog = content;
    ngDialog.openConfirm({
      templateUrl: 'confirmTemplate.html',
      scope: $scope
    }).then(function(res) {
      delete $scope.dialog;
      if (resolve) {
        resolve(res);
      }
    }, function(res) {
      delete $scope.dialog;
      if (reject) {
        reject(res);
      }
    });
  };
  // Hiển thị confirm xác nhận
  $scope.handleShowImage = function (url) {
    $scope.url = url;
    ngDialog.openConfirm({
      templateUrl: 'imageTemplate.html',
      scope: $scope,
      appendClassName: 'ngdialog-image',
      showClose: false,
      width: 800
    }).then(function(res) {
      delete $scope.url;
    }, function(res) {
      delete $scope.url;
    });
  };
}