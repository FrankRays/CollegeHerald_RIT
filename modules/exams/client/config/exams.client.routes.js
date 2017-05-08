'use strict';

// Setting up route
angular.module('exams').config(['$stateProvider',
  function ($stateProvider) {
    // Exams state routing
    $stateProvider
      .state('exams', {
        abstract: true,
        url: '/exams',
        template: '<ui-view/>'
      })
      .state('exams.list', {
        url: '',
        templateUrl: 'modules/exams/client/views/list-exams.client.view.html'
      })
      .state('exams.create', {
        url: '/create',
        templateUrl: 'modules/exams/client/views/create-exam.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('exams.view', {
        url: '/:examId',
        templateUrl: 'modules/exams/client/views/view-exam.client.view.html'
      })
      .state('exams.edit', {
        url: '/:examId/edit',
        templateUrl: 'modules/exams/client/views/edit-exam.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
