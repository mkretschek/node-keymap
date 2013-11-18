
(function () {
  'use strict';

  // Makes `require()` parse .yml files
  require('js-yaml');

  var _ = require('underscore'),
    format = require('util').format,
    keymap;


  function KeyMap(map) {
    this._abbr = {};
    this._key = {};

    if (map) {
      if (typeof map === 'string') {
        this.import(map);
      } else if (typeof map === 'object') {
        this.add(map);
      }
    }
  }

  function isObject(val) {
    return val !== null &&
      val !== undefined &&
      val.constructor === Object &&
      Object.getPrototypeOf(val) === Object.prototype;
  }

  KeyMap.prototype.getAbbr = function (key) {
    var join = false,
      abbr;

    if (~key.indexOf('.')) {
      key = key.split('.');
      join = true;
    }

    if (Array.isArray(key)) {
      abbr = _.map(key, this.getAbbr, this);
      if (join) {
        abbr = abbr.join('.');
      }
    } else {
      abbr = this._abbr[key];
    }

    return abbr || key;
  };

  KeyMap.prototype.getKey = function (abbr) {
    var join = false,
      key;

    if (~abbr.indexOf('.')) {
      abbr = abbr.split('.');
      join = true;
    }

    if (Array.isArray(abbr)) {
      key = _.map(abbr, this.getKey, this);
      if (join) {
        key = key.join('.');
      }
    } else {
      key = this._key[abbr];
    }

    return key || abbr;
  };

  KeyMap.prototype.compact = function (obj) {
    if (Array.isArray(obj)) {
      return this._compactArray(obj);
    }

    // If obj is an Object literal (created with {})
    // XXX: When the time comes to implement this for working in the browser,
    // remember that this check will not work cross-frame and cross-window,
    // as each frame/windows has its own `Object`.
    if (isObject(obj)) {
      return this._compactObject(obj);
    }

    return obj;
  };

  KeyMap.prototype._compactArray = function (arr) {
    return _.map(arr, this.compact, this);
  };

  KeyMap.prototype._compactObject = function (obj) {
    var key, val, r;
    r = {};
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        val = obj[key];
        r[this.getAbbr(key)] = this.compact(val);
      }
    }
    return r;
  };

  KeyMap.prototype.expand = function (obj) {
    if (Array.isArray(obj)) {
      return this._expandArray(obj);
    }

    // If obj is an Object literal (created with {})
    // XXX: When the time comes to implement this for working in the browser,
    // remember that this check will not work cross-frame and cross-window,
    // as each frame/windows has its own `Object`.
    if (isObject(obj)) {
      return this._expandObject(obj);
    }

    return obj;
  };

  KeyMap.prototype._expandArray = function (arr) {
    return _.map(arr, this.expand, this);
  };

  KeyMap.prototype._expandObject = function (obj) {
    var abbr, val, r;
    r = {};
    for (abbr in obj) {
      if (obj.hasOwnProperty(abbr)) {
        val = obj[abbr];
        r[this.getKey(abbr)] = this.expand(val);
      }
    }
    return r;
  };

  KeyMap.prototype.import = function (file) {
    this.add(require(file));
    return this;
  };

  KeyMap.prototype.add = function (keyOrMap, abbr) {
    var key, map, msg;

    if (typeof keyOrMap === 'object') {
      map = keyOrMap;
      for (key in map) {
        if (map.hasOwnProperty(key)) {
          this.add(key, map[key]);
        }
      }
    } else {
      key = keyOrMap;

      if (this._abbr[key]) {
        msg = format('Key %s already has an abbreviation (%s).',
                     key, this._abbr[key]);
        throw(new Error(msg));
      }

      if (this._key[abbr]) {
        msg = format('Abbreviation %s already used by %s.',
                     abbr, this._key[abbr]);
        throw(new Error(msg));
      }

      this._abbr[key] = abbr;
      this._key[abbr] = key;
    }

    return this;
  };


  /** Creates a keymap object. */
  keymap = module.exports = function (map) {
    return new KeyMap(map);
  };

  keymap.KeyMap = KeyMap;
})();
