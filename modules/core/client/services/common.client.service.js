'use strict';

angular.module('core').factory('CommonService', CommonService);

CommonService.$inject = [];
function CommonService() {
  this.isAdmin = function (roles) {
    return _.contains(roles, 'admin');
  };
  this.isManager = function (roles) {
    return _.contains(roles, 'manager');
  };
  this.isAccountant = function (roles) {
    return _.contains(roles, 'accountant') && roles.length === 2;
  };
  this.isMember = function (roles) {
    return roles.length === 1;
  };
  this.createArrayFromRange = function (range) {
    var array = [];
    for (var i = 1; i <= range; i++) {
      array.push(i);
    }
    return array;
  };
  this.comapreTwoArrays = function (arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var index = 0; index < arr1.length; index++) {
      var element = arr1[index];
      if (!_.contains(arr2, element)) {
        return false;
      }
    }
    return true;
  };
  this.isStringEmpty = function (str) {
    if (!str || str === '') {
      return true;
    }
    return false;
  };
  // Change image from URI to blob
  this.dataURItoBlob = function (dataURI) {
    if (!dataURI) return;
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mimeString });
  };
  return this;
}
