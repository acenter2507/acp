'use strict';

describe('Sets E2E Tests:', function () {
  describe('Test Sets page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sets');
      expect(element.all(by.repeater('set in sets')).count()).toEqual(0);
    });
  });
});
