'use strict';

var lint = require('./_lint');

describe('mixins before declarations - scss', function () {
  var file = lint.file('mixins-before-declarations.scss');

  it('scss - enforce', function (done) {
    lint.test(file, {
      'mixins-before-declarations': 1
    }, function (data) {
      lint.assert.equal(5, data.warningCount);
      done();
    });
  });

  it('scss - [excludes]', function (done) {
    lint.test(file, {
      'mixins-before-declarations': [
        1,
        {
          'exclude': [
            'test-again',
            'waldo',
            'mq',
            'breakpoint'
          ]
        }
      ]
    }, function (data) {
      lint.assert.equal(0, data.warningCount);
      done();
    });
  });
});

describe('mixins before declarations - sass', function () {
  var file = lint.file('mixins-before-declarations.sass');

  it('enforce', function (done) {
    lint.test(file, {
      'mixins-before-declarations': 1
    }, function (data) {
      lint.assert.equal(5, data.warningCount);
      done();
    });
  });

  it('[excludes]', function (done) {
    lint.test(file, {
      'mixins-before-declarations': [
        1,
        {
          'exclude': [
            'test-again',
            'waldo',
            'mq',
            'breakpoint'
          ]
        }
      ]
    }, function (data) {
      lint.assert.equal(0, data.warningCount);
      done();
    });
  });
});
