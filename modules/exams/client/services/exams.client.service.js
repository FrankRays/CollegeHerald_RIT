'use strict';

//Exams service used for communicating with the exams REST endpoints
angular.module('exams').factory('Exams', ['$resource',
  function ($resource) {
    return $resource('api/exams/:examId', {
      examId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
