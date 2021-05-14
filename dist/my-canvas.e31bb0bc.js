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
})({"index.js":[function(require,module,exports) {
var canvas = document.getElementById('canvasX');
var context = canvas.getContext('2d');
var usingBrush = false; // 是否使用刷子，左键点击即开启

var lastPoint = {
  'x': undefined,
  'y': undefined
}; //两点之间的上一个点

var newPoint = {
  'x': undefined,
  'y': undefined
}; //两点之间下一个点

autoSetCanvasSize(canvas); //自动设置画布大小

context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height); // 

if (document.body.ontouchstart === undefined) {
  // pc设备
  listenToMouse(canvas);
} else {
  //触屏设备
  // 按下手指
  canvas.ontouchstart = function (ev) {
    var x = ev.touches[0].clientX;
    var y = ev.touches[0].clientY;
    usingBrush = true;

    if (usingBrush) {
      if (usingEraser) {
        // 使用橡皮擦
        context.fillStyle = 'white';
        context.fillRect(x - 5, y - 5, 10, 10);
      } else {
        drawCircle(x, y, 3);
        lastPoint = {
          'x': x,
          'y': y
        };
      }
    }
  }; // 移动手指


  canvas.ontouchmove = function (ev) {
    var x = ev.touches[0].clientX;
    var y = ev.touches[0].clientY;
    newPoint = {
      'x': x,
      'y': y
    };

    if (usingBrush) {
      if (usingEraser) {
        context.fillStyle = 'white';
        context.fillRect(x - 5, y - 5, 10, 10);
      } else {
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint; // 当对象之间使用=的时候，赋值的时候要小心，
        // 如果是.赋值，则两个对象会一起改变
        // 如果是{}赋值，则相互之间不会改变
      }
    }
  }; //松开鼠标


  canvas.ontouchend = function (ev) {
    usingBrush = false;
  };
}

function listenToMouse(canvas) {
  //按下鼠标
  canvas.onmousedown = function (ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    usingBrush = true;

    if (usingBrush) {
      if (usingEraser) {
        context.fillStyle = 'white';
        context.fillRect(x - 5, y - 5, 10, 10);
      } else {
        drawCircle(x, y, 3);
        lastPoint = {
          'x': x,
          'y': y
        };
      }
    }
  }; //移动鼠标


  canvas.onmousemove = function (ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    newPoint = {
      'x': x,
      'y': y
    };

    if (usingBrush) {
      if (usingEraser) {
        context.fillStyle = 'white';
        context.fillRect(x - 5, y - 5, 10, 10);
      } else {
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint; // 当对象之间使用=的时候，赋值的时候要小心，
        // 如果是.赋值，则两个对象会一起改变
        // 如果是{}赋值，则相互之间不会改变
      }
    }
  }; //松开鼠标


  canvas.onmouseup = function (ev) {
    usingBrush = false;
  };
} //工具函数
//画一个圆


function drawCircle(x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.closePath();
} // 画一条线


function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.lineWidth = 5; //线的宽度

  context.moveTo(x1, y1); // 起点

  context.lineTo(x2, y2); // 终点

  context.stroke(); //画线

  context.closePath();
}

var eraser = document.getElementById('eraser');
var brush = document.getElementById('brush');
var clear = document.getElementById('clear');
var save = document.getElementById('save'); // 橡皮擦按钮

var usingEraser = false; // 橡皮擦的状态

eraser.onclick = function (e) {
  usingEraser = true; //当橡皮擦被点击时，橡皮擦的状态改变

  eraser.classList.add('active'); //橡皮擦被点击时，高亮

  brush.classList.remove('active'); //其他按钮恢复正常

  clear.classList.remove('active');
  save.classList.remove('active');
}; // 画笔按钮


brush.onclick = function (e) {
  usingBrush = false;
  usingEraser = false;
  brush.classList.add('active');
  eraser.classList.remove('active');
  clear.classList.remove('active');
  save.classList.remove('active');
}; // 清除画板


clear.onclick = function (e) {
  usingEraser = false;
  clear.classList.add('active');
  brush.classList.add('active');
  eraser.classList.remove('active');
  save.classList.remove('active');
  setTimeout(function () {
    clear.classList.remove('active');
  }, 200); // setTimeout(() => {
  //     clear.classList.remove('active')
  // }, 200);//设置延迟执行,这种写法在某些手机浏览器上不支持

  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);
}; // 保存


save.onclick = function (e) {
  save.classList.add('active');
  setTimeout(function () {
    save.classList.remove('active');
  }, 200);
  var url = canvas.toDataURL('image/png');
  var a = document.createElement('a');
  document.body.append(a);
  a.href = url;
  a.download = '你画的佩奇也太可爱了吧！'; //download的属性值是下载的名字

  a.click();
}; // 设置canvas的大小


function setCanvasSize() {
  var pageHeigh = document.documentElement.clientHeight;
  var pageWidth = document.documentElement.clientWidth;
  canvas.width = pageWidth;
  canvas.height = pageHeigh;
} // 自动设置canvas的大小


function autoSetCanvasSize(canvas) {
  setCanvasSize(); // 刷新Canvas的大小
  // window.onresize = function () {
  //     setCanvasSize();
  // }
} // 颜料盘


var red = document.getElementById('red');
var blue = document.getElementById('blue');
var pink = document.getElementById('pink');
var black = document.getElementById('black');

red.onclick = function (e) {
  red.classList.add('active');
  black.classList.remove('active');
  blue.classList.remove('active');
  pink.classList.remove('active');
  context.fillStyle = '#ea5b52';
  context.strokeStyle = '#ea5b52';
};

blue.onclick = function (e) {
  blue.classList.add('active');
  black.classList.remove('active');
  red.classList.remove('active');
  pink.classList.remove('active');
  context.fillStyle = '#0776c2';
  context.strokeStyle = '#0776c2';
};

pink.onclick = function (e) {
  pink.classList.add('active');
  black.classList.remove('active');
  blue.classList.remove('active');
  red.classList.remove('active');
  context.fillStyle = '#f2a7c8';
  context.strokeStyle = '#f2a7c8';
};

black.onclick = function (e) {
  black.classList.add('active');
  blue.classList.remove('active');
  red.classList.remove('active');
  pink.classList.remove('active');
  context.fillStyle = '#000401';
  context.strokeStyle = '#000401';
};
},{}],"C:/Users/LYD/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "2974" + '/');

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
},{}]},{},["C:/Users/LYD/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/my-canvas.e31bb0bc.js.map