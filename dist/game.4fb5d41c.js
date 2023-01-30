// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"game.ts":[function(require,module,exports) {
// import { Elm } from "./Game.elm";
// console.log(Elm);
// Elm.Game.init({
//     node: document.getElementById("elm"),
// });
var DiskKind;

(function (DiskKind) {
  DiskKind[DiskKind["White"] = 0] = "White";
  DiskKind[DiskKind["Black"] = 1] = "Black";
  DiskKind[DiskKind["Undecided"] = 2] = "Undecided";
})(DiskKind || (DiskKind = {}));

var Vec2 =
/** @class */
function () {
  function Vec2(x, y) {
    this.x = x;
    this.y = y;
  }

  Vec2.prototype.scanAll = function (operation) {
    this.mapAll(operation);
  };

  Vec2.prototype.mapAll = function (operation) {
    var ret = [];

    var _loop_1 = function _loop_1(yy) {
      ret[yy] = this_1.mapRow(function (x) {
        return operation(x, yy);
      });
    };

    var this_1 = this;

    for (var yy = 0; yy < this.y; ++yy) {
      _loop_1(yy);
    }

    return ret;
  };

  Vec2.prototype.scanRow = function (operation) {
    for (var xx = 0; xx < this.x; ++xx) {
      operation(xx);
    }
  };

  Vec2.prototype.mapRow = function (operation) {
    var ret = [];

    for (var xx = 0; xx < this.x; ++xx) {
      ret[xx] = operation(xx);
    }

    return ret;
  };

  Vec2.prototype.up = function () {
    return this.y === 0 ? this : new Vec2(this.x, this.y - 1);
  };

  Vec2.prototype.down = function (maxY) {
    return this.y + 1 >= maxY ? this : new Vec2(this.x, this.y + 1);
  };

  Vec2.prototype.left = function () {
    return this.x === 0 ? this : new Vec2(this.x - 1, this.y);
  };

  Vec2.prototype.right = function (maxX) {
    return this.x + 1 >= maxX ? this : new Vec2(this.x + 1, this.y);
  };

  return Vec2;
}();

var Game =
/** @class */
function () {
  function Game() {
    this.board = new Vec2(8, 8);
    this.manual = "[w: ↑][a: ←][d: →][s: ↓]";
    this.diskStates = this.board.mapAll(function (x, y) {
      return DiskKind.Undecided;
    });
    this.turn = DiskKind.Black;
    this.cursorPosition = new Vec2(0, 0);
    this.message = "";
    this.diskStates[3][3] = DiskKind.White;
    this.diskStates[3][4] = DiskKind.Black;
    this.diskStates[4][3] = DiskKind.Black;
    this.diskStates[4][4] = DiskKind.White;
  }

  Game.prototype.cursorPositionDiskKind = function () {
    return this.diskStates[this.cursorPosition.x][this.cursorPosition.y];
  };

  return Game;
}();

document.addEventListener("keydown", function (evt) {
  handleKeyEvent(evt);
});
var game;

var init = function init() {
  game = new Game();
  draw();
};

var handleKeyEvent = function handleKeyEvent(evt) {
  switch (evt.key) {
    case "W":
    case "w":
      game.cursorPosition = game.cursorPosition.up();
      break;

    case "a":
    case "A":
      game.cursorPosition = game.cursorPosition.left();
      break;

    case "s":
    case "S":
      game.cursorPosition = game.cursorPosition.down(game.board.y);
      break;

    case "d":
    case "D":
      game.cursorPosition = game.cursorPosition.right(game.board.x);
      break;

    default:
      putDisk();
      break;
  }

  draw();
};

var putDisk = function putDisk() {
  if (!canPut()) {
    game.message = "そこに石は置けません。";
    return;
  }

  game.message = "";
  game.diskStates[game.cursorPosition.x][game.cursorPosition.y] = game.turn;
  game.turn = game.turn === DiskKind.Black ? DiskKind.White : DiskKind.Black;
};

var canPut = function canPut() {
  if (game.cursorPositionDiskKind() === DiskKind.Undecided) {
    return true;
  } // 挟める位置かどうか


  return false;
};

var display = document.getElementById("display");
var message = document.getElementById("message");
var DISK_CHARS = ["〇", "●", "・"];
var DISK_CHAR_NAMES = ["白", "黒"];

var draw = function draw() {
  var html = ""; // 盤面描画

  html += "　";
  game.board.scanRow(function (x) {
    html += x === game.cursorPosition.x ? "|↓" : "|　";
  });
  html += "|";
  game.board.scanAll(function (x, y) {
    if (x === 0) {
      html += "<br>";
      html += y === game.cursorPosition.y ? "→|" : "　|";
    }

    if (x === game.cursorPosition.x && y === game.cursorPosition.y) {
      html += "<span style=\"color:red;\">".concat(DISK_CHARS[game.diskStates[x][y]], "</span>|");
    } else {
      html += "".concat(DISK_CHARS[game.diskStates[x][y]], "|");
    }
  }); // メッセージと操作方法描画

  html += "<br>".concat(DISK_CHAR_NAMES[game.turn], "\u306E\u756A\u3067\u3059\u3002");
  html += "<br>".concat(game.message, "<br>").concat(game.manual);
  display.innerHTML = html;
};

init();
},{}],"../../../../AppData/Roaming/nvm/v16.13.1/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58691" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Roaming/nvm/v16.13.1/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","game.ts"], null)
//# sourceMappingURL=/game.4fb5d41c.js.map