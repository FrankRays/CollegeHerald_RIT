'use strict';

describe('Exams E2E Tests:', function () {
  describe('Test exams page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/exams');
      expect(element.all(by.repeater('exam in exams')).count()).toEqual(0);
    });
  });
});
