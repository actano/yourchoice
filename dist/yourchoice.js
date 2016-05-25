(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["_"], factory);
	else if(typeof exports === 'object')
		exports["Yourchoice"] = factory(require("_"));
	else
		root["Yourchoice"] = factory(root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _selection = __webpack_require__(1);

	exports.default = _selection.Selection;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Selection = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _componentEmitter = __webpack_require__(2);

	var _componentEmitter2 = _interopRequireDefault(_componentEmitter);

	var _assert = __webpack_require__(3);

	var _assert2 = _interopRequireDefault(_assert);

	var _array = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Selection = function (_Emitter) {
	  _inherits(Selection, _Emitter);

	  function Selection(iteratorFactory) {
	    _classCallCheck(this, Selection);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Selection).call(this));

	    _this.iterable = _defineProperty({}, Symbol.iterator, iteratorFactory);
	    _this.selectedItems = [];
	    _this.lastAnchor = null;
	    return _this;
	  }

	  _createClass(Selection, [{
	    key: 'toggle',
	    value: function toggle(item) {
	      if (this._isSelected(item)) {
	        this.lastAnchor = null;
	        this._removeFromSelection(item);
	        item.deselect();
	      } else {
	        this.lastAnchor = item;
	        this._addToSelection(item);
	        item.select();
	      }

	      this._emitChangeEvent();
	    }
	  }, {
	    key: 'replace',
	    value: function replace(item) {
	      if (!this._isOnlySelectedItem(item)) {
	        this.lastAnchor = item;
	        for (var i = 0; i < this.selectedItems.length; i++) {
	          var oldSelectedItem = this.selectedItems[i];
	          oldSelectedItem.deselect();
	        }

	        this.selectedItems = [item];
	        item.select();

	        this._emitChangeEvent();
	      }
	    }
	  }, {
	    key: 'remove',
	    value: function remove(items) {
	      var atLeastOneItemRemoved = false;

	      for (var i = 0; i < items.length; i++) {
	        var item = items[i];
	        if (this._isSelected(item)) {
	          this._removeFromSelection(item);
	          item.deselect();
	          atLeastOneItemRemoved = true;
	        }
	      }

	      this.lastAnchor = null;
	      if (atLeastOneItemRemoved) {
	        this._emitChangeEvent();
	      }
	    }
	  }, {
	    key: 'removeAll',
	    value: function removeAll() {
	      return this.remove(this.selectedItems.slice());
	    }
	  }, {
	    key: 'rangeTo',
	    value: function rangeTo(endItem) {
	      var _this2 = this;

	      var oldSelectedItems = this.selectedItems.slice();

	      var startItem = this._getRangeStart();
	      (0, _assert2.default)(startItem != null, 'rangeTo: no start item');

	      if (this.lastAnchor != null || this.selectedItems.length > 0) {
	        this.lastAnchor = startItem;
	      }

	      this._deselectItemsConnectedWith(startItem);

	      var _orderStartAndEndItem = this._orderStartAndEndItems(startItem, endItem);

	      var from = _orderStartAndEndItem.from;
	      var to = _orderStartAndEndItem.to;

	      this._performActionInRange(from, to, function (item) {
	        _this2._addToSelection(item);
	        item.select();
	      });

	      if (!(0, _array.sameMembers)(oldSelectedItems, this.selectedItems)) {
	        this._emitChangeEvent();
	      }
	    }
	  }, {
	    key: '_getRangeStart',
	    value: function _getRangeStart() {
	      if (this.lastAnchor != null) {
	        return this.lastAnchor;
	      }
	      if (this.selectedItems.length > 0) {
	        return this._getBottommostSelectedItem();
	      }
	      var iterator = this.iterable[Symbol.iterator]();
	      return iterator.next().value;
	    }
	  }, {
	    key: '_orderStartAndEndItems',
	    value: function _orderStartAndEndItems(startItem, endItem) {
	      var array = Array.from(this.iterable);
	      var startItemIndex = array.indexOf(startItem);
	      var endItemIndex = array.indexOf(endItem);
	      if (startItemIndex > endItemIndex) {
	        return {
	          from: endItem,
	          to: startItem
	        };
	      }
	      return {
	        from: startItem,
	        to: endItem
	      };
	    }
	  }, {
	    key: '_emitChangeEvent',
	    value: function _emitChangeEvent() {
	      return this.emit('change', this.selectedItems.slice());
	    }
	  }, {
	    key: '_getBottommostSelectedItem',
	    value: function _getBottommostSelectedItem() {
	      var previousItem = null;

	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.iterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var item = _step.value;

	          if (this._isSelected(item)) {
	            previousItem = item;
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return previousItem;
	    }
	  }, {
	    key: '_performActionInRange',
	    value: function _performActionInRange(startItem, endItem, action) {
	      (0, _assert2.default)(startItem != null, '_performActionInRange: no start item');
	      (0, _assert2.default)(endItem != null, '_performActionInRange: no end item');

	      var performAction = false;
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = this.iterable[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var item = _step2.value;

	          if (item === startItem) {
	            performAction = true;
	          }
	          if (performAction) {
	            action(item);
	          }
	          if (item === endItem) {
	            performAction = false;
	          }
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }, {
	    key: '_isOnlySelectedItem',
	    value: function _isOnlySelectedItem(item) {
	      return this.selectedItems.length === 1 && this._isSelected(item);
	    }
	  }, {
	    key: '_isSelected',
	    value: function _isSelected(item) {
	      return this.selectedItems.indexOf(item) !== -1;
	    }
	  }, {
	    key: '_addToSelection',
	    value: function _addToSelection(item) {
	      if (!this._isSelected(item)) {
	        this.selectedItems.push(item);
	      }
	    }
	  }, {
	    key: '_removeFromSelection',
	    value: function _removeFromSelection(item) {
	      if (this._isSelected(item)) {
	        var index = this.selectedItems.indexOf(item);
	        this.selectedItems.splice(index, 1);
	      }
	    }
	  }, {
	    key: '_deselectItemsConnectedWith',
	    value: function _deselectItemsConnectedWith(targetItem) {
	      var range = [];
	      var isRangeWithTargetItem = false;

	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = this.iterable[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var item = _step3.value;

	          if (this._isSelected(item)) {
	            range.push(item);

	            if (item === targetItem) {
	              isRangeWithTargetItem = true;
	            }
	          } else {
	            if (isRangeWithTargetItem) {
	              break;
	            } else {
	              range = [];
	            }
	          }
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }

	      var _iteratorNormalCompletion4 = true;
	      var _didIteratorError4 = false;
	      var _iteratorError4 = undefined;

	      try {
	        for (var _iterator4 = range[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	          var _item = _step4.value;

	          this._removeFromSelection(_item);
	          _item.deselect();
	        }
	      } catch (err) {
	        _didIteratorError4 = true;
	        _iteratorError4 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion4 && _iterator4.return) {
	            _iterator4.return();
	          }
	        } finally {
	          if (_didIteratorError4) {
	            throw _iteratorError4;
	          }
	        }
	      }
	    }
	  }]);

	  return Selection;
	}(_componentEmitter2.default);

	exports.Selection = Selection;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */

	if (true) {
	  module.exports = Emitter;
	}

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && console !== null && console.assert != null) {
	    var _console;

	    return (_console = console).assert.apply(_console, arguments);
	    /* eslint-enable no-console */
	  }
	  return null;
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sameMembers = undefined;

	var _lodash = __webpack_require__(5);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function sameMembers(array1, array2) {
	  if (array1.length !== array2.length) {
	    return false;
	  }
	  return _lodash2.default.union(array1, array2).length === array2.length;
	}

	exports.sameMembers = sameMembers;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }
/******/ ])
});
;