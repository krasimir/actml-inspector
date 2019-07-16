'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var IN = 'IN';
var OUT = 'OUT';
var REMOVE = 'REMOVE';

var isRunningInNode = typeof process !== 'undefined' && typeof process.release !== 'undefined' && process.release.name === 'node';

var trim = function trim(str, len) {
  var emp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '...';
  return str.length > len ? str.substr(0, len) + emp : str;
};
var getIndMargin = function getIndMargin(ind) {
  return 'margin-left: ' + ind * 20 + 'px;';
};
var getIndSpaces = function getIndSpaces(ind) {
  return [].concat(_toConsumableArray(Array(ind * 2).keys())).map(function (x) {
    return ' ';
  }).join('');
};
var parseLogMeta = function parseLogMeta(meta) {
  if (typeof meta === 'undefined') return '';
  if (typeof meta === 'string' || typeof meta === 'boolean' || typeof meta === 'number') {
    return '(' + JSON.stringify(meta) + ')';
  }
  if ((typeof meta === 'undefined' ? 'undefined' : _typeof(meta)) === 'object') {
    if (Array.isArray(meta)) {
      return '([...' + meta.length + '])';
    }
    return '(' + trim(JSON.stringify((0, _sanitize2.default)(meta)), 50) + ')';
  }
  return '(' + (typeof meta === 'undefined' ? 'undefined' : _typeof(meta)) + ')';
};

var print = {
  entrance: function entrance(what, ind) {
    if (!isRunningInNode) {
      return [null, '%c' + what, 'color: #b0b0b0;' + getIndMargin(ind)];
    }
    return [null, '\x1b[38m%s\x1b[0m', '' + (getIndSpaces(ind) + what)];
  },
  default: function _default(what, ind) {
    if (!isRunningInNode) {
      return [null, '%c' + what, getIndMargin(ind)];
    }
    return [null, '' + (getIndSpaces(ind) + what)];
  },
  hook: function hook(what, ind, time) {
    if (!isRunningInNode) {
      return [time, '%c' + what, 'color: #999;' + getIndMargin(ind)];
    }
    return [time, '\x1b[34m%s\x1b[0m', '' + (getIndSpaces(ind) + what)];
  },
  current: function current(what, ind) {
    if (!isRunningInNode) {
      return [null, '%c' + what, 'font-weight: bold; border: solid 1px #999; border-radius: 2px; padding: 1px 0;' + getIndMargin(ind)];
    }
    return [null, getIndSpaces(ind) + ('\x1B[100m' + what + '\x1B[0m')];
  }
};

function _printSnapshotToConsole(snapshot) {
  var _snapshot = _slicedToArray(snapshot, 3),
      type = _snapshot[0],
      node = _snapshot[1],
      tree = _snapshot[2];

  var printLines = [print.entrance('', 0)];

  printLines = printLines.concat(function loop(_ref) {
    var id = _ref.id,
        ind = _ref.ind,
        name = _ref.name,
        used = _ref.used,
        children = _ref.children,
        logs = _ref.logs;

    var lines = [];
    var elementOpenTag = '<' + name + (used > 0 ? '(' + used + ')' : '') + '>';

    lines.push(id === node.element.id ? print.current(elementOpenTag, ind) : print.default(elementOpenTag, ind));
    if (logs && logs.length > 0) {
      lines = lines.concat(logs.map(function (_ref2) {
        var type = _ref2.type,
            meta = _ref2.meta,
            time = _ref2.time;

        return print.hook('\u2937 ' + type + parseLogMeta(meta), ind, time);
      }));
    }
    if (children.length > 0) {
      children.map(function (child) {
        lines = lines.concat(loop(child));
      });
      lines.push(id === node.element.id ? print.current('</' + name + '>', ind) : print.default('</' + name + '>', ind));
    }
    return lines;
  }(tree));

  // console.clear();
  var sortedHookTimes = printLines.filter(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
        time = _ref4[0];

    return time !== null;
  }).map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 1),
        time = _ref6[0];

    return time;
  }).sort(function (a, b) {
    return a > b ? 1 : -1;
  });

  printLines.forEach(function (_ref7) {
    var _ref8 = _toArray(_ref7),
        time = _ref8[0],
        line = _ref8.slice(1);

    if (sortedHookTimes.length > 0 && time) {
      var _console;

      (_console = console).log.apply(_console, _toConsumableArray(line).concat([sortedHookTimes.findIndex(function (t) {
        return t === time;
      })]));
    } else {
      var _console2;

      (_console2 = console).log.apply(_console2, _toConsumableArray(line));
    }
  });
}

exports.default = {
  watch: function watch(processor) {
    var snapshots = [];

    function snapshot(type, node) {
      snapshots.push([type, { element: { id: node.element.id } }, processor.system().tree.diagnose()]);
      _printSnapshotToConsole(snapshots[snapshots.length - 1]);
    }

    // processor.onNodeIn(node => snapshot(IN, node));
    processor.onNodeOut(function (node) {
      return snapshot(OUT, node);
    });
    // processor.onNodeRemove(node => snapshot(REMOVE, node));
  },
  printSnapshotToConsole: function printSnapshotToConsole(snapshots) {
    snapshots.forEach(_printSnapshotToConsole);
  }
};