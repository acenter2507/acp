(function () {
  'use strict';

  describe('Colors List Controller Tests', function () {
    // Initialize global variables
    var ColorsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ColorsService,
      mockColor;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ColorsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ColorsService = _ColorsService_;

      // create mock article
      mockColor = new ColorsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Color Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Colors List controller.
      ColorsListController = $controller('ColorsListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockColorList;

      beforeEach(function () {
        mockColorList = [mockColor, mockColor];
      });

      it('should send a GET request and return all Colors', inject(function (ColorsService) {
        // Set POST response
        $httpBackend.expectGET('api/colors').respond(mockColorList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.colors.length).toEqual(2);
        expect($scope.vm.colors[0]).toEqual(mockColor);
        expect($scope.vm.colors[1]).toEqual(mockColor);

      }));
    });
  });
}());
