(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@jbrowse/core/configuration'), require('@jbrowse/core/Plugin'), require('@jbrowse/core/pluggableElementTypes/DisplayType'), require('@jbrowse/core/pluggableElementTypes/models'), require('@jbrowse/core/util/types/mst'), require('react'), require('@material-ui/core/SvgIcon'), require('@jbrowse/core/util/tracks'), require('@jbrowse/core/util'), require('mobx-state-tree'), require('@jbrowse/core/data_adapters/BaseAdapter'), require('@jbrowse/core/util/rxjs')) :
  typeof define === 'function' && define.amd ? define(['exports', '@jbrowse/core/configuration', '@jbrowse/core/Plugin', '@jbrowse/core/pluggableElementTypes/DisplayType', '@jbrowse/core/pluggableElementTypes/models', '@jbrowse/core/util/types/mst', 'react', '@material-ui/core/SvgIcon', '@jbrowse/core/util/tracks', '@jbrowse/core/util', 'mobx-state-tree', '@jbrowse/core/data_adapters/BaseAdapter', '@jbrowse/core/util/rxjs'], factory) :
  (global = global || self, factory(global.JBrowsePluginGDC = {}, global.JBrowseExports['@jbrowse/core/configuration'], global.JBrowseExports['@jbrowse/core/Plugin'], global.JBrowseExports['@jbrowse/core/pluggableElementTypes/DisplayType'], global.JBrowseExports['@jbrowse/core/pluggableElementTypes/models'], global.JBrowseExports['@jbrowse/core/util/types/mst'], global.JBrowseExports.react, global.JBrowseExports['@material-ui/core/SvgIcon'], global.JBrowseExports['@jbrowse/core/util/tracks'], global.JBrowseExports['@jbrowse/core/util'], global.JBrowseExports['mobx-state-tree'], global.JBrowseExports['@jbrowse/core/data_adapters/BaseAdapter'], global.JBrowseExports['@jbrowse/core/util/rxjs']));
}(this, (function (exports, configuration, Plugin, DisplayType, models, mst, react, SvgIcon, tracks, util, mobxStateTree, BaseAdapter, rxjs) { 'use strict';

  Plugin = Plugin && Object.prototype.hasOwnProperty.call(Plugin, 'default') ? Plugin['default'] : Plugin;
  DisplayType = DisplayType && Object.prototype.hasOwnProperty.call(DisplayType, 'default') ? DisplayType['default'] : DisplayType;
  react = react && Object.prototype.hasOwnProperty.call(react, 'default') ? react['default'] : react;
  SvgIcon = SvgIcon && Object.prototype.hasOwnProperty.call(SvgIcon, 'default') ? SvgIcon['default'] : SvgIcon;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var stateModel = (function (jbrowse) {
    var _jbrowse$jbrequire = jbrowse.jbrequire('mobx-state-tree'),
        types = _jbrowse$jbrequire.types;

    var Filter = types.model({
      id: types.identifier,
      category: types.string,
      type: types.string,
      filter: types.string
    }).actions(function (self) {
      return {
        setCategory: function setCategory(newCategory) {
          self.category = newCategory;
          self.filter = '';
        },
        setFilter: function setFilter(newFilter) {
          self.filter = newFilter;
        }
      };
    });
    var ColourBy = types.model({
      id: types.identifier,
      value: types.string
    });
    return types.model('GDCFilterWidget', {
      id: mst.ElementId,
      type: types.literal('GDCFilterWidget'),
      target: types.safeReference(jbrowse.pluggableConfigSchemaType('track')),
      filters: types.array(Filter),
      colourBy: types.map(ColourBy)
    }).actions(function (self) {
      return {
        setTarget: function setTarget(newTarget) {
          self.target = newTarget;
        },
        addFilter: function addFilter(id, category, type, filter) {
          self.filters.push(Filter.create({
            id: id,
            category: category,
            type: type,
            filter: filter
          }));
        },
        deleteFilter: function deleteFilter(id) {
          var pos = self.filters.findIndex(function (filter) {
            return filter.id === id;
          });
          self.filters.remove(self.filters[pos]);
        },
        getFiltersByType: function getFiltersByType(type) {
          return self.filters.filter(function (filter) {
            return filter.type === type;
          });
        },
        clearFilters: function clearFilters() {
          // Keep filters that have been added but not set
          self.filters = self.filters.filter(function (f) {
            return f.filter.length === 0;
          });
        },
        setColourBy: function setColourBy(newColourBy) {
          self.colourBy[0] = newColourBy;
        },
        getColourBy: function getColourBy() {
          return self.colourBy[0] ? self.colourBy[0] : {};
        }
      };
    });
  });

  // Unique ID creation requires a high quality random # generator. In the browser we therefore
  // require the crypto API and do not support built-in fallback to lower quality random number
  // generators (like Math.random()).
  // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
  // find the complete implementation of crypto (msCrypto) on IE11.
  var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  function rng() {
    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }

    return getRandomValues(rnds8);
  }

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */
  var byteToHex = [];

  for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
  }

  function bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

    return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
  }

  function v4(options, buf, offset) {
    var i = buf && offset || 0;

    if (typeof options == 'string') {
      buf = options === 'binary' ? new Array(16) : null;
      options = null;
    }

    options = options || {};
    var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

    if (buf) {
      for (var ii = 0; ii < 16; ++ii) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || bytesToUuid(rnds);
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var interopRequireDefault = createCommonjsModule(function (module) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  module.exports = _interopRequireDefault;
  });

  unwrapExports(interopRequireDefault);

  var _extends_1 = createCommonjsModule(function (module) {
  function _extends() {
    module.exports = _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  module.exports = _extends;
  });

  var createSvgIcon_1 = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createSvgIcon;

  var _extends2 = interopRequireDefault(_extends_1);

  var _react = interopRequireDefault(react);

  var _SvgIcon = interopRequireDefault(SvgIcon);

  function createSvgIcon(path, displayName) {
    var Component = _react.default.memo(_react.default.forwardRef(function (props, ref) {
      return _react.default.createElement(_SvgIcon.default, (0, _extends2.default)({
        ref: ref
      }, props), path);
    }));

    {
      Component.displayName = "".concat(displayName, "Icon");
    }

    Component.muiName = _SvgIcon.default.muiName;
    return Component;
  }
  });

  unwrapExports(createSvgIcon_1);

  var Help = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;

  var _react = interopRequireDefault(react);

  var _createSvgIcon = interopRequireDefault(createSvgIcon_1);

  var _default = (0, _createSvgIcon.default)(_react.default.createElement("path", {
    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
  }), 'Help');

  exports.default = _default;
  });

  var HelpIcon = unwrapExports(Help);

  var Add = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;

  var _react = interopRequireDefault(react);

  var _createSvgIcon = interopRequireDefault(createSvgIcon_1);

  var _default = (0, _createSvgIcon.default)(_react.default.createElement("path", {
    d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
  }), 'Add');

  exports.default = _default;
  });

  var AddIcon = unwrapExports(Add);

  var Clear = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;

  var _react = interopRequireDefault(react);

  var _createSvgIcon = interopRequireDefault(createSvgIcon_1);

  var _default = (0, _createSvgIcon.default)(_react.default.createElement("path", {
    d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
  }), 'Clear');

  exports.default = _default;
  });

  var ClearIcon = unwrapExports(Clear);

  var FiltersF = (function (jbrowse) {
    var _jbrowse$jbrequire = jbrowse.jbrequire('@material-ui/core/styles'),
        makeStyles = _jbrowse$jbrequire.makeStyles;

    var _jbrowse$jbrequire2 = jbrowse.jbrequire('mobx-react'),
        observer = _jbrowse$jbrequire2.observer;

    var React = jbrowse.jbrequire('react');
    var useState = React.useState;

    var _jbrowse$jbrequire3 = jbrowse.jbrequire('@material-ui/core'),
        MenuItem = _jbrowse$jbrequire3.MenuItem,
        FormControl = _jbrowse$jbrequire3.FormControl,
        FormLabel = _jbrowse$jbrequire3.FormLabel,
        Select = _jbrowse$jbrequire3.Select,
        Input = _jbrowse$jbrequire3.Input,
        Checkbox = _jbrowse$jbrequire3.Checkbox,
        ListItemText = _jbrowse$jbrequire3.ListItemText,
        IconButton = _jbrowse$jbrequire3.IconButton,
        List = _jbrowse$jbrequire3.List,
        ListItem = _jbrowse$jbrequire3.ListItem,
        Tooltip = _jbrowse$jbrequire3.Tooltip;

    var useStyles = makeStyles(function (theme) {
      return {
        root: {
          padding: theme.spacing(1, 3, 1, 1),
          background: theme.palette.background["default"],
          overflowX: 'hidden'
        },
        formControl: {
          margin: theme.spacing(1),
          minWidth: 150
        }
      };
    });
    /**
     * An element representing an individual filter with a category and set of applied values
     */

    var Filter = observer(function (props) {
      var classes = useStyles();
      var schema = props.schema,
          filterModel = props.filterModel,
          facets = props.facets;

      var _useState = useState(filterModel.category ? facets.find(function (f) {
        return f.name === filterModel.category;
      }) : facets[0]),
          _useState2 = _slicedToArray(_useState, 2),
          categoryValue = _useState2[0],
          setCategoryValue = _useState2[1];

      var _useState3 = useState(filterModel.filter ? filterModel.filter.split(',') : []),
          _useState4 = _slicedToArray(_useState3, 2),
          filterValue = _useState4[0],
          setFilterValue = _useState4[1];

      var handleChangeCategory = function handleChangeCategory(event) {
        setCategoryValue(event.target.value);
        setFilterValue([]);
        filterModel.setCategory(event.target.value.name);
      };

      var handleChangeFilter = function handleChangeFilter(event) {
        setFilterValue(event.target.value);
        filterModel.setFilter(event.target.value.join(','));
        updateTrack(schema.filters, schema.target);
      };
      /**
       * Converts filter model objects to a GDC filter query and updates the track
       * @param {*} filters Array of filter model objects
       * @param {*} target Track target
       */


      function updateTrack(filters, target) {
        var gdcFilters = {
          op: 'and',
          content: []
        };

        if (filters.length > 0) {
          var _iterator = _createForOfIteratorHelper(filters),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var filter = _step.value;

              if (filter.filter !== '') {
                gdcFilters.content.push({
                  op: 'in',
                  content: {
                    field: "".concat(filter.type, "s.").concat(filter.category),
                    value: filter.filter.split(',')
                  }
                });
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } else {
          gdcFilters = {};
        }

        target.adapter.filters.set(JSON.stringify(gdcFilters));
      }

      var handleFilterDelete = function handleFilterDelete() {
        schema.deleteFilter(filterModel.id);
        updateTrack(schema.filters, schema.target);
      };

      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(List, null, /*#__PURE__*/React.createElement(ListItem, null, /*#__PURE__*/React.createElement(FormControl, {
        className: classes.formControl
      }, /*#__PURE__*/React.createElement(Select, {
        labelId: "category-select-label",
        id: "category-select",
        value: categoryValue,
        onChange: handleChangeCategory,
        displayEmpty: true
      }, /*#__PURE__*/React.createElement(MenuItem, {
        disabled: true,
        value: ""
      }, /*#__PURE__*/React.createElement("em", null, "Category")), facets.map(function (filterOption) {
        return /*#__PURE__*/React.createElement(MenuItem, {
          value: filterOption,
          key: filterOption.name
        }, filterOption.prettyName);
      }))), /*#__PURE__*/React.createElement(FormControl, {
        className: classes.formControl
      }, /*#__PURE__*/React.createElement(Select, {
        labelId: "demo-mutiple-checkbox-label",
        id: "demo-mutiple-checkbox",
        multiple: true,
        value: filterValue,
        onChange: handleChangeFilter,
        input: /*#__PURE__*/React.createElement(Input, null),
        displayEmpty: true,
        renderValue: function renderValue(selected) {
          if (selected.length === 0) {
            return /*#__PURE__*/React.createElement("em", null, "Filters");
          }

          return selected.join(', ');
        }
      }, /*#__PURE__*/React.createElement(MenuItem, {
        disabled: true,
        value: ""
      }, /*#__PURE__*/React.createElement("em", null, "Filters")), categoryValue.values.map(function (name) {
        return /*#__PURE__*/React.createElement(MenuItem, {
          key: name,
          value: name
        }, /*#__PURE__*/React.createElement(Checkbox, {
          checked: filterValue.indexOf(name) > -1
        }), /*#__PURE__*/React.createElement(ListItemText, {
          primary: name
        }));
      }))), /*#__PURE__*/React.createElement(Tooltip, {
        title: "Remove filter",
        "aria-label": "remove",
        placement: "bottom"
      }, /*#__PURE__*/React.createElement(IconButton, {
        "aria-label": "remove filter",
        onClick: handleFilterDelete
      }, /*#__PURE__*/React.createElement(ClearIcon, null))))));
    });
    /**
     * A collection of filters along with a button to add new filters
     */

    var FilterList = observer(function (_ref) {
      var schema = _ref.schema,
          type = _ref.type,
          facets = _ref.facets;
      var initialFilterSelection = facets[0].name;

      var handleClick = function handleClick() {
        schema.addFilter(v4(), initialFilterSelection, type, '');
      };

      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FormLabel, null, type, " filters")), schema.filters.map(function (filterModel) {
        if (filterModel.type === type) {
          return /*#__PURE__*/React.createElement(Filter, _extends({
            schema: schema
          }, {
            filterModel: filterModel
          }, {
            key: filterModel.id,
            facets: facets
          }));
        }

        return null;
      }), /*#__PURE__*/React.createElement(Tooltip, {
        title: "Add a new filter",
        "aria-label": "add",
        placement: "right"
      }, /*#__PURE__*/React.createElement(IconButton, {
        "aria-label": "add",
        onClick: handleClick
      }, /*#__PURE__*/React.createElement(AddIcon, null))));
    });
    return {
      FilterList: FilterList
    };
  });

  // TODO: Convert these to use the GDC API
  var ssmFacets = [{
    name: 'consequence.transcript.annotation.polyphen_impact',
    prettyName: 'polyphen impact',
    values: ['benign', 'probably_damaging', 'possibly_damaging', 'unknown']
  }, {
    name: 'consequence.transcript.annotation.sift_impact',
    prettyName: 'sift impact',
    values: ['deleterious', 'tolerated', 'deleterious_low_confidence', 'tolerated_low_confidence']
  }, {
    name: 'consequence.transcript.annotation.vep_impact',
    prettyName: 'vep impact',
    values: ['modifier', 'moderate', 'low', 'high']
  }, {
    name: 'consequence.transcript.consequence_type',
    prettyName: 'consequence type',
    values: ['missense_variant', 'downstream_gene_variant', 'non_coding_transcript_exon_variant', 'synonymous_variant', 'intron_variant', 'upstream_gene_variant', '3_prime_UTR_variant', 'stop_gained', 'frameshift_variant', '5_prime_UTR_variant', 'splice_region_variant', 'splice_acceptor_variant', 'splice_donor_variant', 'inframe_deletion', 'inframe_insertion', 'start_lost', 'protein_altering_variant', 'stop_lost', 'stop_retained_variant', 'coding_sequence_variant', 'incomplete_terminal_codon_variant', 'mature_miRNA_variant']
  }, {
    name: 'mutation_subtype',
    prettyName: 'mutation subtype',
    values: ['single base substitution', 'small deletion', 'small insertion']
  }, {
    name: 'occurrence.case.observation.variant_calling.variant_caller',
    prettyName: 'variant caller',
    values: ['mutect2', 'varscan', 'muse', 'somaticsniper']
  }];
  var geneFacets = [{
    name: 'biotype',
    prettyName: 'biotype',
    values: ['protein_coding', 'lincRNA', 'miRNA', 'transcribed_unprocessed_pseudogene', 'processed_pseudogene', 'antisense', 'unprocessed_pseudogene', 'snoRNA', 'IG_V_gene', 'processed_transcript', 'transcribed_processed_pseudogene', 'TR_V_gene', 'TR_J_gene', 'unitary_pseudogene', 'misc_RNA', 'snRNA', 'IG_V_pseudogene', 'polymorphic_pseudogene', 'IG_D_gene', 'sense_overlapping', 'sense_intronic', 'IG_C_gene', 'TEC', 'IG_J_gene', 'rRNA', 'TR_C_gene', 'TR_D_gene', 'TR_V_pseudogene', 'macro_lncRNA', 'transcribed_unitary_pseudogene', 'translated_unprocessed_pseudogene', 'vaultRNA']
  }, {
    name: 'is_cancer_gene_census',
    prettyName: 'is cancer gene census',
    values: ['1']
  }];
  var caseFacets = [{
    name: 'demographic.ethnicity',
    prettyName: 'ethnicity',
    values: ['not hispanic or latino', 'not reported', 'hispanic or latino', 'unknown']
  }, {
    name: 'demographic.gender',
    prettyName: 'gender',
    values: ['female', 'male', 'unknown', 'not reported', 'unspecified']
  }, {
    name: 'demographic.race',
    prettyName: 'race',
    values: ['white', 'not reported', 'unknown', 'black or african american', 'asian', 'other', 'american indian or alaska native', 'native hawaiian or other pacific islander', 'not allowed to collect']
  }, {
    name: 'disease_type',
    prettyName: 'disease type',
    values: ['adenomas and adenocarcinomas', 'ductal and lobular neoplasms', 'epithelial neoplasms, nos', 'gliomas', 'squamous cell neoplasms', 'myeloid leukemias', 'cystic, mucinous and serous neoplasms', 'nevi and melanomas', 'lymphoid leukemias', 'transitional cell papillomas and carcinomas', 'complex mixed and stromal neoplasms', 'neuroepitheliomatous neoplasms', 'neoplasms, nos', 'plasma cell tumors', 'germ cell neoplasms', 'mesothelial neoplasms', 'myomatous neoplasms', 'osseous and chondromatous neoplasms', 'mature b-cell lymphomas', 'chronic myeloproliferative disorders', 'lymphoid neoplasm diffuse large b-cell lymphoma', 'myelodysplastic syndromes', 'lipomatous neoplasms', 'fibromatous neoplasms', 'acinar cell neoplasms', 'meningiomas', 'soft tissue tumors and sarcomas, nos', 'not reported', 'thymic epithelial neoplasms', 'complex epithelial neoplasms', 'paragangliomas and glomus tumors', 'leukemias, nos', 'blood vessel tumors', 'miscellaneous bone tumors', 'specialized gonadal neoplasms', 'nerve sheath tumors', 'synovial-like neoplasms', 'mature t- and nk-cell lymphomas', 'not applicable', 'miscellaneous tumors', 'other leukemias', 'neoplasms of histiocytes and accessory lymphoid cells', 'mucoepidermoid neoplasms', 'adnexal and skin appendage neoplasms', 'basal cell neoplasms', 'unknown', 'malignant lymphomas, nos or diffuse', 'fibroepithelial neoplasms', 'granular cell tumors and alveolar soft part sarcomas', 'hodgkin lymphoma', 'trophoblastic neoplasms', 'myxomatous neoplasms', 'precursor cell lymphoblastic lymphoma', 'mast cell tumors', 'mesonephromas', 'immunoproliferative diseases', 'giant cell tumors', 'odontogenic tumors', 'lymphatic vessel tumors', 'other hematologic disorders']
  }, {
    name: 'primary_site',
    prettyName: 'primary site',
    values: ['bronchus and lung', 'hematopoietic and reticuloendothelial systems', 'breast', 'colon', 'spinal cord, cranial nerves, and other parts of central nervous system', 'ovary', 'kidney', 'unknown', 'skin', 'pancreas', 'prostate gland', 'uterus, nos', 'bladder', 'liver and intrahepatic bile ducts', 'connective, subcutaneous and other soft tissues', 'thyroid gland', 'brain', 'esophagus', 'stomach', 'rectum', 'other and ill-defined sites', 'adrenal gland', 'corpus uteri', 'other and ill-defined digestive organs', 'heart, mediastinum, and pleura', 'cervix uteri', 'other and unspecified major salivary glands', 'lymph nodes', 'testis', 'bones, joints and articular cartilage of other and unspecified sites', 'retroperitoneum and peritoneum', 'other and ill-defined sites in lip, oral cavity and pharynx', 'not reported', 'thymus', 'peripheral nerves and autonomic nervous system', 'bones, joints and articular cartilage of limbs', 'small intestine', 'gallbladder', 'meninges', 'anus and anal canal', 'eye and adnexa', 'other and unspecified parts of biliary tract', 'other and unspecified urinary organs', 'oropharynx', 'other endocrine glands and related structures', 'larynx', 'other and unspecified female genital organs', 'other and unspecified parts of tongue', 'nasopharynx', 'rectosigmoid junction', 'vagina', 'floor of mouth', 'tonsil', 'other and unspecified parts of mouth', 'nasal cavity and middle ear', 'penis', 'hypopharynx', 'base of tongue', 'ureter', 'gum', 'vulva', 'lip', 'trachea', 'palate', 'blood', 'other and unspecified male genital organs', 'renal pelvis']
  }, {
    name: 'project.program.name',
    prettyName: 'program name',
    values: ['GENIE', 'FM', 'TCGA', 'TARGET', 'MMRF', 'CPTAC', 'BEATAML1.0', 'NCICCR', 'OHSU', 'CGCI', 'WCDT', 'ORGANOID', 'CTSP', 'HCMI', 'VAREPOP']
  }, {
    name: 'project.project_id',
    prettyName: 'project id',
    values: ['FM-AD', 'GENIE-MSK', 'GENIE-DFCI', 'GENIE-MDA', 'GENIE-JHU', 'GENIE-UHN', 'TARGET-AML', 'GENIE-VICC', 'TARGET-ALL-P2', 'TARGET-NBL', 'TCGA-BRCA', 'GENIE-GRCC', 'MMRF-COMMPASS', 'GENIE-NKI', 'TARGET-WT', 'TCGA-GBM', 'TCGA-OV', 'TCGA-LUAD', 'BEATAML1.0-COHORT', 'TCGA-UCEC', 'TCGA-KIRC', 'TCGA-HNSC', 'TCGA-LGG', 'TCGA-THCA', 'TCGA-LUSC', 'TCGA-PRAD', 'NCICCR-DLBCL', 'TCGA-SKCM', 'TCGA-COAD', 'TCGA-STAD', 'CPTAC-3', 'TCGA-BLCA', 'TARGET-OS', 'TCGA-LIHC', 'CPTAC-2', 'TCGA-CESC', 'TCGA-KIRP', 'TCGA-SARC', 'TCGA-LAML', 'TARGET-ALL-P3', 'TCGA-ESCA', 'TCGA-PAAD', 'TCGA-PCPG', 'OHSU-CNL', 'TCGA-READ', 'TCGA-TGCT', 'TCGA-THYM', 'CGCI-BLGSP', 'TCGA-KICH', 'WCDT-MCRPC', 'TCGA-ACC', 'TCGA-MESO', 'TCGA-UVM', 'ORGANOID-PANCREATIC', 'TARGET-RT', 'TCGA-DLBC', 'TCGA-UCS', 'BEATAML1.0-CRENOLANIB', 'TCGA-CHOL', 'CTSP-DLBCL1', 'TARGET-ALL-P1', 'HCMI-CMDC', 'TARGET-CCSK', 'VAREPOP-APOLLO']
  }, {
    name: 'samples.sample_type',
    prettyName: 'sample type',
    values: ['primary tumor', 'metastatic', 'blood derived normal', 'primary blood derived cancer - bone marrow', 'solid tissue normal', 'tumor', 'not reported', 'bone marrow normal', 'primary blood derived cancer - peripheral blood', 'recurrent blood derived cancer - bone marrow', 'recurrent blood derived cancer - peripheral blood', 'blood derived cancer - peripheral blood', 'recurrent tumor', 'next generation cancer model', 'blood derived cancer - bone marrow, post-treatment', 'granulocytes', 'fibroblasts from bone marrow normal', 'primary xenograft tissue', 'buccal cell normal', 'blood derived cancer - bone marrow', 'unknown', 'additional - new primary', 'mononuclear cells from bone marrow normal', 'blood derived cancer - peripheral blood, post-treatment', 'cell lines', 'ffpe scrolls', 'expanded next generation cancer model', 'additional metastatic', 'lymphoid normal', 'post neo-adjuvant therapy', 'control analyte', 'slides']
  }, {
    name: 'summary.experimental_strategies.experimental_strategy',
    prettyName: 'experimental strategy',
    values: ['Targeted Sequencing', 'WXS', 'RNA-Seq', 'miRNA-Seq', 'Genotyping Array', 'Methylation Array', 'Tissue Slide', 'Diagnostic Slide', 'WGS', 'ATAC-Seq']
  }];
  var mutationHighlightFeatures = [{
    name: 'VEP',
    attributeName: 'vep_impact',
    type: 'category',
    description: 'Colour by VEP impact (canonical transcript).',
    values: [{
      name: 'LOW',
      colour: 'blue'
    }, {
      name: 'MODIFIER',
      colour: 'goldenrod'
    }, {
      name: 'MODERATE',
      colour: 'orange'
    }, {
      name: 'HIGH',
      colour: 'red'
    }, {
      name: '',
      colour: 'lightgrey'
    }]
  }, {
    name: 'PolyPhen',
    type: 'category',
    attributeName: 'polyphen_impact',
    description: 'Colour by PolyPhen impact (canonical transcript).',
    values: [{
      name: 'benign',
      colour: 'green'
    }, {
      name: 'possibly_damaging',
      colour: 'orange'
    }, {
      name: 'probably_damaging',
      colour: 'red'
    }, {
      name: 'unknown',
      colour: 'grey'
    }, {
      name: '',
      colour: 'lightgrey'
    }]
  }, {
    name: 'SIFT',
    type: 'category',
    attributeName: 'sift_impact',
    description: 'Colour by SIFT impact (canonical transcript).',
    values: [{
      name: 'deleterious',
      colour: 'red'
    }, {
      name: 'tolerated',
      colour: 'green'
    }, {
      name: 'deleterious_low_confidence',
      colour: 'lightcoral'
    }, {
      name: 'tolerated_low_confidence',
      colour: 'lightgreen'
    }, {
      name: '',
      colour: 'lightgrey'
    }]
  }, {
    name: 'Mutation Subtype',
    type: 'category',
    attributeName: 'mutationSubtype',
    description: 'Colour by the type of mutation.',
    values: [{
      name: 'Single base substitution',
      colour: 'green'
    }, {
      name: 'Small deletion',
      colour: 'red'
    }, {
      name: 'Small insertion',
      colour: 'blue'
    }, {
      name: '',
      colour: 'lightgrey'
    }]
  }, {
    name: 'Mutation Count',
    type: 'threshold',
    description: 'Colour by mutation occurrence count across the current cohort.',
    attributeName: 'score',
    values: [{
      name: 'Count',
      colour1: 'red',
      colour2: 'blue',
      threshold: 2
    }]
  }, {
    name: 'Mutation Frequency',
    type: 'percentage',
    description: 'Frequency of mutation occurrence across the current cohort.',
    attributeName: 'percentage',
    values: [{
      name: 'Percentage',
      colour1: 'dark green',
      colour2: 'light green'
    }]
  }];
  var geneHighlightFeatures = [{
    name: 'Is Cancer Gene Census',
    attributeName: 'isCancerGeneCensus',
    type: 'boolean',
    description: 'Colour by cancer gene census status.',
    values: [{
      name: 'Is Cancer Gene Census',
      colour1: 'red',
      colour2: 'blue'
    }]
  }];

  var ColourFeaturesF = (function (jbrowse) {
    var React = jbrowse.jbrequire('react');
    var useState = React.useState;

    var _jbrowse$jbrequire = jbrowse.jbrequire('mobx-react'),
        observer = _jbrowse$jbrequire.observer;

    var _jbrowse$jbrequire2 = jbrowse.jbrequire('@material-ui/core/styles'),
        makeStyles = _jbrowse$jbrequire2.makeStyles;

    var _jbrowse$jbrequire3 = jbrowse.jbrequire('@material-ui/core'),
        Typography = _jbrowse$jbrequire3.Typography,
        MenuItem = _jbrowse$jbrequire3.MenuItem,
        FormControl = _jbrowse$jbrequire3.FormControl,
        Select = _jbrowse$jbrequire3.Select,
        Tooltip = _jbrowse$jbrequire3.Tooltip,
        Table = _jbrowse$jbrequire3.Table,
        TableBody = _jbrowse$jbrequire3.TableBody,
        TableCell = _jbrowse$jbrequire3.TableCell,
        TableHead = _jbrowse$jbrequire3.TableHead,
        TableRow = _jbrowse$jbrequire3.TableRow;

    var useStyles = makeStyles(function (theme) {
      return {
        root: {
          padding: theme.spacing(1, 3, 1, 1),
          background: theme.palette.background["default"],
          overflowX: 'hidden'
        },
        formControl: {
          margin: theme.spacing(1),
          minWidth: 150
        },
        text: {
          display: 'flex',
          alignItems: 'center'
        }
      };
    });
    /**
     * Render a highlight/colour by element for colouring features
     */

    var HighlightFeature = observer(function (_ref) {
      var schema = _ref.schema,
          type = _ref.type;
      var classes = useStyles();

      var _useState = useState(schema.getColourBy()),
          _useState2 = _slicedToArray(_useState, 2),
          colourBy = _useState2[0],
          setColourBy = _useState2[1];

      var highlightFeatures = type === 'mutation' ? mutationHighlightFeatures : geneHighlightFeatures;

      var handleChangeHighlightBy = function handleChangeHighlightBy(event) {
        var hlBy = event.target.value;
        setColourBy(hlBy);
        var colourFunction = '';

        if (hlBy.type === 'threshold') {
          colourFunction = "function(feature) { if (feature.get('".concat(hlBy.attributeName, "') >= ").concat(hlBy.values[0].threshold, ") {return '").concat(hlBy.values[0].colour1, "'; } else {return '").concat(hlBy.values[0].colour2, "'; } }");
        } else if (hlBy.type === 'category') {
          if (hlBy.name === 'VEP' || hlBy.name === 'SIFT' || hlBy.name === 'PolyPhen') {
            var switchStatement = "switch(impact) {";
            hlBy.values.forEach(function (element) {
              switchStatement += "case '".concat(element.name, "': return '").concat(element.colour, "'; break;");
            });
            switchStatement += '}';
            colourFunction = "function(feature) { const filteredConsequences = feature.get('consequence').hits.edges.filter(cons => cons.node.transcript.is_canonical); const impact = filteredConsequences[0].node.transcript.annotation.".concat(hlBy.attributeName, "; ").concat(switchStatement, "}");
          } else {
            var _switchStatement = "switch(attrValue) {";
            hlBy.values.forEach(function (element) {
              _switchStatement += "case '".concat(element.name, "': return '").concat(element.colour, "'; break;");
            });
            _switchStatement += '}';
            colourFunction = "function(feature) { const attrValue = feature.get('".concat(hlBy.attributeName, "'); ").concat(_switchStatement, "}");
          }
        } else if (hlBy.type === 'boolean') {
          colourFunction = "function(feature) { if (feature.get('".concat(hlBy.attributeName, "')) {return '").concat(hlBy.values[0].colour1, "'; } else {return '").concat(hlBy.values[0].colour2, "'; } }");
        } else if (hlBy.type === 'percentage') {
          colourFunction = "function(feature) { const logValue = feature.get('".concat(hlBy.attributeName, "'); return 'rgb(0,' + logValue + ',0)' }");
        } else {
          colourFunction = "function(feature) { return 'goldenrod' }";
        } // Set to function


        schema.target.displays[0].renderer.color1.set(colourFunction); // Set to colour array element

        schema.setColourBy(JSON.stringify(hlBy));
        schema.target.adapter.colourBy.set(JSON.stringify(hlBy));
      };

      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Typography, {
        variant: "h6",
        className: classes.text
      }, "Colour Features", /*#__PURE__*/React.createElement(Tooltip, {
        title: "Colour features on track based on feature attributes",
        "aria-label": "help",
        placement: "right"
      }, /*#__PURE__*/React.createElement(HelpIcon, null))), /*#__PURE__*/React.createElement(FormControl, {
        className: classes.formControl
      }, /*#__PURE__*/React.createElement(Select, {
        labelId: "category-select-label",
        id: "category-select",
        value: colourBy,
        onChange: handleChangeHighlightBy
      }, /*#__PURE__*/React.createElement(MenuItem, {
        disabled: true,
        value: ""
      }, /*#__PURE__*/React.createElement("em", null, "Attribute")), highlightFeatures.map(function (element) {
        return /*#__PURE__*/React.createElement(MenuItem, {
          value: element,
          key: element.name
        }, element.name);
      }))), colourBy && colourBy.values && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Typography, {
        variant: "subtitle2",
        className: classes.text
      }, colourBy.description), colourBy.values && colourBy.type === 'category' && /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, null, "Value"), /*#__PURE__*/React.createElement(TableCell, null, "Colour"))), /*#__PURE__*/React.createElement(TableBody, null, colourBy.values && colourBy.values.map(function (value) {
        return /*#__PURE__*/React.createElement(TableRow, {
          key: value.name
        }, /*#__PURE__*/React.createElement(TableCell, null, value.name !== '' ? value.name : 'n/a'), /*#__PURE__*/React.createElement(TableCell, null, value.colour));
      }))), colourBy.values && colourBy.type === 'threshold' && /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, null, "Value"), /*#__PURE__*/React.createElement(TableCell, null, "Threshold"), /*#__PURE__*/React.createElement(TableCell, null, "Below"), /*#__PURE__*/React.createElement(TableCell, null, "Equal or Above"))), /*#__PURE__*/React.createElement(TableBody, null, colourBy.values && colourBy.values.map(function (value) {
        return /*#__PURE__*/React.createElement(TableRow, {
          key: value.name
        }, /*#__PURE__*/React.createElement(TableCell, null, value.name !== '' ? value.name : 'n/a'), /*#__PURE__*/React.createElement(TableCell, null, value.threshold), /*#__PURE__*/React.createElement(TableCell, null, value.colour2), /*#__PURE__*/React.createElement(TableCell, null, value.colour1));
      }))), colourBy.values && colourBy.type === 'boolean' && /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, null, "Value"), /*#__PURE__*/React.createElement(TableCell, null, "True"), /*#__PURE__*/React.createElement(TableCell, null, "False"))), /*#__PURE__*/React.createElement(TableBody, null, colourBy.values && colourBy.values.map(function (value) {
        return /*#__PURE__*/React.createElement(TableRow, {
          key: value.name
        }, /*#__PURE__*/React.createElement(TableCell, null, value.name !== '' ? value.name : 'n/a'), /*#__PURE__*/React.createElement(TableCell, null, value.colour1), /*#__PURE__*/React.createElement(TableCell, null, value.colour2));
      }))), colourBy.values && colourBy.type === 'percentage' && /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, null, "Value"), /*#__PURE__*/React.createElement(TableCell, null, "Low"), /*#__PURE__*/React.createElement(TableCell, null, "High"))), /*#__PURE__*/React.createElement(TableBody, null, colourBy.values && colourBy.values.map(function (value) {
        return /*#__PURE__*/React.createElement(TableRow, {
          key: value.name
        }, /*#__PURE__*/React.createElement(TableCell, null, value.name !== '' ? value.name : 'n/a'), /*#__PURE__*/React.createElement(TableCell, null, value.colour1), /*#__PURE__*/React.createElement(TableCell, null, value.colour2));
      })))));
    });
    return {
      HighlightFeature: HighlightFeature
    };
  });

  var TrackTypeF = (function (pluginManager) {
    var makeStyles = pluginManager.lib['@material-ui/core/styles'].makeStyles;
    var observer = pluginManager.lib['mobx-react'].observer;
    var React = pluginManager.lib.react;
    var _pluginManager$lib$M = pluginManager.lib['@material-ui/core'],
        Typography = _pluginManager$lib$M.Typography,
        MenuItem = _pluginManager$lib$M.MenuItem,
        FormControl = _pluginManager$lib$M.FormControl,
        Select = _pluginManager$lib$M.Select,
        List = _pluginManager$lib$M.List,
        ListItem = _pluginManager$lib$M.ListItem;
    var Tooltip = pluginManager.lib['@material-ui/core/Tooltip'];
    var useStyles = makeStyles(function (theme) {
      return {
        root: {
          padding: theme.spacing(1, 3, 1, 1),
          background: theme.palette.background["default"],
          overflowX: 'hidden'
        },
        formControl: {
          margin: theme.spacing(1),
          minWidth: 150
        },
        text: {
          display: 'flex',
          alignItems: 'center'
        }
      };
    });
    /**
     * A component for changing the track type
     */

    return observer(function (schema) {
      var classes = useStyles();

      var _React$useState = React.useState(schema.schema.target.adapter.featureType.value),
          _React$useState2 = _slicedToArray(_React$useState, 2),
          trackType = _React$useState2[0],
          setTrackType = _React$useState2[1];

      var handleChange = function handleChange(event) {
        setTrackType(event.target.value);
        schema.schema.target.adapter.featureType.set(event.target.value); // Set to function

        schema.schema.target.displays[0].renderer.color1.set("function(feature) { return 'goldenrod' }"); // Set to colour array element

        schema.schema.setColourBy('{}');
        schema.schema.target.adapter.colourBy.set('{}');
      };

      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Typography, {
        variant: "h6",
        className: classes.text
      }, "Track Type", /*#__PURE__*/React.createElement(Tooltip, {
        title: "Set the type of features to grab from the GDC portal",
        "aria-label": "help",
        placement: "right"
      }, /*#__PURE__*/React.createElement(HelpIcon, null))), /*#__PURE__*/React.createElement(List, null, /*#__PURE__*/React.createElement(ListItem, null, /*#__PURE__*/React.createElement(FormControl, {
        className: classes.formControl
      }, /*#__PURE__*/React.createElement(Select, {
        labelId: "track-type-select-label",
        id: "track-type-select",
        value: trackType,
        onChange: handleChange,
        displayEmpty: true
      }, /*#__PURE__*/React.createElement(MenuItem, {
        disabled: true,
        value: ""
      }, /*#__PURE__*/React.createElement("em", null, "Track type")), /*#__PURE__*/React.createElement(MenuItem, {
        value: "mutation"
      }, "Mutation"), /*#__PURE__*/React.createElement(MenuItem, {
        value: "gene"
      }, "Gene"))))));
    });
  });

  var GDCFilterComponentF = (function (jbrowse) {
    var _jbrowse$jbrequire = jbrowse.jbrequire('@material-ui/core'),
        makeStyles = _jbrowse$jbrequire.makeStyles,
        Typography = _jbrowse$jbrequire.Typography,
        Tooltip = _jbrowse$jbrequire.Tooltip;

    var _jbrowse$jbrequire2 = jbrowse.jbrequire('mobx-react'),
        observer = _jbrowse$jbrequire2.observer,
        MobxPropTypes = _jbrowse$jbrequire2.PropTypes;

    var React = jbrowse.lib.react;
    var useState = React.useState,
        useEffect = React.useEffect;

    var _jbrowse$jbrequire3 = jbrowse.jbrequire('@material-ui/lab'),
        Alert = _jbrowse$jbrequire3.Alert;

    var _jbrowse$jbrequire4 = jbrowse.jbrequire(FiltersF),
        FilterList = _jbrowse$jbrequire4.FilterList;

    var _jbrowse$jbrequire5 = jbrowse.jbrequire(ColourFeaturesF),
        HighlightFeature = _jbrowse$jbrequire5.HighlightFeature;

    var TrackType = jbrowse.jbrequire(TrackTypeF);
    var useStyles = makeStyles(function (theme) {
      return {
        root: {
          padding: theme.spacing(1, 3, 1, 1),
          background: theme.palette.background["default"],
          overflowX: 'hidden'
        },
        formControl: {
          margin: theme.spacing(1),
          minWidth: 150
        },
        filterCard: {
          margin: theme.spacing(1)
        },
        text: {
          display: 'flex',
          alignItems: 'center'
        }
      };
    });
    /**
     * Creates the form for interacting with the track filters
     */

    var GDCQueryBuilder = observer(function (_ref) {
      var schema = _ref.schema;

      var _useState = useState(true),
          _useState2 = _slicedToArray(_useState, 2),
          isValidGDCFilter = _useState2[0],
          setIsValidGDCFilter = _useState2[1];

      var _useState3 = useState(true),
          _useState4 = _slicedToArray(_useState3, 2),
          isValidColourBy = _useState4[0],
          setIsValidColourBy = _useState4[1];

      var _useState5 = useState(''),
          _useState6 = _slicedToArray(_useState5, 2),
          validationMessage = _useState6[0],
          setFilterValidationMessage = _useState6[1];

      var _useState7 = useState(''),
          _useState8 = _slicedToArray(_useState7, 2),
          colourValidationMessage = _useState8[0],
          setColourValidationMessage = _useState8[1];

      schema.clearFilters();
      useEffect(function () {
        try {
          var filters = JSON.parse(schema.target.adapter.filters.value);

          if (filters.content && filters.content.length > 0) {
            var _iterator = _createForOfIteratorHelper(filters.content),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var filter = _step.value;
                var type = void 0;

                if (filter.content.field.startsWith('cases.')) {
                  type = 'case';
                } else if (filter.content.field.startsWith('ssms.')) {
                  type = 'ssm';
                } else if (filter.content.field.startsWith('genes.')) {
                  type = 'gene';
                } else {
                  setIsValidGDCFilter(false);
                  setFilterValidationMessage("The filter ".concat(filter.content.field, " is missing a type prefix and is invalid. Any changes on this panel will overwrite invalid filters."));
                }

                if (type) {
                  var name = filter.content.field.replace("".concat(type, "s."), '');
                  schema.addFilter(v4(), name, type, filter.content.value.join(','));
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        } catch (error) {
          setIsValidGDCFilter(false);
          setFilterValidationMessage('The current filters are not in the expected format. Any changes on this panel will overwrite invalid filters.');
        }
      }, [schema]);
      useEffect(function () {
        try {
          var colourBy = JSON.parse(schema.target.adapter.colourBy.value);
          var expectedAttributes = ['name', 'type', 'attributeName', 'values', 'description'];
          var matchingKeys = true;
          expectedAttributes.forEach(function (key) {
            if (!(key in colourBy)) {
              matchingKeys = false;
            }
          });

          if (matchingKeys || Object.keys(colourBy).length === 0) {
            schema.setColourBy(colourBy);
          } else {
            setIsValidColourBy(false);
            setColourValidationMessage('The current colour by option is not in the expected format. Any changes on this panel will overwrite the invalid selection.');
          }
        } catch (error) {
          setIsValidColourBy(false);
          setColourValidationMessage('The current colour by option is not in the expected format. Any changes on this panel will overwrite the invalid selection.');
        }
      }, [schema]);
      var classes = useStyles();
      return /*#__PURE__*/React.createElement(React.Fragment, null, !isValidGDCFilter && /*#__PURE__*/React.createElement(Alert, {
        severity: "info"
      }, validationMessage), /*#__PURE__*/React.createElement(TrackType, {
        schema: schema
      }), /*#__PURE__*/React.createElement(Typography, {
        variant: "h6",
        className: classes.text
      }, "Filters", /*#__PURE__*/React.createElement(Tooltip, {
        title: "Apply filters to the current track",
        "aria-label": "help",
        placement: "right"
      }, /*#__PURE__*/React.createElement(HelpIcon, null))), /*#__PURE__*/React.createElement(FilterList, {
        schema: schema,
        type: "case",
        facets: caseFacets
      }), /*#__PURE__*/React.createElement(FilterList, {
        schema: schema,
        type: "gene",
        facets: geneFacets
      }), /*#__PURE__*/React.createElement(FilterList, {
        schema: schema,
        type: "ssm",
        facets: ssmFacets
      }), !isValidColourBy && /*#__PURE__*/React.createElement(Alert, {
        severity: "info"
      }, colourValidationMessage), schema.target.adapter.featureType.value === 'mutation' && /*#__PURE__*/React.createElement(HighlightFeature, {
        schema: schema,
        type: "mutation"
      }), schema.target.adapter.featureType.value === 'gene' && /*#__PURE__*/React.createElement(HighlightFeature, {
        schema: schema,
        type: "gene"
      }));
    });

    function ConfigurationEditor(_ref2) {
      var model = _ref2.model;
      var classes = useStyles();
      return /*#__PURE__*/React.createElement("div", {
        className: classes.root,
        "data-testid": "configEditor"
      }, !model.target ? 'no target set' : /*#__PURE__*/React.createElement(GDCQueryBuilder, {
        schema: model,
        key: "configEditor"
      }));
    }

    ConfigurationEditor.propTypes = {
      model: MobxPropTypes.objectOrObservableObject.isRequired
    };
    return observer(ConfigurationEditor);
  });

  var GDCFilterWidget = (function (jbrowse) {
    var React = jbrowse.lib.react;
    var ReactComponent = jbrowse.load(GDCFilterComponentF);
    var ConfigurationSchema = jbrowse.lib['@jbrowse/core/configuration'].ConfigurationSchema;
    var observer = jbrowse.lib['mobx-react'].observer;
    return {
      configSchema: ConfigurationSchema('GDCFilterWidget', {}),
      ReactComponent: ReactComponent,
      stateModel: jbrowse.load(stateModel),
      HeadingComponent: observer(function () {
        return React.createElement(React.Fragment, null, "GDC Filters");
      })
    };
  });

  var Remove = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;

  var _react = interopRequireDefault(react);

  var _createSvgIcon = interopRequireDefault(createSvgIcon_1);

  var _default = (0, _createSvgIcon.default)(_react.default.createElement("path", {
    d: "M19 13H5v-2h14v2z"
  }), 'Remove');

  exports.default = _default;
  });

  var RemoveIcon = unwrapExports(Remove);

  var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
     module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  /**
   * Query the GDC API for project information related to the given gene
   * @param {String} featureId Gene ID
   */
  function getGeneProjectsAsync(_x) {
    return _getGeneProjectsAsync.apply(this, arguments);
  }
  /**
   * Query the GDC API for project information related to the given mutation
   * @param {String} featureId Mutation ID
   */

  function _getGeneProjectsAsync() {
    _getGeneProjectsAsync = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(featureId) {
      var query, response, result;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = {
                query: "query ProjectTable( $caseAggsFilters: FiltersArgument $ssmTested: FiltersArgument $cnvGain: FiltersArgument $cnvLoss: FiltersArgument $cnvTested: FiltersArgument $projectCount: Int ) { viewer { explore { cases { gain: aggregations(filters: $cnvGain) { project__project_id { buckets { docCount: doc_count projectId: key } } } loss: aggregations(filters: $cnvLoss) { project__project_id { buckets { docCount: doc_count projectId: key } } } cnvTotal: aggregations(filters: $cnvTested) { project__project_id { buckets { docCount: doc_count projectId: key } } } filtered: aggregations(filters: $caseAggsFilters) { project__project_id { buckets { docCount: doc_count projectId: key } } } total: aggregations(filters: $ssmTested) { project__project_id { buckets { docCount: doc_count projectId: key } } } } } } projects { hits(first: $projectCount) { edges { node { primary_site disease_type project_id id } } } } }",
                variables: {
                  caseAggsFilters: {
                    op: 'and',
                    content: [{
                      op: 'in',
                      content: {
                        field: 'cases.available_variation_data',
                        value: ['ssm']
                      }
                    }, {
                      op: 'NOT',
                      content: {
                        field: 'cases.gene.ssm.observation.observation_id',
                        value: 'MISSING'
                      }
                    }, {
                      op: 'in',
                      content: {
                        field: 'genes.gene_id',
                        value: [featureId]
                      }
                    }]
                  },
                  ssmTested: {
                    op: 'and',
                    content: [{
                      op: 'in',
                      content: {
                        field: 'cases.available_variation_data',
                        value: ['ssm']
                      }
                    }]
                  },
                  cnvGain: {
                    op: 'and',
                    content: [{
                      op: 'in',
                      content: {
                        field: 'cases.available_variation_data',
                        value: ['cnv']
                      }
                    }, {
                      op: 'in',
                      content: {
                        field: 'cnvs.cnv_change',
                        value: ['Gain']
                      }
                    }, {
                      op: 'in',
                      content: {
                        field: 'genes.gene_id',
                        value: [featureId]
                      }
                    }]
                  },
                  cnvLoss: {
                    op: 'and',
                    content: [{
                      op: 'in',
                      content: {
                        field: 'cases.available_variation_data',
                        value: ['cnv']
                      }
                    }, {
                      op: 'in',
                      content: {
                        field: 'cnvs.cnv_change',
                        value: ['Loss']
                      }
                    }, {
                      op: 'in',
                      content: {
                        field: 'genes.gene_id',
                        value: [featureId]
                      }
                    }]
                  },
                  cnvTested: {
                    op: 'and',
                    content: [{
                      op: 'in',
                      content: {
                        field: 'cases.available_variation_data',
                        value: ['cnv']
                      }
                    }]
                  },
                  projectCount: 100
                }
              };
              _context.next = 3;
              return fetch('https://api.gdc.cancer.gov/v0/graphql/geneProjects', {
                method: 'POST',
                body: JSON.stringify(query),
                headers: {
                  'Content-Type': 'application/json'
                }
              });

            case 3:
              response = _context.sent;
              _context.next = 6;
              return response.json();

            case 6:
              result = _context.sent;
              return _context.abrupt("return", result);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _getGeneProjectsAsync.apply(this, arguments);
  }

  function getMutationProjectsAsync(_x2) {
    return _getMutationProjectsAsync.apply(this, arguments);
  }

  function _getMutationProjectsAsync() {
    _getMutationProjectsAsync = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(featureId) {
      var query, response, result;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              query = {
                query: "query projectsTable($ssmTested: FiltersArgument, $caseAggsFilter: FiltersArgument, $projectCount: Int) { viewer { explore { cases { filtered: aggregations(filters: $caseAggsFilter) { project__project_id { buckets { docCount: doc_count projectId: key } } } total: aggregations(filters: $ssmTested) { project__project_id { buckets { docCount: doc_count projectId: key } } } } } } projects { hits(first: $projectCount) { edges { node { primary_site disease_type project_id id } } } } }",
                variables: {
                  ssmTested: {
                    op: 'and',
                    content: [{
                      op: 'in',
                      content: {
                        field: 'cases.available_variation_data',
                        value: ['ssm']
                      }
                    }]
                  },
                  caseAggsFilter: {
                    op: 'and',
                    content: [{
                      op: 'in',
                      content: {
                        field: 'ssms.ssm_id',
                        value: [featureId]
                      }
                    }, {
                      op: 'in',
                      content: {
                        field: 'cases.available_variation_data',
                        value: ['ssm']
                      }
                    }]
                  },
                  projectCount: 100
                }
              };
              _context2.next = 3;
              return fetch('https://api.gdc.cancer.gov/v0/graphql/mutationProjects', {
                method: 'POST',
                body: JSON.stringify(query),
                headers: {
                  'Content-Type': 'application/json'
                }
              });

            case 3:
              response = _context2.sent;
              _context2.next = 6;
              return response.json();

            case 6:
              result = _context2.sent;
              return _context2.abrupt("return", result);

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _getMutationProjectsAsync.apply(this, arguments);
  }

  var GDCFeatureWidgetF = (function (jbrowse) {
    var _jbrowse$jbrequire = jbrowse.jbrequire('@material-ui/core'),
        Divider = _jbrowse$jbrequire.Divider,
        Paper = _jbrowse$jbrequire.Paper,
        Table = _jbrowse$jbrequire.Table,
        TableBody = _jbrowse$jbrequire.TableBody,
        TableCell = _jbrowse$jbrequire.TableCell,
        TableHead = _jbrowse$jbrequire.TableHead,
        TableRow = _jbrowse$jbrequire.TableRow,
        Chip = _jbrowse$jbrequire.Chip,
        Tooltip = _jbrowse$jbrequire.Tooltip,
        Link = _jbrowse$jbrequire.Link;

    var _jbrowse$jbrequire2 = jbrowse.jbrequire('@material-ui/core/styles'),
        makeStyles = _jbrowse$jbrequire2.makeStyles;

    var _jbrowse$jbrequire3 = jbrowse.jbrequire('mobx-react'),
        observer = _jbrowse$jbrequire3.observer,
        MobxPropTypes = _jbrowse$jbrequire3.PropTypes;

    var PropTypes = jbrowse.jbrequire('prop-types');
    var React = jbrowse.jbrequire('react');
    var useState = React.useState,
        useEffect = React.useEffect;

    var _jbrowse$jbrequire4 = jbrowse.jbrequire('@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'),
        BaseFeatureDetails = _jbrowse$jbrequire4.BaseFeatureDetails,
        BaseCard = _jbrowse$jbrequire4.BaseCard;

    var useStyles = makeStyles(function () {
      return {
        table: {
          padding: 0
        },
        link: {
          color: 'rgb(0, 0, 238)'
        }
      };
    });
    /**
     * Render the consequence table for a simple somatic mutation
     * @param {*} props
     */

    function Consequence(props) {
      var classes = useStyles();
      var feature = props.feature;

      if (!feature.consequence) {
        return null;
      }

      var consequences = feature.consequence.hits.edges;
      return /*#__PURE__*/React.createElement(BaseCard, {
        title: "Consequence"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          maxHeight: 600,
          overflow: 'auto'
        }
      }, /*#__PURE__*/React.createElement(Table, {
        className: classes.table
      }, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, null, "Gene"), /*#__PURE__*/React.createElement(TableCell, null, "AA Change"), /*#__PURE__*/React.createElement(TableCell, null, "Consequence"), /*#__PURE__*/React.createElement(TableCell, null, "Coding DNA Change"), /*#__PURE__*/React.createElement(TableCell, null, "Impact"), /*#__PURE__*/React.createElement(TableCell, null, "Gene Strand"), /*#__PURE__*/React.createElement(TableCell, null, "Transcript"))), /*#__PURE__*/React.createElement(TableBody, null, Object.entries(consequences).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return value && /*#__PURE__*/React.createElement(TableRow, {
          key: key
        }, /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement(Link, {
          className: classes.link,
          target: "_blank",
          rel: "noopener",
          href: "https://portal.gdc.cancer.gov/genes/".concat(value.node.transcript.gene.gene_id),
          underline: "always"
        }, value.node.transcript.gene.symbol)), /*#__PURE__*/React.createElement(TableCell, null, value.node.transcript.aa_change), /*#__PURE__*/React.createElement(TableCell, null, value.node.transcript.consequence_type), /*#__PURE__*/React.createElement(TableCell, null, value.node.transcript.annotation.hgvsc), /*#__PURE__*/React.createElement(TableCell, null, value.node.transcript.annotation.vep_impact && /*#__PURE__*/React.createElement(Tooltip, {
          title: "VEP ".concat(value.node.transcript.annotation.vep_impact),
          "aria-label": "help",
          placement: "left"
        }, /*#__PURE__*/React.createElement(Chip, {
          label: value.node.transcript.annotation.vep_impact
        })), value.node.transcript.annotation.sift_impact && /*#__PURE__*/React.createElement(Tooltip, {
          title: "SIFT ".concat(value.node.transcript.annotation.sift_impact, " (").concat(value.node.transcript.annotation.sift_score, ")"),
          "aria-label": "help",
          placement: "left"
        }, /*#__PURE__*/React.createElement(Chip, {
          label: value.node.transcript.annotation.sift_impact
        })), value.node.transcript.annotation.polyphen_impact && /*#__PURE__*/React.createElement(Tooltip, {
          title: "PolyPhen ".concat(value.node.transcript.annotation.polyphen_impact, " (").concat(value.node.transcript.annotation.polyphen_score, ")"),
          "aria-label": "help",
          placement: "left"
        }, /*#__PURE__*/React.createElement(Chip, {
          label: value.node.transcript.annotation.polyphen_impact
        }))), /*#__PURE__*/React.createElement(TableCell, null, value.node.transcript.gene.gene_strand === 1 ? /*#__PURE__*/React.createElement(AddIcon, null) : /*#__PURE__*/React.createElement(RemoveIcon, null)), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement(Link, {
          className: classes.link,
          target: "_blank",
          rel: "noopener",
          href: "http://may2015.archive.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=".concat(value.node.transcript.transcript_id),
          underline: "always"
        }, value.node.transcript.transcript_id), value.node.transcript.is_canonical && /*#__PURE__*/React.createElement(Tooltip, {
          title: "Canonical transcript",
          "aria-label": "help",
          placement: "right"
        }, /*#__PURE__*/React.createElement(Chip, {
          label: "C"
        }))));
      })))));
    }

    Consequence.propTypes = {
      feature: PropTypes.shape().isRequired
    };
    /**
     * Render a single table row for an external link
     */

    var ExternalLink = observer(function (props) {
      var classes = useStyles();
      var id = props.id,
          name = props.name,
          link = props.link;
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TableRow, {
        key: "".concat(id, "-").concat(name)
      }, /*#__PURE__*/React.createElement(TableCell, null, name), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement(Link, {
        className: classes.link,
        target: "_blank",
        rel: "noopener",
        href: "".concat(link).concat(id),
        underline: "always"
      }, id))));
    });
    /**
     * Render a section for external gene links
     * @param {*} props
     */

    function GeneExternalLinks(props) {
      var classes = useStyles();
      var feature = props.feature;
      var externalLinkArray = [{
        id: feature.geneId,
        name: 'GDC',
        link: 'https://portal.gdc.cancer.gov/genes/'
      }, {
        id: feature.geneId,
        name: 'ENSEMBL',
        link: 'http://www.ensembl.org/id/'
      }, {
        id: feature.canonicalTranscriptId,
        name: 'Canonical Transcript ID',
        link: 'http://www.ensembl.org/id/'
      }, {
        id: feature.externalDbIds.hgnc[0],
        name: 'HGNC',
        link: 'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/'
      }, {
        id: feature.externalDbIds.uniprotkbSwissprot[0],
        name: 'UniProtKB Swiss-Prot',
        link: 'http://www.uniprot.org/uniprot/'
      }, {
        id: feature.externalDbIds.entrezGene[0],
        name: 'NCBI',
        link: 'http://www.ncbi.nlm.nih.gov/gene/'
      }, {
        id: feature.externalDbIds.omimGene[0],
        name: 'OMIM',
        link: 'https://www.omim.org/entry/'
      }];
      return /*#__PURE__*/React.createElement(BaseCard, {
        title: "External Links"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          maxHeight: 600,
          overflow: 'auto'
        }
      }, /*#__PURE__*/React.createElement(Table, {
        className: classes.table
      }, /*#__PURE__*/React.createElement(TableBody, null, externalLinkArray.map(function (externalLink, key) {
        return /*#__PURE__*/React.createElement(ExternalLink, _extends({}, externalLink, {
          key: key
        }));
      })))));
    }

    GeneExternalLinks.propTypes = {
      feature: PropTypes.shape().isRequired
    };
    /**
     * Removes prefix from cosmic ID
     * @param {*} cosmicId Cosmic ID for a mutation
     */

    function removeCosmicPrefix(cosmicId) {
      var cosmicIdNoPrefix = cosmicId.replace('COSM', '');
      cosmicIdNoPrefix = cosmicIdNoPrefix.replace('COSN', '');
      return cosmicIdNoPrefix;
    }
    /**
     * Render a row with cosmic links for a mutation
     */


    var CosmicLinks = observer(function (props) {
      var classes = useStyles();
      var cosmicId = props.cosmicId;
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TableRow, {
        key: "0"
      }, /*#__PURE__*/React.createElement(TableCell, null, "Cosmic"), /*#__PURE__*/React.createElement(TableCell, null, cosmicId && cosmicId.map(function (value) {
        return /*#__PURE__*/React.createElement(Link, {
          className: classes.link,
          target: "_blank",
          rel: "noopener",
          href: "https://cancer.sanger.ac.uk/cosmic/mutation/overview?id=".concat(removeCosmicPrefix(value)),
          key: value,
          underline: "always"
        }, value);
      }))));
    });
    CosmicLinks.propTypes = {
      cosmicId: PropTypes.array.isRequired
    };
    /**
     * Render a section for external mutation links
     * @param {*} props
     */

    function SSMExternalLinks(props) {
      var classes = useStyles();
      var feature = props.feature;
      var externalLinkArray = [{
        id: feature.ssmId,
        name: 'GDC',
        link: 'https://portal.gdc.cancer.gov/ssms/'
      }];
      return /*#__PURE__*/React.createElement(BaseCard, {
        title: "External Links"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          maxHeight: 600,
          overflow: 'auto'
        }
      }, /*#__PURE__*/React.createElement(Table, {
        className: classes.table
      }, /*#__PURE__*/React.createElement(TableBody, null, externalLinkArray.map(function (externalLink, key) {
        return /*#__PURE__*/React.createElement(ExternalLink, _extends({}, externalLink, {
          key: key
        }));
      }), feature.cosmicId && /*#__PURE__*/React.createElement(CosmicLinks, {
        cosmicId: feature.cosmicId
      })))));
    }

    SSMExternalLinks.propTypes = {
      feature: PropTypes.shape().isRequired
    };
    /**
     * Render a table row for a project related to the mutation
     * @param {*} props
     */

    function SSMProject(props) {
      var classes = useStyles();
      var projectId = props.projectId,
          docCount = props.docCount,
          projectsInformation = props.projectsInformation,
          gdcProjectsCounts = props.gdcProjectsCounts;
      var projectInfo = projectsInformation.find(function (x) {
        return x.node.project_id === projectId;
      });
      var gdcProjectCount = gdcProjectsCounts.find(function (x) {
        return x.projectId === projectId;
      });
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TableRow, {
        key: projectId
      }, /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement(Link, {
        className: classes.link,
        target: "_blank",
        rel: "noopener",
        href: "https://portal.gdc.cancer.gov/projects/".concat(projectId),
        underline: "always"
      }, projectId)), /*#__PURE__*/React.createElement(TableCell, null, projectInfo.node.disease_type.join(', ')), /*#__PURE__*/React.createElement(TableCell, null, projectInfo.node.primary_site.join(', ')), /*#__PURE__*/React.createElement(TableCell, null, docCount, " / ", gdcProjectCount.docCount)));
    }

    SSMProject.propTypes = {
      projectId: PropTypes.string.isRequired,
      docCount: PropTypes.number.isRequired,
      projectsInformation: PropTypes.array.isRequired,
      gdcProjectsCounts: PropTypes.array.isRequired
    };
    /**
     * Render a table of projects based on the selected mutation feature
     * @param {*} props
     */

    function SSMProjects(props) {
      var classes = useStyles();
      var featureId = props.featureId;

      var _useState = useState([]),
          _useState2 = _slicedToArray(_useState, 2),
          mutationProjectsCounts = _useState2[0],
          setMutationProjectsCounts = _useState2[1]; // Case counts for projects associated with the given mutation


      var _useState3 = useState([]),
          _useState4 = _slicedToArray(_useState3, 2),
          projectsInformation = _useState4[0],
          setProjectsInformation = _useState4[1]; // General information regarding all projects


      var _useState5 = useState([]),
          _useState6 = _slicedToArray(_useState5, 2),
          gdcProjectsCounts = _useState6[0],
          setGdcProjectsCounts = _useState6[1]; // Case counts for projects across the GDC


      useEffect(function () {
        getMutationProjectsAsync(featureId).then(function (data) {
          setProjectsInformation(data.data.projects.hits.edges);
          setGdcProjectsCounts(data.data.viewer.explore.cases.total.project__project_id.buckets);
          setMutationProjectsCounts(data.data.viewer.explore.cases.filtered.project__project_id.buckets);
        });
      }, [featureId]);
      return /*#__PURE__*/React.createElement(BaseCard, {
        title: "Projects"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          maxHeight: 600,
          overflow: 'auto'
        }
      }, /*#__PURE__*/React.createElement(Table, {
        className: classes.table
      }, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, null, "Project"), /*#__PURE__*/React.createElement(TableCell, null, "Disease Type"), /*#__PURE__*/React.createElement(TableCell, null, "Site"), /*#__PURE__*/React.createElement(TableCell, null, "# Mutation Affected Cases"))), /*#__PURE__*/React.createElement(TableBody, null, mutationProjectsCounts && projectsInformation && gdcProjectsCounts && mutationProjectsCounts.map(function (project, key) {
        return /*#__PURE__*/React.createElement(SSMProject, _extends({
          projectsInformation: projectsInformation,
          gdcProjectsCounts: gdcProjectsCounts,
          key: "".concat(key, "-").concat(project.projectId)
        }, project));
      })))));
    }

    SSMProjects.propTypes = {
      featureId: PropTypes.string.isRequired
    };
    /**
     * Render a table row for a project related to the gene
     * @param {*} props
     */

    function GeneProject(props) {
      var classes = useStyles();
      var projectId = props.projectId,
          docCount = props.docCount,
          projectsInformation = props.projectsInformation,
          cases = props.cases;
      var projectInfo = projectsInformation.find(function (x) {
        return x.node.project_id === projectId;
      });
      var totalProjectCaseCount = cases.total.project__project_id.buckets.find(function (x) {
        return x.projectId === projectId;
      });
      var cnvGainCaseCount = cases.gain.project__project_id.buckets.find(function (x) {
        return x.projectId === projectId;
      });
      var cnvLossCaseCount = cases.loss.project__project_id.buckets.find(function (x) {
        return x.projectId === projectId;
      });
      var cnvTotalCaseCount = cases.cnvTotal.project__project_id.buckets.find(function (x) {
        return x.projectId === projectId;
      });
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TableRow, {
        key: projectId
      }, /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement(Link, {
        className: classes.link,
        target: "_blank",
        rel: "noopener",
        href: "https://portal.gdc.cancer.gov/projects/".concat(projectId),
        underline: "always"
      }, projectId)), /*#__PURE__*/React.createElement(TableCell, null, projectInfo.node.disease_type.join(', ')), /*#__PURE__*/React.createElement(TableCell, null, projectInfo.node.primary_site.join(', ')), /*#__PURE__*/React.createElement(TableCell, null, docCount, " / ", totalProjectCaseCount.docCount), /*#__PURE__*/React.createElement(TableCell, null, cnvGainCaseCount ? cnvGainCaseCount.docCount : '0', " /", ' ', cnvTotalCaseCount.docCount), /*#__PURE__*/React.createElement(TableCell, null, cnvLossCaseCount ? cnvLossCaseCount.docCount : '0', " /", ' ', cnvTotalCaseCount.docCount)));
    }

    GeneProject.propTypes = {
      projectId: PropTypes.string.isRequired,
      docCount: PropTypes.number.isRequired,
      projectsInformation: PropTypes.array.isRequired,
      cases: PropTypes.object.isRequired
    };
    /**
     * Render a table of projects based on the selected gene feature
     * @param {*} props
     */

    function GeneProjects(props) {
      var classes = useStyles();
      var featureId = props.featureId;

      var _useState7 = useState([]),
          _useState8 = _slicedToArray(_useState7, 2),
          projectsInformation = _useState8[0],
          setProjectsInformation = _useState8[1]; // General information regarding all projects


      var _useState9 = useState([]),
          _useState10 = _slicedToArray(_useState9, 2),
          geneProjectsCounts = _useState10[0],
          setGeneProjectsCounts = _useState10[1]; // Case counts for projects associated with the given gene


      var _useState11 = useState([]),
          _useState12 = _slicedToArray(_useState11, 2),
          cases = _useState12[0],
          setCases = _useState12[1]; // Case counts for various projects and filters


      useEffect(function () {
        getGeneProjectsAsync(featureId).then(function (data) {
          setProjectsInformation(data.data.projects.hits.edges);
          setCases(data.data.viewer.explore.cases);
          setGeneProjectsCounts(data.data.viewer.explore.cases.filtered.project__project_id.buckets);
        });
      }, [featureId]);
      return /*#__PURE__*/React.createElement(BaseCard, _extends({}, props, {
        title: "Projects"
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          maxHeight: 600,
          overflow: 'auto'
        }
      }, /*#__PURE__*/React.createElement(Table, {
        className: classes.table
      }, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, null, "Project"), /*#__PURE__*/React.createElement(TableCell, null, "Disease Type"), /*#__PURE__*/React.createElement(TableCell, null, "Site"), /*#__PURE__*/React.createElement(TableCell, null, "# Mutation Affected Cases"), /*#__PURE__*/React.createElement(TableCell, null, "# CNV Gains"), /*#__PURE__*/React.createElement(TableCell, null, "# CNV Losses"))), /*#__PURE__*/React.createElement(TableBody, null, cases && projectsInformation && geneProjectsCounts && geneProjectsCounts.map(function (project, key) {
        return /*#__PURE__*/React.createElement(GeneProject, _extends({
          cases: cases,
          projectsInformation: projectsInformation,
          key: "".concat(key, "-").concat(project.projectId)
        }, project));
      })))));
    }

    GeneProjects.propTypes = {
      featureId: PropTypes.string.isRequired
    };
    /**
     * Extended feature detail widget for GDC features
     * @param {*} props
     */

    function GDCFeatureDetails(props) {
      var classes = useStyles();
      var model = props.model;
      var feat = JSON.parse(JSON.stringify(model.featureData));

      var rest = _objectWithoutProperties(feat, ["consequence", "geneId", "ssmId", "cosmicId", "canonicalTranscriptId", "externalDbIds", "percentage", "numOfCasesInCohort"]);

      return /*#__PURE__*/React.createElement(Paper, {
        className: classes.root,
        "data-testid": "variant-widget"
      }, /*#__PURE__*/React.createElement(BaseFeatureDetails, _extends({
        feature: rest
      }, props)), /*#__PURE__*/React.createElement(Divider, null), feat.geneId && /*#__PURE__*/React.createElement(GeneExternalLinks, {
        feature: feat
      }), feat.ssmId && /*#__PURE__*/React.createElement(SSMExternalLinks, {
        feature: feat
      }), /*#__PURE__*/React.createElement(Divider, null), feat.ssmId && /*#__PURE__*/React.createElement(Consequence, {
        feature: feat
      }), /*#__PURE__*/React.createElement(Divider, null), feat.geneId && /*#__PURE__*/React.createElement(GeneProjects, {
        featureId: feat.geneId
      }), feat.ssmId && /*#__PURE__*/React.createElement(SSMProjects, {
        featureId: feat.ssmId
      }));
    }

    GDCFeatureDetails.propTypes = {
      model: MobxPropTypes.observableObject.isRequired
    };
    return observer(GDCFeatureDetails);
  });

  var GDCFeatureWidgetF$1 = (function (jbrowse) {
    var _jbrowse$jbrequire = jbrowse.jbrequire('mobx-state-tree'),
        types = _jbrowse$jbrequire.types;

    var configSchema = configuration.ConfigurationSchema('GDCFeatureWidget', {});
    var stateModel = types.model('GDCFeatureWidget', {
      id: mst.ElementId,
      type: types.literal('GDCFeatureWidget'),
      featureData: types.frozen({})
    }).actions(function (self) {
      return {
        setFeatureData: function setFeatureData(data) {
          self.featureData = data;
        },
        clearFeatureData: function clearFeatureData() {
          self.featureData = {};
        }
      };
    });
    var ReactComponent = jbrowse.jbrequire(GDCFeatureWidgetF);
    return {
      configSchema: configSchema,
      stateModel: stateModel,
      ReactComponent: ReactComponent
    };
  });

  var configSchemaF = (function (pluginManager) {
    var baseLinearDisplayConfigSchema = pluginManager.getPlugin('LinearGenomeViewPlugin').exports.baseLinearDisplayConfigSchema;
    return configuration.ConfigurationSchema('LinearGDCDisplay', {
      renderer: pluginManager.pluggableConfigSchemaType('renderer')
    }, {
      baseConfiguration: baseLinearDisplayConfigSchema,
      explicitlyTyped: true
    });
  });

  var FilterList = createCommonjsModule(function (module, exports) {



  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;

  var _react = interopRequireDefault(react);

  var _createSvgIcon = interopRequireDefault(createSvgIcon_1);

  var _default = (0, _createSvgIcon.default)(_react.default.createElement("path", {
    d: "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"
  }), 'FilterList');

  exports.default = _default;
  });

  var FilterListIcon = unwrapExports(FilterList);

  var modelF = (function (jbrowse) {
    var _jbrowse$jbrequire = jbrowse.jbrequire('mobx-state-tree'),
        types = _jbrowse$jbrequire.types;

    var configSchema = jbrowse.jbrequire(configSchemaF);
    var BaseLinearDisplay = jbrowse.getPlugin('LinearGenomeViewPlugin').exports.BaseLinearDisplay;
    return types.compose('LinearGDCDisplay', BaseLinearDisplay, types.model({
      type: types.literal('LinearGDCDisplay'),
      configuration: configuration.ConfigurationReference(configSchema)
    })).actions(function (self) {
      return {
        openFilterConfig: function openFilterConfig() {
          var session = util.getSession(self);
          var editor = session.addWidget('GDCFilterWidget', 'gdcFilter', {
            target: self.parentTrack.configuration
          });
          session.showWidget(editor);
        },
        selectFeature: function selectFeature(feature) {
          var session = util.getSession(self);
          var featureWidget = session.addWidget('GDCFeatureWidget', 'gdcFeature', {
            featureData: feature.toJSON()
          });
          session.showWidget(featureWidget);
          session.setSelection(feature);
        }
      };
    }).views(function (self) {
      return {
        get renderProps() {
          return _objectSpread2(_objectSpread2(_objectSpread2({}, self.composedRenderProps), tracks.getParentRenderProps(self)), {}, {
            config: self.configuration.renderer
          });
        },

        get rendererTypeName() {
          return self.configuration.renderer.type;
        },

        get trackMenuItems() {
          return [{
            label: 'Filter',
            onClick: self.openFilterConfig,
            icon: FilterListIcon
          }];
        }

      };
    });
  });

  var LinearGDCDisplay = (function (pluginManager) {
    return {
      configSchema: pluginManager.jbrequire(configSchemaF),
      stateModel: pluginManager.jbrequire(modelF)
    };
  });

  var GDCAdapterConfigSchema = /*#__PURE__*/configuration.ConfigurationSchema('GDCAdapter', {
    filters: {
      type: 'string',
      defaultValue: '{}',
      description: 'The filters to be applied to the track. Only edit if you know what you are doing.'
    },
    colourBy: {
      type: 'string',
      defaultValue: '{}',
      description: 'Colour features based on track attributes. Only edit if you know what you are doing.'
    },
    featureType: {
      type: 'stringEnum',
      model: /*#__PURE__*/mobxStateTree.types.enumeration('Feature Type', ['mutation', 'gene']),
      defaultValue: 'mutation',
      description: 'The type of track to add'
    },
    cases: {
      type: 'stringArray',
      defaultValue: [],
      description: 'GDC case UUIDs'
    },
    size: {
      type: 'integer',
      defaultValue: 5000,
      description: 'The max number of features to show.'
    }
  }, {
    explicitlyTyped: true
  });

  var GDCFeature = /*#__PURE__*/function () {
    function GDCFeature(args) {
      _classCallCheck(this, GDCFeature);

      this.gdcObject = args.gdcObject;
      this.featureType = args.featureType ? args.featureType : 'mutation';
      this.data = this.dataFromGDCObject(this.gdcObject, this.featureType);
      this.uniqueId = args.id;
    }

    _createClass(GDCFeature, [{
      key: "get",
      value: function get(field) {
        return this.gdcObject[field] || this.data[field];
      }
    }, {
      key: "set",
      value: function set() {}
    }, {
      key: "parent",
      value: function parent() {
        return undefined;
      }
    }, {
      key: "children",
      value: function children() {
        return undefined;
      }
    }, {
      key: "tags",
      value: function tags() {
        var t = [].concat(_toConsumableArray(Object.keys(this.data)), _toConsumableArray(Object.keys(this.gdcObject)));
        return t;
      }
    }, {
      key: "id",
      value: function id() {
        return this.uniqueId;
      } // eslint-disable-next-line @typescript-eslint/no-explicit-any

    }, {
      key: "dataFromGDCObject",
      value: function dataFromGDCObject(gdcObject, featureType) {
        // Defaults to mutation values
        var featureData = {
          refName: gdcObject.chromosome,
          type: gdcObject.mutationType,
          start: gdcObject.startPosition - 1,
          end: gdcObject.endPosition
        };

        switch (featureType) {
          case 'gene':
            {
              featureData.start = gdcObject.geneStart - 1;
              featureData.end = gdcObject.geneEnd;
              featureData.refName = gdcObject.geneChromosome;
              featureData.type = gdcObject.biotype;
              break;
            }
        }

        return featureData;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return _objectSpread2(_objectSpread2({
          uniqueId: this.uniqueId
        }, this.data), this.gdcObject);
      }
    }]);

    return GDCFeature;
  }();

  var GDCAdapter = /*#__PURE__*/function (_BaseFeatureDataAdapt) {
    _inherits(GDCAdapter, _BaseFeatureDataAdapt);

    var _super = /*#__PURE__*/_createSuper(GDCAdapter);

    function GDCAdapter(config) {
      var _this;

      _classCallCheck(this, GDCAdapter);

      _this = _super.call(this, config);
      var filters = configuration.readConfObject(config, 'filters');
      var cases = configuration.readConfObject(config, 'cases');
      var size = configuration.readConfObject(config, 'size');
      var featureType = configuration.readConfObject(config, 'featureType');
      _this.filters = filters;
      _this.cases = cases;
      _this.size = size;
      _this.featureType = featureType;
      return _this;
    }

    _createClass(GDCAdapter, [{
      key: "getRefNames",
      value: function () {
        var _getRefNames = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
          return runtime_1.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", ['chr1', 'chr10', 'chr11', 'chr12', 'chr13', 'chr14', 'chr15', 'chr16', 'chr17', 'chr18', 'chr19', 'chr2', 'chr20', 'chr21', 'chr22', 'chr3', 'chr4', 'chr5', 'chr6', 'chr7', 'chr8', 'chr9', 'chrX', 'chrY']);

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function getRefNames() {
          return _getRefNames.apply(this, arguments);
        }

        return getRefNames;
      }()
    }, {
      key: "getFeatures",
      value: function getFeatures(region, opts) {
        var _this2 = this;

        var refName = region.refName,
            start = region.start,
            end = region.end;
        return rxjs.ObservableCreate( /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(observer) {
            var query, idField, response, result, queryResults, cohortCount, denom, _iterator, _step, hit, gdcObject, feature, _iterator2, _step2, _hit, _gdcObject, _feature;

            return runtime_1.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.prev = 0;
                    query = {};
                    idField = 'ssmId';
                    _context2.t0 = _this2.featureType;
                    _context2.next = _context2.t0 === 'mutation' ? 6 : _context2.t0 === 'gene' ? 9 : 12;
                    break;

                  case 6:
                    query = _this2.createMutationQuery(refName.replace(/chr/, ''), start, end);
                    idField = 'ssmId';
                    return _context2.abrupt("break", 13);

                  case 9:
                    query = _this2.createGeneQuery(refName.replace(/chr/, ''), start, end);
                    idField = 'geneId';
                    return _context2.abrupt("break", 13);

                  case 12:
                    observer.error("Not a valid type: ".concat(_this2.featureType));

                  case 13:
                    _context2.next = 15;
                    return fetch('https://api.gdc.cancer.gov/v0/graphql', {
                      method: 'POST',
                      headers: {
                        'content-type': 'application/json'
                      },
                      body: JSON.stringify(query),
                      signal: opts.signal
                    });

                  case 15:
                    response = _context2.sent;
                    _context2.next = 18;
                    return response.json();

                  case 18:
                    result = _context2.sent;
                    queryResults = result.data.viewer.explore.features.hits.edges;

                    if (_this2.featureType === 'mutation') {
                      cohortCount = result.data.viewer.explore.filteredCases.hits.total;
                      denom = Math.ceil(Math.log10(cohortCount));
                      _iterator = _createForOfIteratorHelper(queryResults);

                      try {
                        for (_iterator.s(); !(_step = _iterator.n()).done;) {
                          hit = _step.value;
                          gdcObject = hit.node;
                          gdcObject.numOfCasesInCohort = cohortCount;
                          gdcObject.percentage = 100 * Math.log10(gdcObject.score) / denom + 100;
                          gdcObject.occurrenceInCohort = "".concat(gdcObject.score, " / ").concat(cohortCount);
                          feature = new GDCFeature({
                            gdcObject: gdcObject,
                            id: gdcObject[idField],
                            featureType: _this2.featureType
                          });
                          observer.next(feature);
                        }
                      } catch (err) {
                        _iterator.e(err);
                      } finally {
                        _iterator.f();
                      }
                    } else {
                      _iterator2 = _createForOfIteratorHelper(queryResults);

                      try {
                        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                          _hit = _step2.value;
                          _gdcObject = _hit.node;
                          _feature = new GDCFeature({
                            gdcObject: _gdcObject,
                            id: _gdcObject[idField],
                            featureType: _this2.featureType
                          });
                          observer.next(_feature);
                        }
                      } catch (err) {
                        _iterator2.e(err);
                      } finally {
                        _iterator2.f();
                      }
                    }

                    _context2.next = 26;
                    break;

                  case 23:
                    _context2.prev = 23;
                    _context2.t1 = _context2["catch"](0);
                    observer.error(_context2.t1);

                  case 26:
                    observer.complete();

                  case 27:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, null, [[0, 23]]);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }(), opts.signal);
      }
    }, {
      key: "freeResources",
      value: function freeResources() {}
      /**
       * Create a GraphQL query for GDC mutations
       * @param ref - chromosome reference
       * @param start - start position
       * @param end - end position
       */

    }, {
      key: "createMutationQuery",
      value: function createMutationQuery(ref, start, end) {
        var ssmQuery = "query mutationsQuery( $size: Int $offset: Int $filters: FiltersArgument $filtersWithoutLocation: FiltersArgument $score: String $sort: [Sort] ) { viewer { explore { filteredCases: cases { hits(first: 0, filters: $filtersWithoutLocation) { total } } features: ssms { hits(first: $size, offset: $offset, filters: $filters, score: $score, sort: $sort) { total edges { node { score startPosition: start_position endPosition: end_position mutationType: mutation_type cosmicId: cosmic_id referenceAllele: reference_allele ncbiBuild: ncbi_build genomicDnaChange: genomic_dna_change mutationSubtype: mutation_subtype ssmId: ssm_id chromosome consequence { hits { edges { node { transcript { is_canonical annotation { vep_impact polyphen_impact polyphen_score sift_score sift_impact hgvsc } consequence_type gene { gene_id symbol gene_strand } aa_change transcript_id } id } } } } } } } } } } }";
        var combinedFilters = this.getFilterQuery(ref, start, end, false);
        var filtersNoLocation = this.getFilterQuery(ref, start, end, true);
        var body = {
          query: ssmQuery,
          variables: {
            size: this.size ? this.size : 5000,
            offset: 0,
            filters: combinedFilters,
            filtersWithoutLocation: filtersNoLocation,
            score: 'occurrence.case.project.project_id',
            sort: [{
              field: '_score',
              order: 'desc'
            }, {
              field: '_uid',
              order: 'asc'
            }]
          }
        };
        return body;
      }
      /**
       * Create a GraphQL query for GDC genes
       * @param ref - chromosome reference
       * @param start - start position
       * @param end - end position
       */

    }, {
      key: "createGeneQuery",
      value: function createGeneQuery(ref, start, end) {
        var geneQuery = "query genesQuery( $filters: FiltersArgument $size: Int $offset: Int $score: String ) { viewer { explore { features: genes { hits(first: $size, offset: $offset, filters: $filters, score: $score) { total edges { node { geneId: gene_id id geneStrand: gene_strand synonyms symbol name geneStart: gene_start geneEnd: gene_end geneChromosome: gene_chromosome description canonicalTranscriptId: canonical_transcript_id externalDbIds: external_db_ids { hgnc omimGene: omim_gene uniprotkbSwissprot: uniprotkb_swissprot entrezGene: entrez_gene } biotype isCancerGeneCensus: is_cancer_gene_census } } } } } } }";
        var combinedFilters = this.getFilterQuery(ref, start, end, false);
        var body = {
          query: geneQuery,
          variables: {
            filters: combinedFilters,
            size: this.size ? this.size : 5000,
            offset: 0,
            score: 'case.project.project_id'
          }
        };
        return body;
      }
      /**
       * Create the full filter based on the given filter, location and case(s)
       * @param chr - chromosome (ex. 1)
       * @param start - start position
       * @param end - end position
       */

    }, {
      key: "getFilterQuery",
      value: function getFilterQuery(chr, start, end, skipLocation) {
        var resultingFilterQuery = {
          op: 'and',
          content: [this.addLocationAndCasesToFilter(chr, start, end, skipLocation)]
        };
        var filterObject = JSON.parse(this.filters);

        if (filterObject && Object.keys(filterObject).length > 0) {
          resultingFilterQuery.content.push(filterObject);
        }

        return resultingFilterQuery;
      }
      /**
       * Create a filter for the current visible location and case(s)
       * @param chr - chromosome (ex. 1)
       * @param start - start position
       * @param end - end position
       */

    }, {
      key: "addLocationAndCasesToFilter",
      value: function addLocationAndCasesToFilter(chr, start, end, skipLocation) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var locationFilter;

        if (!skipLocation) {
          switch (this.featureType) {
            case 'mutation':
              {
                locationFilter = {
                  op: 'and',
                  content: [{
                    op: '>=',
                    content: {
                      field: 'ssms.start_position',
                      value: start
                    }
                  }, {
                    op: '<=',
                    content: {
                      field: 'ssms.end_position',
                      value: end
                    }
                  }, {
                    op: '=',
                    content: {
                      field: 'ssms.chromosome',
                      value: ["chr".concat(chr)]
                    }
                  }]
                };
                break;
              }

            case 'gene':
              {
                locationFilter = {
                  op: 'and',
                  content: [{
                    op: '>=',
                    content: {
                      field: 'genes.gene_start',
                      value: start
                    }
                  }, {
                    op: '<=',
                    content: {
                      field: 'genes.gene_end',
                      value: end
                    }
                  }, {
                    op: '=',
                    content: {
                      field: 'genes.gene_chromosome',
                      value: [chr]
                    }
                  }]
                };
                break;
              }

            default:
              throw new Error("invalid featureType ".concat(this.featureType));
          }
        } else {
          locationFilter = {
            op: 'and',
            content: [{
              op: 'in',
              content: {
                field: 'available_variation_data',
                value: ['ssm']
              }
            }]
          };
        }

        if (this.cases && this.cases.length > 0) {
          var caseFilter = {
            op: 'in',
            content: {
              field: 'cases.case_id',
              value: this.cases
            }
          };
          locationFilter.content.push(caseFilter);
        }

        return locationFilter;
      }
    }]);

    return GDCAdapter;
  }(BaseAdapter.BaseFeatureDataAdapter);
  GDCAdapter.capabilities = ['getFeatures', 'getRefNames'];

  var GDCPlugin = /*#__PURE__*/function (_Plugin) {
    _inherits(GDCPlugin, _Plugin);

    var _super = /*#__PURE__*/_createSuper(GDCPlugin);

    function GDCPlugin() {
      var _this;

      _classCallCheck(this, GDCPlugin);

      _this = _super.apply(this, arguments);
      _this.name = 'GDCPlugin';
      return _this;
    }

    _createClass(GDCPlugin, [{
      key: "install",
      value: function install(pluginManager) {
        var AdapterType = pluginManager.lib['@jbrowse/core/pluggableElementTypes/AdapterType'];
        var TrackType = pluginManager.lib['@jbrowse/core/pluggableElementTypes/TrackType'];
        var WidgetType = pluginManager.lib['@jbrowse/core/pluggableElementTypes/WidgetType'];
        var LGVPlugin = pluginManager.getPlugin('LinearGenomeViewPlugin');
        var BaseLinearDisplayComponent = LGVPlugin.exports.BaseLinearDisplayComponent;
        pluginManager.addAdapterType(function () {
          return new AdapterType({
            name: 'GDCAdapter',
            configSchema: GDCAdapterConfigSchema,
            AdapterClass: GDCAdapter
          });
        });
        pluginManager.addTrackType(function () {
          var configSchema = configuration.ConfigurationSchema('GDCTrack', {}, {
            baseConfiguration: models.createBaseTrackConfig(pluginManager),
            explicitIdentifier: 'trackId'
          });
          return new TrackType({
            name: 'GDCTrack',
            configSchema: configSchema,
            stateModel: models.createBaseTrackModel(pluginManager, 'GDCTrack', configSchema)
          });
        });
        pluginManager.addDisplayType(function () {
          var _pluginManager$load = pluginManager.load(LinearGDCDisplay),
              configSchema = _pluginManager$load.configSchema,
              stateModel = _pluginManager$load.stateModel;

          return new DisplayType({
            name: 'LinearGDCDisplay',
            configSchema: configSchema,
            stateModel: stateModel,
            trackType: 'GDCTrack',
            viewType: 'LinearGenomeView',
            ReactComponent: BaseLinearDisplayComponent
          });
        });
        pluginManager.addWidgetType(function () {
          var _pluginManager$load2 = pluginManager.load(GDCFilterWidget),
              configSchema = _pluginManager$load2.configSchema,
              HeadingComponent = _pluginManager$load2.HeadingComponent,
              ReactComponent = _pluginManager$load2.ReactComponent,
              stateModel = _pluginManager$load2.stateModel;

          return new WidgetType({
            name: 'GDCFilterWidget',
            HeadingComponent: HeadingComponent,
            configSchema: configSchema,
            stateModel: stateModel,
            ReactComponent: ReactComponent
          });
        });
        pluginManager.addWidgetType(function () {
          var _pluginManager$load3 = pluginManager.load(GDCFeatureWidgetF$1),
              configSchema = _pluginManager$load3.configSchema,
              stateModel = _pluginManager$load3.stateModel,
              ReactComponent = _pluginManager$load3.ReactComponent;

          return new WidgetType({
            name: 'GDCFeatureWidget',
            heading: 'Feature Details',
            configSchema: configSchema,
            stateModel: stateModel,
            ReactComponent: ReactComponent
          });
        });
      }
    }]);

    return GDCPlugin;
  }(Plugin);

  exports.default = GDCPlugin;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=jbrowse-plugin-gdc.umd.development.js.map
