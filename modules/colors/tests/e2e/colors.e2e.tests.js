'use strict';

describe('Colors E2E Tests:', function () {
  describe('Test Colors page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/colors');
      expect(element.all(by.repeater('color in colors')).count()).toEqual(0);
    });
  });
});
