'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sanitize;

var _CircularJSON = require('./vendor/CircularJSON');

var _CircularJSON2 = _interopRequireDefault(_CircularJSON);

var _SerializeError = require('./vendor/SerializeError');

var _SerializeError2 = _interopRequireDefault(_SerializeError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stringify = _CircularJSON2.default.stringify;
function sanitize(something) {
  var showErrorInConsole = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var result;

  try {
    result = JSON.parse(stringify(something, function (key, value) {
      if (typeof value === 'function') {
        return value.name === '' ? '<anonymous>' : 'function ' + value.name + '()';
      }
      if (value instanceof Error) {
        return (0, _SerializeError2.default)(value);
      }
      return value;
    }, undefined, true));
  } catch (error) {
    if (showErrorInConsole) {
      console.log(error);
    }
    result = null;
  }
  return result;
}