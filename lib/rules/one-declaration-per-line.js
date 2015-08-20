'use strict';

var gonzales = require('gonzales-pe'),
    util = require('util'),
    merge = require('merge');

function log (input) {
  console.log(util.inspect(input, false, null));
}

module.exports = {
  'name': 'one-declaration-per-line',
  'defaults': {},
  'detect': function (ast, parser) {
    var result = [],
	lastLine = {};

    ast.traverseByType('declaration', function (declaration, i, parent) {
      if (declaration.start.line === lastLine.start || declaration.start.line === lastLine.end) {
	result.push({
	  'ruleId': parser.rule.name,
	  'line': declaration.start.line,
	  'column': declaration.start.column,
	  'message': 'Only one declaration per line allowed',
	  'severity': parser.severity
	});
      }

      lastLine.start = declaration.start.line;
      lastLine.end = declaration.end.line


    });

    return result;
  }
}