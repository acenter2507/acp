(function () {
  'use strict';

  describe('Sets Route Tests', function () {
    // Initialize global variables
    var $scope,
      SetsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SetsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SetsService = _SetsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sets');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sets');
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
          SetsController,
          mockSet;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sets.view');
          $templateCache.put('modules/sets/client/views/view-set.client.view.html', '');

          // create mock Set
          mockSet = new SetsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Set Name'
          });

          // Initialize Controller
          SetsController = $controller('SetsController as vm', {
            $scope: $scope,
            setResolve: mockSet
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:setId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.setResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            setId: 1
          })).toEqual('/sets/1');
        }));

        it('should attach an Set to the controller scope', function () {
          expect($scope.vm.set._id).toBe(mockSet._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sets/client/views/view-set.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SetsController,
          mockSet;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sets.create');
          $templateCache.put('modules/sets/client/views/form-set.client.view.html', '');

          // create mock Set
          mockSet = new SetsService();

          // Initialize Controller
          SetsController = $controller('SetsController as vm', {
            $scope: $scope,
            setResolve: mockSet
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.setResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sets/create');
        }));

        it('should attach an Set to the controller scope', function () {
          expect($scope.vm.set._id).toBe(mockSet._id);
          expect($scope.vm.set._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sets/client/views/form-set.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SetsController,
          mockSet;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sets.edit');
          $templateCache.put('modules/sets/client/views/form-set.client.view.html', '');

          // create mock Set
          mockSet = new SetsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Set Name'
          });

          // Initialize Controller
          SetsController = $controller('SetsController as vm', {
            $scope: $scope,
            setResolve: mockSet
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:setId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.setResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            setId: 1
          })).toEqual('/sets/1/edit');
        }));

        it('should attach an Set to the controller scope', function () {
          expect($scope.vm.set._id).toBe(mockSet._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sets/client/views/form-set.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
