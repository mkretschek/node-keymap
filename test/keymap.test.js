/**
 * @fileoverview Tests keymap module.
 */

var chai = require('chai'),
  expect = chai.expect,
  keymap = require('../');

describe('keymap', function () {
  it('is accessible', function () {
    expect(keymap).to.exist;
  });

  it('is a function', function () {
    expect(keymap).to.be.a('function');
  });

  it('returns a KeyMap instance', function () {
    var map = keymap();
    expect(map).to.be.an('object');
    expect(map).to.be.instanceof(keymap.KeyMap);
  });

  describe('.KeyMap()', function () {
    var map;

    beforeEach(function () {
      map = keymap();
      map.add('foo', 'f').add('bar', 'b');
    });

    it('is accessible', function () {
      expect(keymap.KeyMap).to.exist;
    });

    it('is a constructor', function () {
      expect(keymap.KeyMap).to.be.a('function');
      expect(map.constructor).to.equal(keymap.KeyMap);
      expect(map instanceof keymap.KeyMap).to.be.true;
    });

    describe('#getAbbr()', function () {
      it('is accessible', function () {
        expect(map.getAbbr).to.exist;
      });

      it('is a function', function () {
        expect(map.getAbbr).to.be.a('function');
      });

      it('returns the abbreviation for the key if defined', function () {
        expect(map.getAbbr('foo')).to.equal('f');
      });

      it('returns the key itself if no abbreviation is found', function () {
        expect(map.getAbbr('baz')).to.equal('baz');
      });

      it('works with nested (dot-separated) keys', function () {
        expect(map.getAbbr('foo.bar.baz')).to.equal('f.b.baz');
      });

      it('works with an array of keys', function () {
        expect(map.getAbbr(['foo', 'bar', 'baz'])).to.eql(['f', 'b', 'baz']);
      });
    }); // #getAbbr()

    describe('#getKey()', function () {
      it('is accessible', function () {
        expect(map.getKey).to.exist;
      });

      it('is a function', function () {
        expect(map.getKey).to.be.a('function');
      });

      it('returns the key for the given abbreviation if defined', function () {
        expect(map.getKey('f')).to.equal('foo');
      });

      it('returns the abbr itself if the key is not found', function () {
        expect(map.getKey('bz')).to.equal('bz');
      });

      it('works with nested (dot-separated) abbreviations', function () {
        expect(map.getKey('f.b.bz')).to.equal('foo.bar.bz');
      });

      it('works with an array of abbreviations', function () {
        expect(map.getKey(['f', 'b', 'bz'])).to.eql(['foo', 'bar', 'bz']);
      });
    }); // #getKey()

    describe('#compact()', function () {
      it('is accessible', function () {
        expect(map.compact).to.exist;
      });

      it('is a function', function () {
        expect(map.compact).to.be.a('function');
      });

      it('compacts all keys in a given object literal', function () {
        var obj, res;
        
        obj = {
          foo : 'foo',
          bar : 'bar',
          baz : 'baz'
        };

        res = {
          f : 'foo',
          b : 'bar',
          baz : 'baz'
        };

        expect(map.compact(obj)).to.eql(res);
      });

      it('compacts all keys in nested object literals', function () {
        var obj, res;

        obj = {
          foo : {
            bar : 'bar',
            baz : 'baz'
          }
        };

        res = {
          f : {
            b : 'bar',
            baz : 'baz'
          }
        };

        expect(map.compact(obj)).to.eql(res);
      });

      it('compacts all keys in object literals in an array', function () {
        var arr, res;

        arr = [
          {
            foo : 'foo',
            bar : 'bar'
          }, {
            bar : 'bar',
            baz : 'baz'
          }
        ];

        res = [
          {
            f : 'foo',
            b : 'bar'
          }, {
            b : 'bar',
            baz : 'baz'
          }
        ];

        expect(map.compact(arr)).to.eql(res);
      });

      it('does nothing to other values', function () {
        expect(map.compact('foo')).to.equal('foo');
        expect(map.compact(123)).to.equal(123);
      });

      it('does nothing to non-literal objects', function () {
        var obj, now;
        
        now = new Date();

        obj = {
          foo : now
        };

        expect(map.compact(now)).to.equal(now);
        expect(map.compact(obj)).to.eql({f : now});
      });
    }); // #compact()

    describe('#expand()', function () {
      it('is accessible', function () {
        expect(map.expand).to.exist;
      });

      it('is a function', function () {
        expect(map.expand).to.be.a('function');
      });

      it('expands all abbr in a given object literal', function () {
        var obj, res;
        
        res = {
          foo : 'foo',
          bar : 'bar',
          baz : 'baz'
        };

        obj = {
          f : 'foo',
          b : 'bar',
          baz : 'baz'
        };

        expect(map.expand(obj)).to.eql(res);
      });

      it('expands all keys in nested object literals', function () {
        var obj, res;

        obj = {
          foo : {
            bar : 'bar',
            baz : 'baz'
          }
        };

        res = {
          f : {
            b : 'bar',
            baz : 'baz'
          }
        };

        expect(map.compact(obj)).to.eql(res);
      });

      it('expands all keys in object literals in an array', function () {
        var arr, res;

        res = [
          {
            foo : 'foo',
            bar : 'bar'
          }, {
            bar : 'bar',
            baz : 'baz'
          }
        ];

        arr = [
          {
            f : 'foo',
            b : 'bar'
          }, {
            b : 'bar',
            baz : 'baz'
          }
        ];

        expect(map.expand(arr)).to.eql(res);
      });

      it('does nothing to other values', function () {
        expect(map.expand('foo')).to.equal('foo');
        expect(map.expand(123)).to.equal(123);
      });

      it('does nothing to non-literal objects', function () {
        var obj, now;
        
        now = new Date();

        obj = {
          f : now
        };

        expect(map.expand(now)).to.equal(now);
        expect(map.expand(obj)).to.eql({foo : now});
      });
    }); // #expand()

    describe('#add()', function () {
      beforeEach(function () {
        map = keymap();
      });

      it('is accessible', function () {
        expect(map.add).to.exist;
      });

      it('is a function', function () {
        expect(map.add).to.be.a('function');
      });

      it('adds a key-abbr pair to the keymap', function () {
        expect(map.getAbbr('foo')).to.equal('foo');
        map.add('foo', 'f');
        expect(map.getAbbr('foo')).to.equal('f');
      });

      it('adds a abbr-key pair to the abbrmap', function () {
        expect(map.getKey('f')).to.equal('f');
        map.add('foo', 'f');
        expect(map.getKey('f')).to.equal('foo');
      });

      it('throws an error if key already has an abbreviation', function () {
        var msg;

        map.add('foo', 'f');

        function duplicateKey() {
          map.add('foo', 'f_');
        }

        msg = 'Key foo already has an abbreviation (f).';
        expect(duplicateKey).to.throw(msg);
      });

      it('throws an error if abbreviation is used by another key', function () {
        var msg;

        map.add('bar', 'b');

        function duplicateAbbr() {
          map.add('baz', 'b');
        }

        msg = 'Abbreviation b already used by bar.';
        expect(duplicateAbbr).to.throw(msg);
      });

      it('works with a key-abbr map', function () {
        expect(map.getAbbr('foo')).to.equal('foo');
        expect(map.getAbbr('bar')).to.equal('bar');
        expect(map.getKey('f')).to.equal('f');
        expect(map.getKey('b')).to.equal('b');

        map.add({
          foo : 'f',
          bar : 'b'
        });

        expect(map.getAbbr('foo')).to.equal('f');
        expect(map.getAbbr('bar')).to.equal('b');
        expect(map.getKey('f')).to.equal('foo');
        expect(map.getKey('b')).to.equal('bar');
      });
    }); // #add()

    describe('#import()', function () {
      var path = require('path');

      beforeEach(function () {
        map = keymap();
      });

      it('is accessible', function () {
        expect(map.import).to.exist;
      });

      it('is a function', function () {
        expect(map.import).to.be.a('function');
      });

      it('works with a module path', function () {
        expect(map.getAbbr('foo')).to.equal('foo');
        map.import(path.join(__dirname, 'keymap.module'));
        expect(map.getAbbr('foo')).to.equal('f');
      });

      it('works with json file', function () {
        expect(map.getAbbr('bar')).to.equal('bar');
        map.import(path.join(__dirname, 'keymap.json'));
        expect(map.getAbbr('bar')).to.equal('b');
      });

      it('works with yml file', function () {
        expect(map.getAbbr('baz')).to.equal('baz');
        map.import(path.join(__dirname, 'keymap.yml'));
        expect(map.getAbbr('baz')).to.equal('b');
      });
    }); // #import()

  }); // .KeyMap()
}); // keymap

