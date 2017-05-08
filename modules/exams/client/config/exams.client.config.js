'use strict';

// Configuring the Exams module
angular.module('exams').run(['Menus',
  function (Menus) {
    // Add the exams dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Exams',
      state: 'exams',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'exams', {
      title: 'List Exams',
      state: 'exams.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'exams', {
      title: 'Create Exams',
      state: 'exams.create',
      roles: ['user']
    });
  }
]);
