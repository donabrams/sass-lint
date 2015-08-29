'use strict';

var helpers = require('../helpers');

module.exports = {
  'name': 'space-before-colon',
  'defaults': {
    'include': false
  },
  'detect': function (ast, parser) {
    var result = [];

    ast.traverseByType('propertyDelimiter', function (delimiter, i, parent) {
      var previous = parent.content[i - 1];

      if (previous.is('space')) {
        if (!parser.options.include) {
          result = helpers.addUnique(result, {
            'ruleId': parser.rule.name,
            'line': previous.start.line,
            'column': previous.start.column,
            'message': 'No space allowed before `:`',
            'severity': parser.severity
          });
        }
      }
      else {
        if (parser.options.include) {
          result = helpers.addUnique(result, {
            'ruleId': parser.rule.name,
            'line': delimiter.start.line,
            'column': delimiter.start.column - 1,
            'message': 'Space expected before `:`',
            'severity': parser.severity
          });
        }
      }
    });

    return result;
  }
};
