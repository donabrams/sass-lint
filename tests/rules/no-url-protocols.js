'use strict';

var lint = require('./_lint');

describe('no url protocols - scss', function () {
  var file = lint.file('no-url-protocols.scss');

  it('enforce', function (done) {
    lint.test(file, {
      'no-url-protocols': 1
    }, function (data) {
      lint.assert.equal(3, data.warningCount);
      done();
    });
  });
});

describe('no url protocols - sass', function () {
  var file = lint.file('no-url-protocols.sass');

  it('enforce', function (done) {
    lint.test(file, {
      'no-url-protocols': 1
    }, function (data) {
      lint.assert.equal(3, data.warningCount);
      done();
    });
  });
});
