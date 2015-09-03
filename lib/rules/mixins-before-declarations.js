'use strict';

var helpers = require('../helpers');

module.exports = {
  'name': 'mixins-before-declarations',
  'defaults': {
    'exclude': [
      'breakpoint',
      'mq'
    ]
  },
  'detect': function (ast, parser) {
    var result = [];
    var error;

    ast.traverseByType('include', function (node, i, parent) {
      var depth = 0;
      var declarationCount = [depth];

      parent.traverse( function (item) {
        if (item.type === 'ruleset') {
          depth++;
          declarationCount[depth] = 0;
        }
        if (item.type === 'declaration') {
          declarationCount[depth]++;
        }
        else if (item.type === 'include') {
          item.forEach('simpleSelector', function (name) {
            if (parser.options.exclude.indexOf(name.content[0].content) === -1 && declarationCount[depth] > 0) {
              error = {
                'ruleId': parser.rule.name,
                'line': item.start.line,
                'column': item.start.column,
                'message': 'Mixins should come before declarations',
                'severity': parser.severity
              };
              result = helpers.addUnique(result, error);
            }
          });
        }
      });
    });
    return result;
  }
};
