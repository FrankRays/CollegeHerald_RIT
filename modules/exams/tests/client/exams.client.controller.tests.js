'use strict';

(function () {
  // Exams Controller Spec
  describe('Exams Controller Tests', function () {
    // Initialize global variables
    var ExamsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Exams,
      mockExam;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Exams_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Exams = _Exams_;

      // create mock exam
      mockExam = new Exams({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Exam about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Exams controller.
      ExamsController = $controller('ExamsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one exam object fetched from XHR', inject(function (Exams) {
      // Create a sample exams array that includes the new exam
      var sampleExams = [mockExam];

      // Set GET response
      $httpBackend.expectGET('api/exams').respond(sampleExams);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.exams).toEqualData(sampleExams);
    }));

    it('$scope.findOne() should create an array with one exam object fetched from XHR using a examId URL parameter', inject(function (Exams) {
      // Set the URL parameter
      $stateParams.examId = mockExam._id;

      // Set GET response
      $httpBackend.expectGET(/api\/exams\/([0-9a-fA-F]{24})$/).respond(mockExam);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.exam).toEqualData(mockExam);
    }));

    describe('$scope.create()', function () {
      var sampleExamPostData;

      beforeEach(function () {
        // Create a sample exam object
        sampleExamPostData = new Exams({
          title: 'An Exam about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Exam about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Exams) {
        // Set POST response
        $httpBackend.expectPOST('api/exams', sampleExamPostData).respond(mockExam);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the exam was created
        expect($location.path.calls.mostRecent().args[0]).toBe('exams/' + mockExam._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/exams', sampleExamPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock exam in scope
        scope.exam = mockExam;
      });

      it('should update a valid exam', inject(function (Exams) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/exams\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/exams/' + mockExam._id);
      }));

      it('should set scope.error to error response message', inject(function (Exams) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/exams\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(exam)', function () {
      beforeEach(function () {
        // Create new exams array and include the exam
        scope.exams = [mockExam, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/exams\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockExam);
      });

      it('should send a DELETE request with a valid examId and remove the exam from the scope', inject(function (Exams) {
        expect(scope.exams.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.exam = mockExam;

        $httpBackend.expectDELETE(/api\/exams\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to exams', function () {
        expect($location.path).toHaveBeenCalledWith('exams');
      });
    });
  });
}());
