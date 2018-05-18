(function () {
  'use strict';

  describe('Colors Route Tests', function () {
    // Initialize global variables
    var $scope,
      ColorsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ColorsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ColorsService = _ColorsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('colors');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/colors');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ColorsController,
          mockColor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('colors.view');
          $templateCache.put('modules/colors/client/views/view-color.client.view.html', '');

          // create mock Color
          mockColor = new ColorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Color Name'
          });

          // Initialize Controller
          ColorsController = $controller('ColorsController as vm', {
            $scope: $scope,
            colorResolve: mockColor
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:colorId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.colorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            colorId: 1
          })).toEqual('/colors/1');
        }));

        it('should attach an Color to the controller scope', function () {
          expect($scope.vm.color._id).toBe(mockColor._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/colors/client/views/view-color.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ColorsController,
          mockColor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('colors.create');
          $templateCache.put('modules/colors/client/views/form-color.client.view.html', '');

          // create mock Color
          mockColor = new ColorsService();

          // Initialize Controller
          ColorsController = $controller('ColorsController as vm', {
            $scope: $scope,
            colorResolve: mockColor
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.colorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/colors/create');
        }));

        it('should attach an Color to the controller scope', function () {
          expect($scope.vm.color._id).toBe(mockColor._id);
          expect($scope.vm.color._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/colors/client/views/form-color.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ColorsController,
          mockColor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('colors.edit');
          $templateCache.put('modules/colors/client/views/form-color.client.view.html', '');

          // create mock Color
          mockColor = new ColorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Color Name'
          });

          // Initialize Controller
          ColorsController = $controller('ColorsController as vm', {
            $scope: $scope,
            colorResolve: mockColor
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:colorId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.colorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            colorId: 1
          })).toEqual('/colors/1/edit');
        }));

        it('should attach an Color to the controller scope', function () {
          expect($scope.vm.color._id).toBe(mockColor._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/colors/client/views/form-color.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
