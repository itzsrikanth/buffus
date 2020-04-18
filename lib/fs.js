'use strict';

const fs = require('fs');

/**
 * TODO: Need to use 'enhanced-resolve' to avoid storing
 * duplicates of same file when accessed as relative and
 * absolute path
 */
/**
 * TODO: Need to handle error with more context
 */

function _fs() { };

_fs.prototype._store = {};
_fs.prototype._dirtyBuffer = [];

_fs.prototype.existsSync = function _existsSync(_path) {
  if (this._store[_path] && this._store[_path].existsSync) {
    return true;
  }
  if (this._store[_path] && this._store[_path].data) {
    this._store[_path].existsSync = true;
    return true;
  }
  try {
    const result = fs.existsSync(_path);
    if (this._store[_path]) {
      this._store[_path].existsSync = result;
    } else {
      this._store[_path] = {
        existsSync: result
      };
    }
    return result;
  } catch (e) {
    throw e;
  }
}

_fs.prototype.readFileSync = function _readFileSync(_path, _encoding) {
  if (this._store[_path] && this._store[_path].data) {
    return this._store[_path].data;
  }
  /**
   * TODO: Need to store it as buffer and transform based on 
   * the encoding
   */
  try {
    const result = fs.readFileSync(_path, _encoding);
    if (!this._store[_path]) {
      this._store[_path] = {};
    }
    this._store[_path].data = result;
    return result;
  } catch (e) {
    throw e;
  }
}

_fs.prototype.mkdirSync = function _mkdirSync(_path, _opts) {
  if (this.existsSync(_path)) {
    return;
  }
  try {
    mkdirSync(_path, _opts)
    this._store[_path] = {
      existsSync: true
    };
    return;
  } catch (e) {
    this._store[_path] = {};
    throw e;
  }
}

_fs.prototype.writeFileSync = function _writeFileSync(_path, _data) {
  if (!this._store[_path]) {
    this._store[_path] = {};
  }
  /**
   * TODO: Need to check if the path or directory exists, and
   * warn if directory not present
   */
  this._store[_path].data = _data;
  this._dirtyBuffer.indexOf(_path) === -1 &&
    this._dirtyBuffer.push(_path);
  return;
}

/**
 * This writes dirty data to filesystem
 * TODO: {any} _forced: if truthy, create recursive directory, else fail
 */
_fs.prototype.flush = function _flush(_forced) {
  for (var i = 0; i < this._dirtyBuffer.length; i++) {
    const location = this._dirtyBuffer[i];
    this._dirtyBuffer[i] = new Promise((resolve, reject) => {
      fs.writeFile(location, this._store[location].data, err => {
        if (e) reject(e)
        else resolve();
      });
    });
  }
  return Promise.all(this._dirtyBuffer);
}

_fs.prototype.flushSync = function _flushSync(_forced) {
  try {
    for (var i = 0; i < this._dirtyBuffer.length; i++) {
      fs.writeFile(location, this._store[location].data);
    }
    return;
  } catch (e) {
    /**
     * TODO: Include file name/path info
     */
    throw e;
  }
}

_fs.prototype.clear = function _clear() {
  this._store = {};
  return;
}

/**
 * TODO:
 * 1. Based on timestamp and a flag, need to write dirty memory to file to avoid
 *  RAM thrashing
 * 2. flag to monkey patch existing nodejs 'fs' as part of separate module
 * 3. change detect based on flag using 'chokidar' to have it in memory before request
 */
module.exports = _fs;
