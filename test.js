const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;

const _fs = require('./index').fs;
const bfs = new _fs();

const TEST_FILE = 'package.json';

describe('filesystem', () => {

  before(() => {
    bfs.__proto__.getStore = function _getStore() {
      return this._store;
    };
    bfs.__proto__.setStore = function _setStore(key, data) {
      this._store[key] = { data };
    };
    bfs.__proto__.getDirtyBuffer = function _getDirtyBuffer() {
      return this._dirtyBuffer;
    }
    bfs.__proto__.setDirtyBuffer = function _setDirtyBuffer(dirtyBuffer) {
      this._dirtyBuffer = dirtyBuffer;
    }
  });

  afterEach(function () {
    bfs.clear();
  });

  describe('existsSync', () => {
    it('works?', () => {
      expect(
        bfs.existsSync(TEST_FILE)
      ).to.be.true;
    });

    it('check memory for "existsSync" key', () => {
      expect(
        bfs.existsSync(TEST_FILE)
      ).to.be.true;
      expect(
        bfs.getStore()[TEST_FILE].existsSync
      ).to.be.true;
    });

    it('check memory for "data" key', () => {
      bfs.setStore(
        TEST_FILE,
        fs.readFileSync(TEST_FILE)
      );
      expect(
        bfs.existsSync(TEST_FILE)
      ).to.be.true;
      expect(
        bfs.getStore()[TEST_FILE]
      ).to.be.an('object')
        .that.have.property('data');
      expect(
        bfs.getStore()[TEST_FILE].data instanceof Buffer
      ).to.be.true;
    });
  });

  describe('readFileSync', () => {
    it('read from fs and store in cache', () => {
      /* file should not be present in cache */
      expect(
        !bfs.getStore()[TEST_FILE] ||
        !bfs.getStore()[TEST_FILE].data
      ).to.be.true;
      expect(
        bfs.readFileSync(TEST_FILE) instanceof Buffer
      ).to.be.true;
      /* after reading from fs, it should be present in cache */
      expect(
        bfs.getStore()[TEST_FILE].data instanceof Buffer
      ).to.be.true;
    });
  });

  describe('writeFileSync', () => {
    it('write it in memory', () => {
      expect(
        bfs.getDirtyBuffer()
      ).to.be.empty;
      expect(
        bfs.getStore()[TEST_FILE]
      ).to.be.undefined;
      bfs.writeFileSync(
        TEST_FILE,
        fs.readFileSync(TEST_FILE)
      )
      expect(
        bfs.getDirtyBuffer()
      ).to.eql([TEST_FILE]);
      expect(
        bfs.getStore()
      ).have.property(TEST_FILE);
      expect(
        bfs.getStore()[TEST_FILE]
      ).have.property('data');
      expect(
        bfs.getStore()[TEST_FILE].data instanceof Buffer
      ).to.be.true;
    });
  });
});
