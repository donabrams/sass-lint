'use strict';

var util = require('util'),
    fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml');

var helpers = {};

helpers.log = function log (input) {
  console.log(util.inspect(input, false, null));
};

helpers.propertySearch = function (haystack, needle, property) {
  var length = haystack.length,
      i;

  for (i = 0; i < length; i++) {
    if (haystack[i][property] === needle) {
      return i;
    }
  }
  return -1;
};

helpers.isEqual = function (a, b) {
  var startLine = a.start.line === b.start.line ? true : false,
      endLine = a.end.line === b.end.line ? true : false,
      type = a.type === b.type ? true : false,
      length = a.content.length === b.content.length ? true : false;

  if (startLine && endLine && type && length) {
    return true;
  }
  else {
    return false;
  }
};

helpers.isUnique = function (results, item) {
  var search = this.propertySearch(results, item.line, 'line');

  if (search === -1) {
    return true;
  }
  else if (results[search].column === item.column && results[search].message === item.message) {
    return false;
  }
  else {
    return true;
  }
};

helpers.addUnique = function (results, item) {
  if (this.isUnique(results, item)) {
    results.push(item);
  }
  return results;
};

helpers.sortDetects = function (a, b) {
  if (a.line < b.line) {
    return -1;
  }
  if (a.line > b.line) {
    return 1;
  }
  if (a.line === b.line) {
    if (a.column < b.column) {
      return -1;
    }
    if (a.column > b.column) {
      return 1;
    }
    return 0;
  }
  return 0;
};

helpers.isNumber = function (val) {
  if (isNaN(parseInt(val, 10))) {
    return false;
  }
  return true;
};

helpers.isUpperCase = function (str) {
  var pieces = str.split(''),
      i,
      result = 0;

  for (i = 0; i < pieces.length; i++) {
    if (!helpers.isNumber(pieces[i])) {
      if (pieces[i] === pieces[i].toUpperCase() && pieces[i] !== pieces[i].toLowerCase()) {
        result++;
      }
      else {
        return false;
      }
    }
  }
  if (result) {
    return true;
  }
  return false;
};

helpers.isLowerCase = function (str) {
  var pieces = str.split(''),
      i,
      result = 0;

  for (i = 0; i < pieces.length; i++) {
    if (!helpers.isNumber(pieces[i])) {
      if (pieces[i] === pieces[i].toLowerCase() && pieces[i] !== pieces[i].toUpperCase()) {
        result++;
      }
      else {
        return false;
      }
    }
  }
  if (result) {
    return true;
  }
  return false;
};

helpers.isCamelCase = function (str) {
  return /^[a-z][a-zA-Z0-9]*$/.test(str);
};

helpers.isHyphenatedLowercase = function (str) {
  return !(/[_A-Z]/.test(str));
};

helpers.isSnakeCase = function (str) {
  return !(/[^_a-z0-9]/.test(str));
};

helpers.isValidHex = function (str) {
  if (str.match(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
    return true;
  }
  return false;
};

helpers.loadConfigFile = function (configPath) {
  var fileDir = path.dirname(configPath),
      fileName = path.basename(configPath),
      fileExtension = path.extname(fileName),
      filePath = path.join(__dirname, 'config', fileDir, fileName),
      file = fs.readFileSync(filePath, 'utf8') || false;

  if (file) {
    if (fileExtension === '.yml') {
      return yaml.safeLoad(file);
    }
  }

  return file;
};

helpers.hasEOL = function (str) {
  return /\r\n|\n/.test(str);
};

helpers.isEmptyLine = function (str) {
  return /(\r\n|\n){2}/.test(str);
};

helpers.stripQuotes = function (str) {
  return str.substring(1, str.length - 1);
};

helpers.stripPrefix = function (str) {
  var modProperty = str.slice(1),
      prefixLength = modProperty.indexOf('-');

  return modProperty.slice(prefixLength + 1);
};

/**
 * Removes the trailing space from a string
 * @param {string} curSelector - the current selector string
 * @returns {string} curSelector - the current selector minus any trailing space.
 */

helpers.stripLastSpace = function (selector) {

  if (selector.charAt(selector.length - 1) === ' ') {
    return selector.substr(0, selector.length - 1);

  }

  return selector;

};

/**
 * Scans through our selectors and keeps track of the order of selectors and delimiters
 * @param {object} selector - the current selector tree from our AST
 * @returns {array} mappedElements - an array / list representing the order of selectors and delimiters encountered
 */

helpers.mapDelims = function (val) {

  if (val.type === 'simpleSelector') {
    return 's';
  }

  if (val.type === 'delimiter') {
    return 'd';
  }

  return false;
};

/**
 * Constructs a syntax complete selector for our selector matching and warning output
 * @param {object} node - the current node / part of our selector
 * @returns {string} content - The current node with correct syntax e.g. class my-class = '.my-class'
 */
helpers.constructSelector = function (node) {
  // console.log(node);
  var content = node.content,
      currentValue = '';

  if (node.type === 'id') {
    content = '#' + node.content;
    currentValue = 'id';
  }

  else if (node.type === 'class') {
    content = '.' + node.content;
    currentValue = 'class';
  }

  else if (node.type === 'ident') {
    content = node.content;
    currentValue = 'selector';
  }

  else if (node.type === 'attribute') {
    var selector = '[';

    node.forEach(function (attrib) {
      var selectorPiece = helpers.constructSelector(attrib);

      selector += selectorPiece.content;
    });

    content = selector + ']';
    currentValue = 'attribute';
  }

  else if (node.type === 'pseudoClass') {
    content = ':' + node.content;
    currentValue = 'pseudoClass';
  }

  else if (node.type === 'pseudoElement') {
    content = '::' + node.content;
    currentValue = 'pseudoElement';
  }

  else if (node.type === 'nth') {
    content = '(' + node.content + ')';
    currentValue = 'nth';
  }

  else if (node.type === 'nthSelector') {
    var nthSelector = ':';

    node.forEach(function (attrib) {
      var selectorPiece = helpers.constructSelector(attrib);

      nthSelector += selectorPiece.content;
    });

    content = nthSelector;
    currentValue = 'nthSelector';
  }

  else if (node.type === 'space') {
    content = ' ';
  }

  else if (node.type === 'parentSelector') {
    content = node.content;
    currentValue = 'parentSelector';
  }

  else if (node.type === 'combinator') {
    content = node.content;
    currentValue = 'combinator';
  }

  return {
    content: content,
    currentValue: currentValue
  };
};

/**
 * Checks the current selector value against the previous selector value and assesses whether they are
 * a) currently an enforced selector type for nesting (user specified - all true by default)
 * b) whether they should be nested
 * @param {object} currentVal - the current node / part of our selector
 * @param {object} previousVal - the previous node / part of our selector
 * @param {array} elements - a complete array of nestable selector types
 * @param {array} nestable - an array of the types of selector to nest
 * @returns {object} Returns whether we or we should nest and the previous val
 */
helpers.isNestable = function (currentVal, previousVal, elements, nestable) {
  // check if they are nestable by checking the previous element against one
  // of the user specified selector types
  if (elements.indexOf(previousVal) !== -1 && nestable.indexOf(currentVal) !== -1) {
    return true;
  }

  return false;
};

module.exports = helpers;
