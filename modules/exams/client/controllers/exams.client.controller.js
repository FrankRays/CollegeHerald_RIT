'use strict';

// Exams controller
angular.module('exams').controller('ExamsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Exams',
  function ($scope, $stateParams, $location, Authentication, Exams) {
    $scope.authentication = Authentication;

    // Create new Exam
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'examForm');

        return false;
      }

      // Create new Exam object
      var exam = new Exams({
        ExamName: this.ExamName,
        ExamType: this.ExamType,
        content: this.content
      });

      // Redirect after save
      exam.$save(function (response) {
        $location.path('exams/' + response._id);

        // Clear form fields
        $scope.ExamName = '';
        $scope.ExamType = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Exam
    $scope.remove = function (exam) {
      if (exam) {
        exam.$remove();

        for (var i in $scope.exams) {
          if ($scope.exams[i] === exam) {
            $scope.exams.splice(i, 1);
          }
        }
      } else {
        $scope.exam.$remove(function () {
          $location.path('exams');
        });
      }
    };

    // Update existing Exam
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'examForm');

        return false;
      }

      var exam = $scope.exam;

      exam.$update(function () {
        $location.path('exams/' + exam._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Exams
    $scope.find = function () {
      $scope.exams = Exams.query();
    };

    // Find existing Exam
    $scope.findOne = function () {
      $scope.exam = Exams.get({
        examId: $stateParams.examId
      });
    };
  }
]);
