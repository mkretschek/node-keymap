keymap
======

`keymap` is a tool for compacting/expanding keys in an object. Its main use
is to process objects before saving them to the database/cache and after
retrieving them.

Installation
------------

As usual, just run `npm install keymap`.

Usage
-----

```js
var keymap = require('keymap')
  , map = keymap();

map.add('foo', 'f').add('bar', 'b');

// returns {f : 'foo', b : 'bar'}
map.compact({
  foo : 'foo',
  bar : 'bar'
});
```

Defining keys
-------------

`keymap` gives you some options as to how to define your keys and
abbreviations. If you wish to define or key-abbr pairs directly in your code,
you may use the `#add()` method:

```js
// Passing a key-abbr pair to #add()
map
  .add('foo', 'f')
  .add('bar', 'b');

map.getAbbr('foo'); // > 'f'


// Passing an object to #add()
map.add({
  bar : 'b',
  baz : 'bz'
});

map.getAbbr('bar'); // > 'b'
map.getKey('bz'); // > 'baz'
```

Both will have exactly the same result.

If you wish to store your abbreviations in another file, you may use the
`#import()` method to import your key-abbr maps. The `#import()` method
takes a filepath as an argument. The file must be requirable, that is, must
work with `require()`. `keymap` uses the [js-yaml][] package to make this
work with Yaml files.

```js
// works with json files
map.import(path.join(__dirname, 'keymap.json'));

// Works with yaml files
map.import(path.join(__dirname, 'keymap.yml'));

// Works with node modules
map.import(path.join(__dirname, 'keymap.js'));
```

Both `#add()` and `#import()` are chainable:

```js
map
  .add('foo', 'f')
  .add('bar', 'b')
  .add('baz', 'bz')
  .import(path.join(__dirname, 'keymap.yml'));
```

Note that **duplicate keys or abbreviations** are not allowed and will
throw an error if found.

```js
// Duplicate abbreviations are not allowed
map.add('bar', 'b').add('baz', 'b); // > err

// Duplicate keys are not allowed either
map.add('bar', 'b').add('bar', 'b_'); // > err
```

Abbreviating and expanding your keys
------------------------------------

Once your keymap is defined, there are four methods that process your keys and
abbreviations:

  * 2 abbreviation/compacting methods
  * 2 expansion methods

Use `#getAbbr()` and `#getKey()` to retrive the abbreviation or the original
form of simple strings.

```js
map.add('foo', 'f').add('bar', 'b');

map.getAbbr('foo'); // > 'f'
map.getKey('f'); // > 'foo'

// They work with dot-separated keys...
map.getAbbr('foo.bar'); // > 'f.b'
map.getKey('f.b'); // > 'foo.bar'

// and with an array too.
map.getAbbr(['foo', 'bar']); // > ['f', 'b']
map.getKey(['f', 'b']); // > ['foo', 'bar']
```

These methods default to the original value if no abbr/key is found:

```js
map.add('foo', 'f');

map.getAbbr('foobar'); // > 'foobar'
map.getKey('foobar'); // > 'foobar'
```

`#compact()` and `#expand()` work on entire objects:

```js
map.add({foo : 'f', bar : 'b');

map.compact({foo : 'foo', bar : 'bar'}); // > {f : 'foo', b : 'bar}
map.expand({f : 'foo', b : 'bar'}); // > {foo : 'foo', bar : 'bar'}
```

They will compact/expand keys in nested objects too:

```js
// Objects inside objects
map.compact({foo : {bar : 'baz'}}); // > {f : {b : 'baz'}}

// Objects in arrays
map.compact([{foo : 'bar'}]); // > [{f : 'bar'}]
```

But there's one caveat: it works only with object literals. Any other object
will be returned as is.

```js
var now = new Date();
map.compcat(now) === now; // > true
```

Also note that `#compact()` and `#expand()` won't have the same behavior as
`#getAbbr()` and `#getKeys()` when they receive a string. **They will NOT try
to abbreviate/expand it**, returning the original value.

```js
map.add('foo', 'f');
map.getAbbr('foo'); // > 'f'
map.compact('foo'); // > 'foo'

map.getKey('f'); // > 'foo'
map.expand('f'); // > 'f'
```

Contributing
------------

Feel free to submit any patches or report any issues. I'll do my best to 
check them as quick as possible (in a few days, usually). When submitting a
patch, please add your name and link to the author section below.

Issues and patches regarding grammar errors in code comments and docs are
welcome as well. : )


Author
------

Created by [Mathias Kretschek][mathias] ([mkretschek][]).


[js-yaml]: https://github.com/nodeca/js-yaml
[mathias]: http://mathias.ms
[mkretschek]: https://github.com/mkretschek

