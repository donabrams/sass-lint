'use strict';

var helpers = require('../helpers');

module.exports = {
  'name': 'one-declaration-per-line',
  'defaults': {},
  'detect': function (ast, parser) {
    var result = [],
        lastLine = {};

    ast.traverseByType('declaration', function (declaration) {
      if (declaration.start.line === lastLine.start || declaration.start.line === lastLine.end) {
        result = helpers.addUnique(result, {
          'ruleId': parser.rule.name,
          'line': declaration.start.line,
          'column': declaration.start.column,
          'message': 'Only one declaration allowed per line',
          'severity': parser.severity
        });
      }

      lastLine.start = declaration.start.line;
      lastLine.end = declaration.end.line;
    });

    return result;
  }
};
