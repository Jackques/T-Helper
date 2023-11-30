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
})({"FlpK":[function(require,module,exports) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}

module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],"rH1J":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"eeO1":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
var define;
/*!
 * jQuery JavaScript Library v3.6.0
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2021-03-02T17:08Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.6.0",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.6
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2021-02-16
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem && elem.namespaceURI,
		docElem = elem && ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						// Support: Chrome 86+
						// In Chrome, if an element having a focusout handler is blurred by
						// clicking outside of it, it invokes the handler synchronously. If
						// that handler calls `.remove()` on the element, the data is cleared,
						// leaving `result` undefined. We need to guard against this.
						return result && result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		// Suppress native focus or blur as it's already being fired
		// in leverageNative.
		_default: function() {
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is display: block
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{"process":"rH1J"}],"yQ1z":[function(require,module,exports) {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = function (t) {
  var e = {};

  function r(n) {
    if (e[n]) return e[n].exports;
    var i = e[n] = {
      i: n,
      l: !1,
      exports: {}
    };
    return t[n].call(i.exports, i, i.exports, r), i.l = !0, i.exports;
  }

  return r.m = t, r.c = e, r.d = function (t, e, n) {
    r.o(t, e) || Object.defineProperty(t, e, {
      enumerable: !0,
      get: n
    });
  }, r.r = function (t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(t, "__esModule", {
      value: !0
    });
  }, r.t = function (t, e) {
    if (1 & e && (t = r(t)), 8 & e) return t;
    if (4 & e && "object" == _typeof(t) && t && t.__esModule) return t;
    var n = Object.create(null);
    if (r.r(n), Object.defineProperty(n, "default", {
      enumerable: !0,
      value: t
    }), 2 & e && "string" != typeof t) for (var i in t) r.d(n, i, function (e) {
      return t[e];
    }.bind(null, i));
    return n;
  }, r.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    return r.d(e, "a", e), e;
  }, r.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  }, r.p = "", r(r.s = 32);
}([function (t, e) {
  var r;

  r = function () {
    return this;
  }();

  try {
    r = r || Function("return this")() || (0, eval)("this");
  } catch (t) {
    "object" == (typeof window === "undefined" ? "undefined" : _typeof(window)) && (r = window);
  }

  t.exports = r;
}, function (t, e, r) {
  "use strict";

  var n = r(6),
      i = Object.keys || function (t) {
    var e = [];

    for (var r in t) e.push(r);

    return e;
  };

  t.exports = f;
  var o = r(5);
  o.inherits = r(2);
  var s = r(23),
      a = r(14);
  o.inherits(f, s);

  for (var u = i(a.prototype), c = 0; c < u.length; c++) {
    var l = u[c];
    f.prototype[l] || (f.prototype[l] = a.prototype[l]);
  }

  function f(t) {
    if (!(this instanceof f)) return new f(t);
    s.call(this, t), a.call(this, t), t && !1 === t.readable && (this.readable = !1), t && !1 === t.writable && (this.writable = !1), this.allowHalfOpen = !0, t && !1 === t.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", h);
  }

  function h() {
    this.allowHalfOpen || this._writableState.ended || n.nextTick(p, this);
  }

  function p(t) {
    t.end();
  }

  Object.defineProperty(f.prototype, "writableHighWaterMark", {
    enumerable: !1,
    get: function () {
      return this._writableState.highWaterMark;
    }
  }), Object.defineProperty(f.prototype, "destroyed", {
    get: function () {
      return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function (t) {
      void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = t, this._writableState.destroyed = t);
    }
  }), f.prototype._destroy = function (t, e) {
    this.push(null), this.end(), n.nextTick(e, t);
  };
}, function (t, e) {
  "function" == typeof Object.create ? t.exports = function (t, e) {
    t.super_ = e, t.prototype = Object.create(e.prototype, {
      constructor: {
        value: t,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    });
  } : t.exports = function (t, e) {
    t.super_ = e;

    var r = function () {};

    r.prototype = e.prototype, t.prototype = new r(), t.prototype.constructor = t;
  };
}, function (t, e, r) {
  "use strict";

  (function (t) {
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
     * @license  MIT
     */
    var n = r(38),
        i = r(39),
        o = r(40);

    function s() {
      return u.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
    }

    function a(t, e) {
      if (s() < e) throw new RangeError("Invalid typed array length");
      return u.TYPED_ARRAY_SUPPORT ? (t = new Uint8Array(e)).__proto__ = u.prototype : (null === t && (t = new u(e)), t.length = e), t;
    }

    function u(t, e, r) {
      if (!(u.TYPED_ARRAY_SUPPORT || this instanceof u)) return new u(t, e, r);

      if ("number" == typeof t) {
        if ("string" == typeof e) throw new Error("If encoding is specified then the first argument must be a string");
        return f(this, t);
      }

      return c(this, t, e, r);
    }

    function c(t, e, r, n) {
      if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');
      return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer ? function (t, e, r, n) {
        if (e.byteLength, r < 0 || e.byteLength < r) throw new RangeError("'offset' is out of bounds");
        if (e.byteLength < r + (n || 0)) throw new RangeError("'length' is out of bounds");
        return e = void 0 === r && void 0 === n ? new Uint8Array(e) : void 0 === n ? new Uint8Array(e, r) : new Uint8Array(e, r, n), u.TYPED_ARRAY_SUPPORT ? (t = e).__proto__ = u.prototype : t = h(t, e), t;
      }(t, e, r, n) : "string" == typeof e ? function (t, e, r) {
        if ("string" == typeof r && "" !== r || (r = "utf8"), !u.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
        var n = 0 | d(e, r),
            i = (t = a(t, n)).write(e, r);
        return i !== n && (t = t.slice(0, i)), t;
      }(t, e, r) : function (t, e) {
        if (u.isBuffer(e)) {
          var r = 0 | p(e.length);
          return 0 === (t = a(t, r)).length ? t : (e.copy(t, 0, 0, r), t);
        }

        if (e) {
          if ("undefined" != typeof ArrayBuffer && e.buffer instanceof ArrayBuffer || "length" in e) return "number" != typeof e.length || function (t) {
            return t != t;
          }(e.length) ? a(t, 0) : h(t, e);
          if ("Buffer" === e.type && o(e.data)) return h(t, e.data);
        }

        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
      }(t, e);
    }

    function l(t) {
      if ("number" != typeof t) throw new TypeError('"size" argument must be a number');
      if (t < 0) throw new RangeError('"size" argument must not be negative');
    }

    function f(t, e) {
      if (l(e), t = a(t, e < 0 ? 0 : 0 | p(e)), !u.TYPED_ARRAY_SUPPORT) for (var r = 0; r < e; ++r) t[r] = 0;
      return t;
    }

    function h(t, e) {
      var r = e.length < 0 ? 0 : 0 | p(e.length);
      t = a(t, r);

      for (var n = 0; n < r; n += 1) t[n] = 255 & e[n];

      return t;
    }

    function p(t) {
      if (t >= s()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s().toString(16) + " bytes");
      return 0 | t;
    }

    function d(t, e) {
      if (u.isBuffer(t)) return t.length;
      if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)) return t.byteLength;
      "string" != typeof t && (t = "" + t);
      var r = t.length;
      if (0 === r) return 0;

      for (var n = !1;;) switch (e) {
        case "ascii":
        case "latin1":
        case "binary":
          return r;

        case "utf8":
        case "utf-8":
        case void 0:
          return N(t).length;

        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return 2 * r;

        case "hex":
          return r >>> 1;

        case "base64":
          return H(t).length;

        default:
          if (n) return N(t).length;
          e = ("" + e).toLowerCase(), n = !0;
      }
    }

    function _(t, e, r) {
      var n = t[e];
      t[e] = t[r], t[r] = n;
    }

    function v(t, e, r, n, i) {
      if (0 === t.length) return -1;

      if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = i ? 0 : t.length - 1), r < 0 && (r = t.length + r), r >= t.length) {
        if (i) return -1;
        r = t.length - 1;
      } else if (r < 0) {
        if (!i) return -1;
        r = 0;
      }

      if ("string" == typeof e && (e = u.from(e, n)), u.isBuffer(e)) return 0 === e.length ? -1 : y(t, e, r, n, i);
      if ("number" == typeof e) return e &= 255, u.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(t, e, r) : Uint8Array.prototype.lastIndexOf.call(t, e, r) : y(t, [e], r, n, i);
      throw new TypeError("val must be string, number or Buffer");
    }

    function y(t, e, r, n, i) {
      var o,
          s = 1,
          a = t.length,
          u = e.length;

      if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
        if (t.length < 2 || e.length < 2) return -1;
        s = 2, a /= 2, u /= 2, r /= 2;
      }

      function c(t, e) {
        return 1 === s ? t[e] : t.readUInt16BE(e * s);
      }

      if (i) {
        var l = -1;

        for (o = r; o < a; o++) if (c(t, o) === c(e, -1 === l ? 0 : o - l)) {
          if (-1 === l && (l = o), o - l + 1 === u) return l * s;
        } else -1 !== l && (o -= o - l), l = -1;
      } else for (r + u > a && (r = a - u), o = r; o >= 0; o--) {
        for (var f = !0, h = 0; h < u; h++) if (c(t, o + h) !== c(e, h)) {
          f = !1;
          break;
        }

        if (f) return o;
      }

      return -1;
    }

    function m(t, e, r, n) {
      r = Number(r) || 0;
      var i = t.length - r;
      n ? (n = Number(n)) > i && (n = i) : n = i;
      var o = e.length;
      if (o % 2 != 0) throw new TypeError("Invalid hex string");
      n > o / 2 && (n = o / 2);

      for (var s = 0; s < n; ++s) {
        var a = parseInt(e.substr(2 * s, 2), 16);
        if (isNaN(a)) return s;
        t[r + s] = a;
      }

      return s;
    }

    function g(t, e, r, n) {
      return V(N(e, t.length - r), t, r, n);
    }

    function b(t, e, r, n) {
      return V(function (t) {
        for (var e = [], r = 0; r < t.length; ++r) e.push(255 & t.charCodeAt(r));

        return e;
      }(e), t, r, n);
    }

    function w(t, e, r, n) {
      return b(t, e, r, n);
    }

    function E(t, e, r, n) {
      return V(H(e), t, r, n);
    }

    function C(t, e, r, n) {
      return V(function (t, e) {
        for (var r, n, i, o = [], s = 0; s < t.length && !((e -= 2) < 0); ++s) n = (r = t.charCodeAt(s)) >> 8, i = r % 256, o.push(i), o.push(n);

        return o;
      }(e, t.length - r), t, r, n);
    }

    function x(t, e, r) {
      return 0 === e && r === t.length ? n.fromByteArray(t) : n.fromByteArray(t.slice(e, r));
    }

    function j(t, e, r) {
      r = Math.min(t.length, r);

      for (var n = [], i = e; i < r;) {
        var o,
            s,
            a,
            u,
            c = t[i],
            l = null,
            f = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
        if (i + f <= r) switch (f) {
          case 1:
            c < 128 && (l = c);
            break;

          case 2:
            128 == (192 & (o = t[i + 1])) && (u = (31 & c) << 6 | 63 & o) > 127 && (l = u);
            break;

          case 3:
            o = t[i + 1], s = t[i + 2], 128 == (192 & o) && 128 == (192 & s) && (u = (15 & c) << 12 | (63 & o) << 6 | 63 & s) > 2047 && (u < 55296 || u > 57343) && (l = u);
            break;

          case 4:
            o = t[i + 1], s = t[i + 2], a = t[i + 3], 128 == (192 & o) && 128 == (192 & s) && 128 == (192 & a) && (u = (15 & c) << 18 | (63 & o) << 12 | (63 & s) << 6 | 63 & a) > 65535 && u < 1114112 && (l = u);
        }
        null === l ? (l = 65533, f = 1) : l > 65535 && (l -= 65536, n.push(l >>> 10 & 1023 | 55296), l = 56320 | 1023 & l), n.push(l), i += f;
      }

      return function (t) {
        var e = t.length;
        if (e <= S) return String.fromCharCode.apply(String, t);

        for (var r = "", n = 0; n < e;) r += String.fromCharCode.apply(String, t.slice(n, n += S));

        return r;
      }(n);
    }

    e.Buffer = u, e.SlowBuffer = function (t) {
      return +t != t && (t = 0), u.alloc(+t);
    }, e.INSPECT_MAX_BYTES = 50, u.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : function () {
      try {
        var t = new Uint8Array(1);
        return t.__proto__ = {
          __proto__: Uint8Array.prototype,
          foo: function () {
            return 42;
          }
        }, 42 === t.foo() && "function" == typeof t.subarray && 0 === t.subarray(1, 1).byteLength;
      } catch (t) {
        return !1;
      }
    }(), e.kMaxLength = s(), u.poolSize = 8192, u._augment = function (t) {
      return t.__proto__ = u.prototype, t;
    }, u.from = function (t, e, r) {
      return c(null, t, e, r);
    }, u.TYPED_ARRAY_SUPPORT && (u.prototype.__proto__ = Uint8Array.prototype, u.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && u[Symbol.species] === u && Object.defineProperty(u, Symbol.species, {
      value: null,
      configurable: !0
    })), u.alloc = function (t, e, r) {
      return function (t, e, r, n) {
        return l(e), e <= 0 ? a(t, e) : void 0 !== r ? "string" == typeof n ? a(t, e).fill(r, n) : a(t, e).fill(r) : a(t, e);
      }(null, t, e, r);
    }, u.allocUnsafe = function (t) {
      return f(null, t);
    }, u.allocUnsafeSlow = function (t) {
      return f(null, t);
    }, u.isBuffer = function (t) {
      return !(null == t || !t._isBuffer);
    }, u.compare = function (t, e) {
      if (!u.isBuffer(t) || !u.isBuffer(e)) throw new TypeError("Arguments must be Buffers");
      if (t === e) return 0;

      for (var r = t.length, n = e.length, i = 0, o = Math.min(r, n); i < o; ++i) if (t[i] !== e[i]) {
        r = t[i], n = e[i];
        break;
      }

      return r < n ? -1 : n < r ? 1 : 0;
    }, u.isEncoding = function (t) {
      switch (String(t).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;

        default:
          return !1;
      }
    }, u.concat = function (t, e) {
      if (!o(t)) throw new TypeError('"list" argument must be an Array of Buffers');
      if (0 === t.length) return u.alloc(0);
      var r;
      if (void 0 === e) for (e = 0, r = 0; r < t.length; ++r) e += t[r].length;
      var n = u.allocUnsafe(e),
          i = 0;

      for (r = 0; r < t.length; ++r) {
        var s = t[r];
        if (!u.isBuffer(s)) throw new TypeError('"list" argument must be an Array of Buffers');
        s.copy(n, i), i += s.length;
      }

      return n;
    }, u.byteLength = d, u.prototype._isBuffer = !0, u.prototype.swap16 = function () {
      var t = this.length;
      if (t % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");

      for (var e = 0; e < t; e += 2) _(this, e, e + 1);

      return this;
    }, u.prototype.swap32 = function () {
      var t = this.length;
      if (t % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");

      for (var e = 0; e < t; e += 4) _(this, e, e + 3), _(this, e + 1, e + 2);

      return this;
    }, u.prototype.swap64 = function () {
      var t = this.length;
      if (t % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");

      for (var e = 0; e < t; e += 8) _(this, e, e + 7), _(this, e + 1, e + 6), _(this, e + 2, e + 5), _(this, e + 3, e + 4);

      return this;
    }, u.prototype.toString = function () {
      var t = 0 | this.length;
      return 0 === t ? "" : 0 === arguments.length ? j(this, 0, t) : function (t, e, r) {
        var n = !1;
        if ((void 0 === e || e < 0) && (e = 0), e > this.length) return "";
        if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
        if ((r >>>= 0) <= (e >>>= 0)) return "";

        for (t || (t = "utf8");;) switch (t) {
          case "hex":
            return T(this, e, r);

          case "utf8":
          case "utf-8":
            return j(this, e, r);

          case "ascii":
            return R(this, e, r);

          case "latin1":
          case "binary":
            return k(this, e, r);

          case "base64":
            return x(this, e, r);

          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return P(this, e, r);

          default:
            if (n) throw new TypeError("Unknown encoding: " + t);
            t = (t + "").toLowerCase(), n = !0;
        }
      }.apply(this, arguments);
    }, u.prototype.equals = function (t) {
      if (!u.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
      return this === t || 0 === u.compare(this, t);
    }, u.prototype.inspect = function () {
      var t = "",
          r = e.INSPECT_MAX_BYTES;
      return this.length > 0 && (t = this.toString("hex", 0, r).match(/.{2}/g).join(" "), this.length > r && (t += " ... ")), "<Buffer " + t + ">";
    }, u.prototype.compare = function (t, e, r, n, i) {
      if (!u.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
      if (void 0 === e && (e = 0), void 0 === r && (r = t ? t.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), e < 0 || r > t.length || n < 0 || i > this.length) throw new RangeError("out of range index");
      if (n >= i && e >= r) return 0;
      if (n >= i) return -1;
      if (e >= r) return 1;
      if (e >>>= 0, r >>>= 0, n >>>= 0, i >>>= 0, this === t) return 0;

      for (var o = i - n, s = r - e, a = Math.min(o, s), c = this.slice(n, i), l = t.slice(e, r), f = 0; f < a; ++f) if (c[f] !== l[f]) {
        o = c[f], s = l[f];
        break;
      }

      return o < s ? -1 : s < o ? 1 : 0;
    }, u.prototype.includes = function (t, e, r) {
      return -1 !== this.indexOf(t, e, r);
    }, u.prototype.indexOf = function (t, e, r) {
      return v(this, t, e, r, !0);
    }, u.prototype.lastIndexOf = function (t, e, r) {
      return v(this, t, e, r, !1);
    }, u.prototype.write = function (t, e, r, n) {
      if (void 0 === e) n = "utf8", r = this.length, e = 0;else if (void 0 === r && "string" == typeof e) n = e, r = this.length, e = 0;else {
        if (!isFinite(e)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        e |= 0, isFinite(r) ? (r |= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
      }
      var i = this.length - e;
      if ((void 0 === r || r > i) && (r = i), t.length > 0 && (r < 0 || e < 0) || e > this.length) throw new RangeError("Attempt to write outside buffer bounds");
      n || (n = "utf8");

      for (var o = !1;;) switch (n) {
        case "hex":
          return m(this, t, e, r);

        case "utf8":
        case "utf-8":
          return g(this, t, e, r);

        case "ascii":
          return b(this, t, e, r);

        case "latin1":
        case "binary":
          return w(this, t, e, r);

        case "base64":
          return E(this, t, e, r);

        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return C(this, t, e, r);

        default:
          if (o) throw new TypeError("Unknown encoding: " + n);
          n = ("" + n).toLowerCase(), o = !0;
      }
    }, u.prototype.toJSON = function () {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    var S = 4096;

    function R(t, e, r) {
      var n = "";
      r = Math.min(t.length, r);

      for (var i = e; i < r; ++i) n += String.fromCharCode(127 & t[i]);

      return n;
    }

    function k(t, e, r) {
      var n = "";
      r = Math.min(t.length, r);

      for (var i = e; i < r; ++i) n += String.fromCharCode(t[i]);

      return n;
    }

    function T(t, e, r) {
      var n = t.length;
      (!e || e < 0) && (e = 0), (!r || r < 0 || r > n) && (r = n);

      for (var i = "", o = e; o < r; ++o) i += U(t[o]);

      return i;
    }

    function P(t, e, r) {
      for (var n = t.slice(e, r), i = "", o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);

      return i;
    }

    function O(t, e, r) {
      if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
      if (t + e > r) throw new RangeError("Trying to access beyond buffer length");
    }

    function A(t, e, r, n, i, o) {
      if (!u.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (e > i || e < o) throw new RangeError('"value" argument is out of bounds');
      if (r + n > t.length) throw new RangeError("Index out of range");
    }

    function F(t, e, r, n) {
      e < 0 && (e = 65535 + e + 1);

      for (var i = 0, o = Math.min(t.length - r, 2); i < o; ++i) t[r + i] = (e & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i);
    }

    function L(t, e, r, n) {
      e < 0 && (e = 4294967295 + e + 1);

      for (var i = 0, o = Math.min(t.length - r, 4); i < o; ++i) t[r + i] = e >>> 8 * (n ? i : 3 - i) & 255;
    }

    function M(t, e, r, n, i, o) {
      if (r + n > t.length) throw new RangeError("Index out of range");
      if (r < 0) throw new RangeError("Index out of range");
    }

    function B(t, e, r, n, o) {
      return o || M(t, 0, r, 4), i.write(t, e, r, n, 23, 4), r + 4;
    }

    function D(t, e, r, n, o) {
      return o || M(t, 0, r, 8), i.write(t, e, r, n, 52, 8), r + 8;
    }

    u.prototype.slice = function (t, e) {
      var r,
          n = this.length;
      if (t = ~~t, e = void 0 === e ? n : ~~e, t < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), e < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n), e < t && (e = t), u.TYPED_ARRAY_SUPPORT) (r = this.subarray(t, e)).__proto__ = u.prototype;else {
        var i = e - t;
        r = new u(i, void 0);

        for (var o = 0; o < i; ++o) r[o] = this[o + t];
      }
      return r;
    }, u.prototype.readUIntLE = function (t, e, r) {
      t |= 0, e |= 0, r || O(t, e, this.length);

      for (var n = this[t], i = 1, o = 0; ++o < e && (i *= 256);) n += this[t + o] * i;

      return n;
    }, u.prototype.readUIntBE = function (t, e, r) {
      t |= 0, e |= 0, r || O(t, e, this.length);

      for (var n = this[t + --e], i = 1; e > 0 && (i *= 256);) n += this[t + --e] * i;

      return n;
    }, u.prototype.readUInt8 = function (t, e) {
      return e || O(t, 1, this.length), this[t];
    }, u.prototype.readUInt16LE = function (t, e) {
      return e || O(t, 2, this.length), this[t] | this[t + 1] << 8;
    }, u.prototype.readUInt16BE = function (t, e) {
      return e || O(t, 2, this.length), this[t] << 8 | this[t + 1];
    }, u.prototype.readUInt32LE = function (t, e) {
      return e || O(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3];
    }, u.prototype.readUInt32BE = function (t, e) {
      return e || O(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
    }, u.prototype.readIntLE = function (t, e, r) {
      t |= 0, e |= 0, r || O(t, e, this.length);

      for (var n = this[t], i = 1, o = 0; ++o < e && (i *= 256);) n += this[t + o] * i;

      return n >= (i *= 128) && (n -= Math.pow(2, 8 * e)), n;
    }, u.prototype.readIntBE = function (t, e, r) {
      t |= 0, e |= 0, r || O(t, e, this.length);

      for (var n = e, i = 1, o = this[t + --n]; n > 0 && (i *= 256);) o += this[t + --n] * i;

      return o >= (i *= 128) && (o -= Math.pow(2, 8 * e)), o;
    }, u.prototype.readInt8 = function (t, e) {
      return e || O(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t];
    }, u.prototype.readInt16LE = function (t, e) {
      e || O(t, 2, this.length);
      var r = this[t] | this[t + 1] << 8;
      return 32768 & r ? 4294901760 | r : r;
    }, u.prototype.readInt16BE = function (t, e) {
      e || O(t, 2, this.length);
      var r = this[t + 1] | this[t] << 8;
      return 32768 & r ? 4294901760 | r : r;
    }, u.prototype.readInt32LE = function (t, e) {
      return e || O(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
    }, u.prototype.readInt32BE = function (t, e) {
      return e || O(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
    }, u.prototype.readFloatLE = function (t, e) {
      return e || O(t, 4, this.length), i.read(this, t, !0, 23, 4);
    }, u.prototype.readFloatBE = function (t, e) {
      return e || O(t, 4, this.length), i.read(this, t, !1, 23, 4);
    }, u.prototype.readDoubleLE = function (t, e) {
      return e || O(t, 8, this.length), i.read(this, t, !0, 52, 8);
    }, u.prototype.readDoubleBE = function (t, e) {
      return e || O(t, 8, this.length), i.read(this, t, !1, 52, 8);
    }, u.prototype.writeUIntLE = function (t, e, r, n) {
      t = +t, e |= 0, r |= 0, n || A(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
      var i = 1,
          o = 0;

      for (this[e] = 255 & t; ++o < r && (i *= 256);) this[e + o] = t / i & 255;

      return e + r;
    }, u.prototype.writeUIntBE = function (t, e, r, n) {
      t = +t, e |= 0, r |= 0, n || A(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
      var i = r - 1,
          o = 1;

      for (this[e + i] = 255 & t; --i >= 0 && (o *= 256);) this[e + i] = t / o & 255;

      return e + r;
    }, u.prototype.writeUInt8 = function (t, e, r) {
      return t = +t, e |= 0, r || A(this, t, e, 1, 255, 0), u.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), this[e] = 255 & t, e + 1;
    }, u.prototype.writeUInt16LE = function (t, e, r) {
      return t = +t, e |= 0, r || A(this, t, e, 2, 65535, 0), u.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8) : F(this, t, e, !0), e + 2;
    }, u.prototype.writeUInt16BE = function (t, e, r) {
      return t = +t, e |= 0, r || A(this, t, e, 2, 65535, 0), u.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, this[e + 1] = 255 & t) : F(this, t, e, !1), e + 2;
    }, u.prototype.writeUInt32LE = function (t, e, r) {
      return t = +t, e |= 0, r || A(this, t, e, 4, 4294967295, 0), u.TYPED_ARRAY_SUPPORT ? (this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = 255 & t) : L(this, t, e, !0), e + 4;
    }, u.prototype.writeUInt32BE = function (t, e, r) {
      return t = +t, e |= 0, r || A(this, t, e, 4, 4294967295, 0), u.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t) : L(this, t, e, !1), e + 4;
    }, u.prototype.writeIntLE = function (t, e, r, n) {
      if (t = +t, e |= 0, !n) {
        var i = Math.pow(2, 8 * r - 1);
        A(this, t, e, r, i - 1, -i);
      }

      var o = 0,
          s = 1,
          a = 0;

      for (this[e] = 255 & t; ++o < r && (s *= 256);) t < 0 && 0 === a && 0 !== this[e + o - 1] && (a = 1), this[e + o] = (t / s >> 0) - a & 255;

      return e + r;
    }, u.prototype.writeIntBE = function (t, e, r, n) {
      if (t = +t, e |= 0, !n) {
        var i = Math.pow(2, 8 * r - 1);
        A(this, t, e, r, i - 1, -i);
      }

      var o = r - 1,
          s = 1,
          a = 0;

      for (this[e + o] = 255 & t; --o >= 0 && (s *= 256);) t < 0 && 0 === a && 0 !== this[e + o + 1] && (a = 1), this[e + o] = (t / s >> 0) - a & 255;

      return e + r;
    }, u.prototype.writeInt8 = function (t, e, r) {
      return t = +t, e |= 0, r || A(this, t, e, 1, 127, -128), u.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), t < 0 && (t = 255 + t + 1), this[e] = 255 & t, e + 1;
    }, u.prototype.writeInt16LE = function (t, e, r) {
      return t = +t, e |= 0, r || A(this, t, e, 2, 32767, -32768), u.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8) : F(this, t, e, !0), e + 2;
    }, u.prototype.writeInt16BE = function (t, e, r) {
      return t = +t, e |= 0, r || A(this, t, e, 2, 32767, -32768), u.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, this[e + 1] = 255 & t) : F(this, t, e, !1), e + 2;
    }, u.prototype.writeInt32LE = function (t, e, r) {
      return t = +t, e |= 0, r || A(this, t, e, 4, 2147483647, -2147483648), u.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24) : L(this, t, e, !0), e + 4;
    }, u.prototype.writeInt32BE = function (t, e, r) {
      return t = +t, e |= 0, r || A(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), u.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t) : L(this, t, e, !1), e + 4;
    }, u.prototype.writeFloatLE = function (t, e, r) {
      return B(this, t, e, !0, r);
    }, u.prototype.writeFloatBE = function (t, e, r) {
      return B(this, t, e, !1, r);
    }, u.prototype.writeDoubleLE = function (t, e, r) {
      return D(this, t, e, !0, r);
    }, u.prototype.writeDoubleBE = function (t, e, r) {
      return D(this, t, e, !1, r);
    }, u.prototype.copy = function (t, e, r, n) {
      if (r || (r = 0), n || 0 === n || (n = this.length), e >= t.length && (e = t.length), e || (e = 0), n > 0 && n < r && (n = r), n === r) return 0;
      if (0 === t.length || 0 === this.length) return 0;
      if (e < 0) throw new RangeError("targetStart out of bounds");
      if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
      if (n < 0) throw new RangeError("sourceEnd out of bounds");
      n > this.length && (n = this.length), t.length - e < n - r && (n = t.length - e + r);
      var i,
          o = n - r;
      if (this === t && r < e && e < n) for (i = o - 1; i >= 0; --i) t[i + e] = this[i + r];else if (o < 1e3 || !u.TYPED_ARRAY_SUPPORT) for (i = 0; i < o; ++i) t[i + e] = this[i + r];else Uint8Array.prototype.set.call(t, this.subarray(r, r + o), e);
      return o;
    }, u.prototype.fill = function (t, e, r, n) {
      if ("string" == typeof t) {
        if ("string" == typeof e ? (n = e, e = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), 1 === t.length) {
          var i = t.charCodeAt(0);
          i < 256 && (t = i);
        }

        if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
        if ("string" == typeof n && !u.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
      } else "number" == typeof t && (t &= 255);

      if (e < 0 || this.length < e || this.length < r) throw new RangeError("Out of range index");
      if (r <= e) return this;
      var o;
      if (e >>>= 0, r = void 0 === r ? this.length : r >>> 0, t || (t = 0), "number" == typeof t) for (o = e; o < r; ++o) this[o] = t;else {
        var s = u.isBuffer(t) ? t : N(new u(t, n).toString()),
            a = s.length;

        for (o = 0; o < r - e; ++o) this[o + e] = s[o % a];
      }
      return this;
    };
    var I = /[^+\/0-9A-Za-z-_]/g;

    function U(t) {
      return t < 16 ? "0" + t.toString(16) : t.toString(16);
    }

    function N(t, e) {
      var r;
      e = e || 1 / 0;

      for (var n = t.length, i = null, o = [], s = 0; s < n; ++s) {
        if ((r = t.charCodeAt(s)) > 55295 && r < 57344) {
          if (!i) {
            if (r > 56319) {
              (e -= 3) > -1 && o.push(239, 191, 189);
              continue;
            }

            if (s + 1 === n) {
              (e -= 3) > -1 && o.push(239, 191, 189);
              continue;
            }

            i = r;
            continue;
          }

          if (r < 56320) {
            (e -= 3) > -1 && o.push(239, 191, 189), i = r;
            continue;
          }

          r = 65536 + (i - 55296 << 10 | r - 56320);
        } else i && (e -= 3) > -1 && o.push(239, 191, 189);

        if (i = null, r < 128) {
          if ((e -= 1) < 0) break;
          o.push(r);
        } else if (r < 2048) {
          if ((e -= 2) < 0) break;
          o.push(r >> 6 | 192, 63 & r | 128);
        } else if (r < 65536) {
          if ((e -= 3) < 0) break;
          o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
        } else {
          if (!(r < 1114112)) throw new Error("Invalid code point");
          if ((e -= 4) < 0) break;
          o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
        }
      }

      return o;
    }

    function H(t) {
      return n.toByteArray(function (t) {
        if ((t = function (t) {
          return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
        }(t).replace(I, "")).length < 2) return "";

        for (; t.length % 4 != 0;) t += "=";

        return t;
      }(t));
    }

    function V(t, e, r, n) {
      for (var i = 0; i < n && !(i + r >= e.length || i >= t.length); ++i) e[i + r] = t[i];

      return i;
    }
  }).call(this, r(0));
}, function (t, e) {
  var r,
      n,
      i = t.exports = {};

  function o() {
    throw new Error("setTimeout has not been defined");
  }

  function s() {
    throw new Error("clearTimeout has not been defined");
  }

  function a(t) {
    if (r === setTimeout) return setTimeout(t, 0);
    if ((r === o || !r) && setTimeout) return r = setTimeout, setTimeout(t, 0);

    try {
      return r(t, 0);
    } catch (e) {
      try {
        return r.call(null, t, 0);
      } catch (e) {
        return r.call(this, t, 0);
      }
    }
  }

  !function () {
    try {
      r = "function" == typeof setTimeout ? setTimeout : o;
    } catch (t) {
      r = o;
    }

    try {
      n = "function" == typeof clearTimeout ? clearTimeout : s;
    } catch (t) {
      n = s;
    }
  }();
  var u,
      c = [],
      l = !1,
      f = -1;

  function h() {
    l && u && (l = !1, u.length ? c = u.concat(c) : f = -1, c.length && p());
  }

  function p() {
    if (!l) {
      var t = a(h);
      l = !0;

      for (var e = c.length; e;) {
        for (u = c, c = []; ++f < e;) u && u[f].run();

        f = -1, e = c.length;
      }

      u = null, l = !1, function (t) {
        if (n === clearTimeout) return clearTimeout(t);
        if ((n === s || !n) && clearTimeout) return n = clearTimeout, clearTimeout(t);

        try {
          n(t);
        } catch (e) {
          try {
            return n.call(null, t);
          } catch (e) {
            return n.call(this, t);
          }
        }
      }(t);
    }
  }

  function d(t, e) {
    this.fun = t, this.array = e;
  }

  function _() {}

  i.nextTick = function (t) {
    var e = new Array(arguments.length - 1);
    if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
    c.push(new d(t, e)), 1 !== c.length || l || a(p);
  }, d.prototype.run = function () {
    this.fun.apply(null, this.array);
  }, i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.version = "", i.versions = {}, i.on = _, i.addListener = _, i.once = _, i.off = _, i.removeListener = _, i.removeAllListeners = _, i.emit = _, i.prependListener = _, i.prependOnceListener = _, i.listeners = function (t) {
    return [];
  }, i.binding = function (t) {
    throw new Error("process.binding is not supported");
  }, i.cwd = function () {
    return "/";
  }, i.chdir = function (t) {
    throw new Error("process.chdir is not supported");
  }, i.umask = function () {
    return 0;
  };
}, function (t, e, r) {
  (function (t) {
    function r(t) {
      return Object.prototype.toString.call(t);
    }

    e.isArray = function (t) {
      return Array.isArray ? Array.isArray(t) : "[object Array]" === r(t);
    }, e.isBoolean = function (t) {
      return "boolean" == typeof t;
    }, e.isNull = function (t) {
      return null === t;
    }, e.isNullOrUndefined = function (t) {
      return null == t;
    }, e.isNumber = function (t) {
      return "number" == typeof t;
    }, e.isString = function (t) {
      return "string" == typeof t;
    }, e.isSymbol = function (t) {
      return "symbol" == _typeof(t);
    }, e.isUndefined = function (t) {
      return void 0 === t;
    }, e.isRegExp = function (t) {
      return "[object RegExp]" === r(t);
    }, e.isObject = function (t) {
      return "object" == _typeof(t) && null !== t;
    }, e.isDate = function (t) {
      return "[object Date]" === r(t);
    }, e.isError = function (t) {
      return "[object Error]" === r(t) || t instanceof Error;
    }, e.isFunction = function (t) {
      return "function" == typeof t;
    }, e.isPrimitive = function (t) {
      return null === t || "boolean" == typeof t || "number" == typeof t || "string" == typeof t || "symbol" == _typeof(t) || void 0 === t;
    }, e.isBuffer = t.isBuffer;
  }).call(this, r(3).Buffer);
}, function (t, e, r) {
  "use strict";

  (function (e) {
    !e.version || 0 === e.version.indexOf("v0.") || 0 === e.version.indexOf("v1.") && 0 !== e.version.indexOf("v1.8.") ? t.exports = {
      nextTick: function (t, r, n, i) {
        if ("function" != typeof t) throw new TypeError('"callback" argument must be a function');
        var o,
            s,
            a = arguments.length;

        switch (a) {
          case 0:
          case 1:
            return e.nextTick(t);

          case 2:
            return e.nextTick(function () {
              t.call(null, r);
            });

          case 3:
            return e.nextTick(function () {
              t.call(null, r, n);
            });

          case 4:
            return e.nextTick(function () {
              t.call(null, r, n, i);
            });

          default:
            for (o = new Array(a - 1), s = 0; s < o.length;) o[s++] = arguments[s];

            return e.nextTick(function () {
              t.apply(null, o);
            });
        }
      }
    } : t.exports = e;
  }).call(this, r(4));
}, function (t, e, r) {
  var n = r(3),
      i = n.Buffer;

  function o(t, e) {
    for (var r in t) e[r] = t[r];
  }

  function s(t, e, r) {
    return i(t, e, r);
  }

  i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = n : (o(n, e), e.Buffer = s), o(i, s), s.from = function (t, e, r) {
    if ("number" == typeof t) throw new TypeError("Argument must not be a number");
    return i(t, e, r);
  }, s.alloc = function (t, e, r) {
    if ("number" != typeof t) throw new TypeError("Argument must be a number");
    var n = i(t);
    return void 0 !== e ? "string" == typeof r ? n.fill(e, r) : n.fill(e) : n.fill(0), n;
  }, s.allocUnsafe = function (t) {
    if ("number" != typeof t) throw new TypeError("Argument must be a number");
    return i(t);
  }, s.allocUnsafeSlow = function (t) {
    if ("number" != typeof t) throw new TypeError("Argument must be a number");
    return n.SlowBuffer(t);
  };
}, function (t, e, r) {
  var n = r(17)(Object, "create");
  t.exports = n;
}, function (t, e, r) {
  var n = r(31);

  t.exports = function (t, e) {
    for (var r = t.length; r--;) if (n(t[r][0], e)) return r;

    return -1;
  };
}, function (t, e, r) {
  var n = r(96);

  t.exports = function (t, e) {
    var r = t.__data__;
    return n(e) ? r["string" == typeof e ? "string" : "hash"] : r.map;
  };
}, function (t, e, r) {
  (function (t) {
    var n = void 0 !== t && t || "undefined" != typeof self && self || window,
        i = Function.prototype.apply;

    function o(t, e) {
      this._id = t, this._clearFn = e;
    }

    e.setTimeout = function () {
      return new o(i.call(setTimeout, n, arguments), clearTimeout);
    }, e.setInterval = function () {
      return new o(i.call(setInterval, n, arguments), clearInterval);
    }, e.clearTimeout = e.clearInterval = function (t) {
      t && t.close();
    }, o.prototype.unref = o.prototype.ref = function () {}, o.prototype.close = function () {
      this._clearFn.call(n, this._id);
    }, e.enroll = function (t, e) {
      clearTimeout(t._idleTimeoutId), t._idleTimeout = e;
    }, e.unenroll = function (t) {
      clearTimeout(t._idleTimeoutId), t._idleTimeout = -1;
    }, e._unrefActive = e.active = function (t) {
      clearTimeout(t._idleTimeoutId);
      var e = t._idleTimeout;
      e >= 0 && (t._idleTimeoutId = setTimeout(function () {
        t._onTimeout && t._onTimeout();
      }, e));
    }, r(35), e.setImmediate = "undefined" != typeof self && self.setImmediate || void 0 !== t && t.setImmediate || this && this.setImmediate, e.clearImmediate = "undefined" != typeof self && self.clearImmediate || void 0 !== t && t.clearImmediate || this && this.clearImmediate;
  }).call(this, r(0));
}, function (t, e) {
  function r() {
    this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
  }

  function n(t) {
    return "function" == typeof t;
  }

  function i(t) {
    return "object" == _typeof(t) && null !== t;
  }

  function o(t) {
    return void 0 === t;
  }

  t.exports = r, r.EventEmitter = r, r.prototype._events = void 0, r.prototype._maxListeners = void 0, r.defaultMaxListeners = 10, r.prototype.setMaxListeners = function (t) {
    if (!function (t) {
      return "number" == typeof t;
    }(t) || t < 0 || isNaN(t)) throw TypeError("n must be a positive number");
    return this._maxListeners = t, this;
  }, r.prototype.emit = function (t) {
    var e, r, s, a, u, c;

    if (this._events || (this._events = {}), "error" === t && (!this._events.error || i(this._events.error) && !this._events.error.length)) {
      if ((e = arguments[1]) instanceof Error) throw e;
      var l = new Error('Uncaught, unspecified "error" event. (' + e + ")");
      throw l.context = e, l;
    }

    if (o(r = this._events[t])) return !1;
    if (n(r)) switch (arguments.length) {
      case 1:
        r.call(this);
        break;

      case 2:
        r.call(this, arguments[1]);
        break;

      case 3:
        r.call(this, arguments[1], arguments[2]);
        break;

      default:
        a = Array.prototype.slice.call(arguments, 1), r.apply(this, a);
    } else if (i(r)) for (a = Array.prototype.slice.call(arguments, 1), s = (c = r.slice()).length, u = 0; u < s; u++) c[u].apply(this, a);
    return !0;
  }, r.prototype.addListener = function (t, e) {
    var s;
    if (!n(e)) throw TypeError("listener must be a function");
    return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", t, n(e.listener) ? e.listener : e), this._events[t] ? i(this._events[t]) ? this._events[t].push(e) : this._events[t] = [this._events[t], e] : this._events[t] = e, i(this._events[t]) && !this._events[t].warned && (s = o(this._maxListeners) ? r.defaultMaxListeners : this._maxListeners) && s > 0 && this._events[t].length > s && (this._events[t].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[t].length), "function" == typeof console.trace && console.trace()), this;
  }, r.prototype.on = r.prototype.addListener, r.prototype.once = function (t, e) {
    if (!n(e)) throw TypeError("listener must be a function");
    var r = !1;

    function i() {
      this.removeListener(t, i), r || (r = !0, e.apply(this, arguments));
    }

    return i.listener = e, this.on(t, i), this;
  }, r.prototype.removeListener = function (t, e) {
    var r, o, s, a;
    if (!n(e)) throw TypeError("listener must be a function");
    if (!this._events || !this._events[t]) return this;
    if (s = (r = this._events[t]).length, o = -1, r === e || n(r.listener) && r.listener === e) delete this._events[t], this._events.removeListener && this.emit("removeListener", t, e);else if (i(r)) {
      for (a = s; a-- > 0;) if (r[a] === e || r[a].listener && r[a].listener === e) {
        o = a;
        break;
      }

      if (o < 0) return this;
      1 === r.length ? (r.length = 0, delete this._events[t]) : r.splice(o, 1), this._events.removeListener && this.emit("removeListener", t, e);
    }
    return this;
  }, r.prototype.removeAllListeners = function (t) {
    var e, r;
    if (!this._events) return this;
    if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[t] && delete this._events[t], this;

    if (0 === arguments.length) {
      for (e in this._events) "removeListener" !== e && this.removeAllListeners(e);

      return this.removeAllListeners("removeListener"), this._events = {}, this;
    }

    if (n(r = this._events[t])) this.removeListener(t, r);else if (r) for (; r.length;) this.removeListener(t, r[r.length - 1]);
    return delete this._events[t], this;
  }, r.prototype.listeners = function (t) {
    return this._events && this._events[t] ? n(this._events[t]) ? [this._events[t]] : this._events[t].slice() : [];
  }, r.prototype.listenerCount = function (t) {
    if (this._events) {
      var e = this._events[t];
      if (n(e)) return 1;
      if (e) return e.length;
    }

    return 0;
  }, r.listenerCount = function (t, e) {
    return t.listenerCount(e);
  };
}, function (t, e, r) {
  (e = t.exports = r(23)).Stream = e, e.Readable = e, e.Writable = r(14), e.Duplex = r(1), e.Transform = r(27), e.PassThrough = r(45);
}, function (t, e, r) {
  "use strict";

  (function (e, n, i) {
    var o = r(6);

    function s(t) {
      var e = this;
      this.next = null, this.entry = null, this.finish = function () {
        !function (t, e, r) {
          var n = t.entry;

          for (t.entry = null; n;) {
            var i = n.callback;
            e.pendingcb--, i(void 0), n = n.next;
          }

          e.corkedRequestsFree ? e.corkedRequestsFree.next = t : e.corkedRequestsFree = t;
        }(e, t);
      };
    }

    t.exports = m;
    var a,
        u = !e.browser && ["v0.10", "v0.9."].indexOf(e.version.slice(0, 5)) > -1 ? n : o.nextTick;
    m.WritableState = y;
    var c = r(5);
    c.inherits = r(2);

    var l,
        f = {
      deprecate: r(44)
    },
        h = r(24),
        p = r(7).Buffer,
        d = i.Uint8Array || function () {},
        _ = r(25);

    function v() {}

    function y(t, e) {
      a = a || r(1), t = t || {};
      var n = e instanceof a;
      this.objectMode = !!t.objectMode, n && (this.objectMode = this.objectMode || !!t.writableObjectMode);
      var i = t.highWaterMark,
          c = t.writableHighWaterMark,
          l = this.objectMode ? 16 : 16384;
      this.highWaterMark = i || 0 === i ? i : n && (c || 0 === c) ? c : l, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
      var f = !1 === t.decodeStrings;
      this.decodeStrings = !f, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (t) {
        !function (t, e) {
          var r = t._writableState,
              n = r.sync,
              i = r.writecb;
          if (function (t) {
            t.writing = !1, t.writecb = null, t.length -= t.writelen, t.writelen = 0;
          }(r), e) !function (t, e, r, n, i) {
            --e.pendingcb, r ? (o.nextTick(i, n), o.nextTick(x, t, e), t._writableState.errorEmitted = !0, t.emit("error", n)) : (i(n), t._writableState.errorEmitted = !0, t.emit("error", n), x(t, e));
          }(t, r, n, e, i);else {
            var s = E(r);
            s || r.corked || r.bufferProcessing || !r.bufferedRequest || w(t, r), n ? u(b, t, r, s, i) : b(t, r, s, i);
          }
        }(e, t);
      }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new s(this);
    }

    function m(t) {
      if (a = a || r(1), !(l.call(m, this) || this instanceof a)) return new m(t);
      this._writableState = new y(t, this), this.writable = !0, t && ("function" == typeof t.write && (this._write = t.write), "function" == typeof t.writev && (this._writev = t.writev), "function" == typeof t.destroy && (this._destroy = t.destroy), "function" == typeof t.final && (this._final = t.final)), h.call(this);
    }

    function g(t, e, r, n, i, o, s) {
      e.writelen = n, e.writecb = s, e.writing = !0, e.sync = !0, r ? t._writev(i, e.onwrite) : t._write(i, o, e.onwrite), e.sync = !1;
    }

    function b(t, e, r, n) {
      r || function (t, e) {
        0 === e.length && e.needDrain && (e.needDrain = !1, t.emit("drain"));
      }(t, e), e.pendingcb--, n(), x(t, e);
    }

    function w(t, e) {
      e.bufferProcessing = !0;
      var r = e.bufferedRequest;

      if (t._writev && r && r.next) {
        var n = e.bufferedRequestCount,
            i = new Array(n),
            o = e.corkedRequestsFree;
        o.entry = r;

        for (var a = 0, u = !0; r;) i[a] = r, r.isBuf || (u = !1), r = r.next, a += 1;

        i.allBuffers = u, g(t, e, !0, e.length, i, "", o.finish), e.pendingcb++, e.lastBufferedRequest = null, o.next ? (e.corkedRequestsFree = o.next, o.next = null) : e.corkedRequestsFree = new s(e), e.bufferedRequestCount = 0;
      } else {
        for (; r;) {
          var c = r.chunk,
              l = r.encoding,
              f = r.callback;
          if (g(t, e, !1, e.objectMode ? 1 : c.length, c, l, f), r = r.next, e.bufferedRequestCount--, e.writing) break;
        }

        null === r && (e.lastBufferedRequest = null);
      }

      e.bufferedRequest = r, e.bufferProcessing = !1;
    }

    function E(t) {
      return t.ending && 0 === t.length && null === t.bufferedRequest && !t.finished && !t.writing;
    }

    function C(t, e) {
      t._final(function (r) {
        e.pendingcb--, r && t.emit("error", r), e.prefinished = !0, t.emit("prefinish"), x(t, e);
      });
    }

    function x(t, e) {
      var r = E(e);
      return r && (function (t, e) {
        e.prefinished || e.finalCalled || ("function" == typeof t._final ? (e.pendingcb++, e.finalCalled = !0, o.nextTick(C, t, e)) : (e.prefinished = !0, t.emit("prefinish")));
      }(t, e), 0 === e.pendingcb && (e.finished = !0, t.emit("finish"))), r;
    }

    c.inherits(m, h), y.prototype.getBuffer = function () {
      for (var t = this.bufferedRequest, e = []; t;) e.push(t), t = t.next;

      return e;
    }, function () {
      try {
        Object.defineProperty(y.prototype, "buffer", {
          get: f.deprecate(function () {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (t) {}
    }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (l = Function.prototype[Symbol.hasInstance], Object.defineProperty(m, Symbol.hasInstance, {
      value: function (t) {
        return !!l.call(this, t) || this === m && t && t._writableState instanceof y;
      }
    })) : l = function (t) {
      return t instanceof this;
    }, m.prototype.pipe = function () {
      this.emit("error", new Error("Cannot pipe, not readable"));
    }, m.prototype.write = function (t, e, r) {
      var n = this._writableState,
          i = !1,
          s = !n.objectMode && function (t) {
        return p.isBuffer(t) || t instanceof d;
      }(t);

      return s && !p.isBuffer(t) && (t = function (t) {
        return p.from(t);
      }(t)), "function" == typeof e && (r = e, e = null), s ? e = "buffer" : e || (e = n.defaultEncoding), "function" != typeof r && (r = v), n.ended ? function (t, e) {
        var r = new Error("write after end");
        t.emit("error", r), o.nextTick(e, r);
      }(this, r) : (s || function (t, e, r, n) {
        var i = !0,
            s = !1;
        return null === r ? s = new TypeError("May not write null values to stream") : "string" == typeof r || void 0 === r || e.objectMode || (s = new TypeError("Invalid non-string/buffer chunk")), s && (t.emit("error", s), o.nextTick(n, s), i = !1), i;
      }(this, n, t, r)) && (n.pendingcb++, i = function (t, e, r, n, i, o) {
        if (!r) {
          var s = function (t, e, r) {
            return t.objectMode || !1 === t.decodeStrings || "string" != typeof e || (e = p.from(e, r)), e;
          }(e, n, i);

          n !== s && (r = !0, i = "buffer", n = s);
        }

        var a = e.objectMode ? 1 : n.length;
        e.length += a;
        var u = e.length < e.highWaterMark;

        if (u || (e.needDrain = !0), e.writing || e.corked) {
          var c = e.lastBufferedRequest;
          e.lastBufferedRequest = {
            chunk: n,
            encoding: i,
            isBuf: r,
            callback: o,
            next: null
          }, c ? c.next = e.lastBufferedRequest : e.bufferedRequest = e.lastBufferedRequest, e.bufferedRequestCount += 1;
        } else g(t, e, !1, a, n, i, o);

        return u;
      }(this, n, s, t, e, r)), i;
    }, m.prototype.cork = function () {
      this._writableState.corked++;
    }, m.prototype.uncork = function () {
      var t = this._writableState;
      t.corked && (t.corked--, t.writing || t.corked || t.finished || t.bufferProcessing || !t.bufferedRequest || w(this, t));
    }, m.prototype.setDefaultEncoding = function (t) {
      if ("string" == typeof t && (t = t.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((t + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + t);
      return this._writableState.defaultEncoding = t, this;
    }, Object.defineProperty(m.prototype, "writableHighWaterMark", {
      enumerable: !1,
      get: function () {
        return this._writableState.highWaterMark;
      }
    }), m.prototype._write = function (t, e, r) {
      r(new Error("_write() is not implemented"));
    }, m.prototype._writev = null, m.prototype.end = function (t, e, r) {
      var n = this._writableState;
      "function" == typeof t ? (r = t, t = null, e = null) : "function" == typeof e && (r = e, e = null), null !== t && void 0 !== t && this.write(t, e), n.corked && (n.corked = 1, this.uncork()), n.ending || n.finished || function (t, e, r) {
        e.ending = !0, x(t, e), r && (e.finished ? o.nextTick(r) : t.once("finish", r)), e.ended = !0, t.writable = !1;
      }(this, n, r);
    }, Object.defineProperty(m.prototype, "destroyed", {
      get: function () {
        return void 0 !== this._writableState && this._writableState.destroyed;
      },
      set: function (t) {
        this._writableState && (this._writableState.destroyed = t);
      }
    }), m.prototype.destroy = _.destroy, m.prototype._undestroy = _.undestroy, m.prototype._destroy = function (t, e) {
      this.end(), e(t);
    };
  }).call(this, r(4), r(11).setImmediate, r(0));
}, function (t, e, r) {
  (function (e, r, n) {
    t.exports = function t(e, r, n) {
      function i(s, a) {
        if (!r[s]) {
          if (!e[s]) {
            var u = "function" == typeof _dereq_ && _dereq_;
            if (!a && u) return u(s, !0);
            if (o) return o(s, !0);
            var c = new Error("Cannot find module '" + s + "'");
            throw c.code = "MODULE_NOT_FOUND", c;
          }

          var l = r[s] = {
            exports: {}
          };
          e[s][0].call(l.exports, function (t) {
            return i(e[s][1][t] || t);
          }, l, l.exports, t, e, r, n);
        }

        return r[s].exports;
      }

      for (var o = "function" == typeof _dereq_ && _dereq_, s = 0; s < n.length; s++) i(n[s]);

      return i;
    }({
      1: [function (t, e, r) {
        "use strict";

        e.exports = function (t) {
          var e = t._SomePromiseArray;

          function r(t) {
            var r = new e(t),
                n = r.promise();
            return r.setHowMany(1), r.setUnwrap(), r.init(), n;
          }

          t.any = function (t) {
            return r(t);
          }, t.prototype.any = function () {
            return r(this);
          };
        };
      }, {}],
      2: [function (t, r, n) {
        "use strict";

        var i;

        try {
          throw new Error();
        } catch (t) {
          i = t;
        }

        var o = t("./schedule"),
            s = t("./queue"),
            a = t("./util");

        function u() {
          this._customScheduler = !1, this._isTickUsed = !1, this._lateQueue = new s(16), this._normalQueue = new s(16), this._haveDrainedQueues = !1, this._trampolineEnabled = !0;
          var t = this;
          this.drainQueues = function () {
            t._drainQueues();
          }, this._schedule = o;
        }

        function c(t, e, r) {
          this._lateQueue.push(t, e, r), this._queueTick();
        }

        function l(t, e, r) {
          this._normalQueue.push(t, e, r), this._queueTick();
        }

        function f(t) {
          this._normalQueue._pushOne(t), this._queueTick();
        }

        u.prototype.setScheduler = function (t) {
          var e = this._schedule;
          return this._schedule = t, this._customScheduler = !0, e;
        }, u.prototype.hasCustomScheduler = function () {
          return this._customScheduler;
        }, u.prototype.enableTrampoline = function () {
          this._trampolineEnabled = !0;
        }, u.prototype.disableTrampolineIfNecessary = function () {
          a.hasDevTools && (this._trampolineEnabled = !1);
        }, u.prototype.haveItemsQueued = function () {
          return this._isTickUsed || this._haveDrainedQueues;
        }, u.prototype.fatalError = function (t, r) {
          r ? (e.stderr.write("Fatal " + (t instanceof Error ? t.stack : t) + "\n"), e.exit(2)) : this.throwLater(t);
        }, u.prototype.throwLater = function (t, e) {
          if (1 === arguments.length && (e = t, t = function () {
            throw e;
          }), "undefined" != typeof setTimeout) setTimeout(function () {
            t(e);
          }, 0);else try {
            this._schedule(function () {
              t(e);
            });
          } catch (t) {
            throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
          }
        }, a.hasDevTools ? (u.prototype.invokeLater = function (t, e, r) {
          this._trampolineEnabled ? c.call(this, t, e, r) : this._schedule(function () {
            setTimeout(function () {
              t.call(e, r);
            }, 100);
          });
        }, u.prototype.invoke = function (t, e, r) {
          this._trampolineEnabled ? l.call(this, t, e, r) : this._schedule(function () {
            t.call(e, r);
          });
        }, u.prototype.settlePromises = function (t) {
          this._trampolineEnabled ? f.call(this, t) : this._schedule(function () {
            t._settlePromises();
          });
        }) : (u.prototype.invokeLater = c, u.prototype.invoke = l, u.prototype.settlePromises = f), u.prototype._drainQueue = function (t) {
          for (; t.length() > 0;) {
            var e = t.shift();

            if ("function" == typeof e) {
              var r = t.shift(),
                  n = t.shift();
              e.call(r, n);
            } else e._settlePromises();
          }
        }, u.prototype._drainQueues = function () {
          this._drainQueue(this._normalQueue), this._reset(), this._haveDrainedQueues = !0, this._drainQueue(this._lateQueue);
        }, u.prototype._queueTick = function () {
          this._isTickUsed || (this._isTickUsed = !0, this._schedule(this.drainQueues));
        }, u.prototype._reset = function () {
          this._isTickUsed = !1;
        }, r.exports = u, r.exports.firstLineError = i;
      }, {
        "./queue": 26,
        "./schedule": 29,
        "./util": 36
      }],
      3: [function (t, e, r) {
        "use strict";

        e.exports = function (t, e, r, n) {
          var i = !1,
              o = function (t, e) {
            this._reject(e);
          },
              s = function (t, e) {
            e.promiseRejectionQueued = !0, e.bindingPromise._then(o, o, null, this, t);
          },
              a = function (t, e) {
            0 == (50397184 & this._bitField) && this._resolveCallback(e.target);
          },
              u = function (t, e) {
            e.promiseRejectionQueued || this._reject(t);
          };

          t.prototype.bind = function (o) {
            i || (i = !0, t.prototype._propagateFrom = n.propagateFromFunction(), t.prototype._boundValue = n.boundValueFunction());
            var c = r(o),
                l = new t(e);

            l._propagateFrom(this, 1);

            var f = this._target();

            if (l._setBoundTo(c), c instanceof t) {
              var h = {
                promiseRejectionQueued: !1,
                promise: l,
                target: f,
                bindingPromise: c
              };
              f._then(e, s, void 0, l, h), c._then(a, u, void 0, l, h), l._setOnCancel(c);
            } else l._resolveCallback(f);

            return l;
          }, t.prototype._setBoundTo = function (t) {
            void 0 !== t ? (this._bitField = 2097152 | this._bitField, this._boundTo = t) : this._bitField = -2097153 & this._bitField;
          }, t.prototype._isBound = function () {
            return 2097152 == (2097152 & this._bitField);
          }, t.bind = function (e, r) {
            return t.resolve(r).bind(e);
          };
        };
      }, {}],
      4: [function (t, e, r) {
        "use strict";

        var n;
        "undefined" != typeof Promise && (n = Promise);
        var i = t("./promise")();
        i.noConflict = function () {
          try {
            Promise === i && (Promise = n);
          } catch (t) {}

          return i;
        }, e.exports = i;
      }, {
        "./promise": 22
      }],
      5: [function (t, e, r) {
        "use strict";

        var n = Object.create;

        if (n) {
          var i = n(null),
              o = n(null);
          i[" size"] = o[" size"] = 0;
        }

        e.exports = function (e) {
          var r = t("./util"),
              n = r.canEvaluate;

          function i(t) {
            return function (t, n) {
              var i;

              if (null != t && (i = t[n]), "function" != typeof i) {
                var o = "Object " + r.classString(t) + " has no method '" + r.toString(n) + "'";
                throw new e.TypeError(o);
              }

              return i;
            }(t, this.pop()).apply(t, this);
          }

          function o(t) {
            return t[this];
          }

          function s(t) {
            var e = +this;
            return e < 0 && (e = Math.max(0, e + t.length)), t[e];
          }

          r.isIdentifier, e.prototype.call = function (t) {
            var e = [].slice.call(arguments, 1);
            return e.push(t), this._then(i, void 0, void 0, e, void 0);
          }, e.prototype.get = function (t) {
            var e;
            if ("number" == typeof t) e = s;else if (n) {
              var r = (void 0)(t);
              e = null !== r ? r : o;
            } else e = o;
            return this._then(e, void 0, void 0, t, void 0);
          };
        };
      }, {
        "./util": 36
      }],
      6: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n, i) {
          var o = t("./util"),
              s = o.tryCatch,
              a = o.errorObj,
              u = e._async;
          e.prototype.break = e.prototype.cancel = function () {
            if (!i.cancellation()) return this._warn("cancellation is disabled");

            for (var t = this, e = t; t._isCancellable();) {
              if (!t._cancelBy(e)) {
                e._isFollowing() ? e._followee().cancel() : e._cancelBranched();
                break;
              }

              var r = t._cancellationParent;

              if (null == r || !r._isCancellable()) {
                t._isFollowing() ? t._followee().cancel() : t._cancelBranched();
                break;
              }

              t._isFollowing() && t._followee().cancel(), t._setWillBeCancelled(), e = t, t = r;
            }
          }, e.prototype._branchHasCancelled = function () {
            this._branchesRemainingToCancel--;
          }, e.prototype._enoughBranchesHaveCancelled = function () {
            return void 0 === this._branchesRemainingToCancel || this._branchesRemainingToCancel <= 0;
          }, e.prototype._cancelBy = function (t) {
            return t === this ? (this._branchesRemainingToCancel = 0, this._invokeOnCancel(), !0) : (this._branchHasCancelled(), !!this._enoughBranchesHaveCancelled() && (this._invokeOnCancel(), !0));
          }, e.prototype._cancelBranched = function () {
            this._enoughBranchesHaveCancelled() && this._cancel();
          }, e.prototype._cancel = function () {
            this._isCancellable() && (this._setCancelled(), u.invoke(this._cancelPromises, this, void 0));
          }, e.prototype._cancelPromises = function () {
            this._length() > 0 && this._settlePromises();
          }, e.prototype._unsetOnCancel = function () {
            this._onCancelField = void 0;
          }, e.prototype._isCancellable = function () {
            return this.isPending() && !this._isCancelled();
          }, e.prototype.isCancellable = function () {
            return this.isPending() && !this.isCancelled();
          }, e.prototype._doInvokeOnCancel = function (t, e) {
            if (o.isArray(t)) for (var r = 0; r < t.length; ++r) this._doInvokeOnCancel(t[r], e);else if (void 0 !== t) if ("function" == typeof t) {
              if (!e) {
                var n = s(t).call(this._boundValue());
                n === a && (this._attachExtraTrace(n.e), u.throwLater(n.e));
              }
            } else t._resultCancelled(this);
          }, e.prototype._invokeOnCancel = function () {
            var t = this._onCancel();

            this._unsetOnCancel(), u.invoke(this._doInvokeOnCancel, this, t);
          }, e.prototype._invokeInternalOnCancel = function () {
            this._isCancellable() && (this._doInvokeOnCancel(this._onCancel(), !0), this._unsetOnCancel());
          }, e.prototype._resultCancelled = function () {
            this.cancel();
          };
        };
      }, {
        "./util": 36
      }],
      7: [function (t, e, r) {
        "use strict";

        e.exports = function (e) {
          var r = t("./util"),
              n = t("./es5").keys,
              i = r.tryCatch,
              o = r.errorObj;
          return function (t, s, a) {
            return function (u) {
              var c = a._boundValue();

              t: for (var l = 0; l < t.length; ++l) {
                var f = t[l];

                if (f === Error || null != f && f.prototype instanceof Error) {
                  if (u instanceof f) return i(s).call(c, u);
                } else if ("function" == typeof f) {
                  var h = i(f).call(c, u);
                  if (h === o) return h;
                  if (h) return i(s).call(c, u);
                } else if (r.isObject(u)) {
                  for (var p = n(f), d = 0; d < p.length; ++d) {
                    var _ = p[d];
                    if (f[_] != u[_]) continue t;
                  }

                  return i(s).call(c, u);
                }
              }

              return e;
            };
          };
        };
      }, {
        "./es5": 13,
        "./util": 36
      }],
      8: [function (t, e, r) {
        "use strict";

        e.exports = function (t) {
          var e = !1,
              r = [];

          function n() {
            this._trace = new n.CapturedTrace(i());
          }

          function i() {
            var t = r.length - 1;
            if (t >= 0) return r[t];
          }

          return t.prototype._promiseCreated = function () {}, t.prototype._pushContext = function () {}, t.prototype._popContext = function () {
            return null;
          }, t._peekContext = t.prototype._peekContext = function () {}, n.prototype._pushContext = function () {
            void 0 !== this._trace && (this._trace._promiseCreated = null, r.push(this._trace));
          }, n.prototype._popContext = function () {
            if (void 0 !== this._trace) {
              var t = r.pop(),
                  e = t._promiseCreated;
              return t._promiseCreated = null, e;
            }

            return null;
          }, n.CapturedTrace = null, n.create = function () {
            if (e) return new n();
          }, n.deactivateLongStackTraces = function () {}, n.activateLongStackTraces = function () {
            var r = t.prototype._pushContext,
                o = t.prototype._popContext,
                s = t._peekContext,
                a = t.prototype._peekContext,
                u = t.prototype._promiseCreated;
            n.deactivateLongStackTraces = function () {
              t.prototype._pushContext = r, t.prototype._popContext = o, t._peekContext = s, t.prototype._peekContext = a, t.prototype._promiseCreated = u, e = !1;
            }, e = !0, t.prototype._pushContext = n.prototype._pushContext, t.prototype._popContext = n.prototype._popContext, t._peekContext = t.prototype._peekContext = i, t.prototype._promiseCreated = function () {
              var t = this._peekContext();

              t && null == t._promiseCreated && (t._promiseCreated = this);
            };
          }, n;
        };
      }, {}],
      9: [function (t, r, n) {
        "use strict";

        r.exports = function (r, n) {
          var i,
              o,
              s,
              a = r._getDomain,
              u = r._async,
              c = t("./errors").Warning,
              l = t("./util"),
              f = l.canAttachTrace,
              h = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/,
              p = /\((?:timers\.js):\d+:\d+\)/,
              d = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/,
              _ = null,
              v = null,
              y = !1,
              m = !(0 == l.env("BLUEBIRD_DEBUG")),
              g = !(0 == l.env("BLUEBIRD_WARNINGS") || !m && !l.env("BLUEBIRD_WARNINGS")),
              b = !(0 == l.env("BLUEBIRD_LONG_STACK_TRACES") || !m && !l.env("BLUEBIRD_LONG_STACK_TRACES")),
              w = 0 != l.env("BLUEBIRD_W_FORGOTTEN_RETURN") && (g || !!l.env("BLUEBIRD_W_FORGOTTEN_RETURN"));
          r.prototype.suppressUnhandledRejections = function () {
            var t = this._target();

            t._bitField = -1048577 & t._bitField | 524288;
          }, r.prototype._ensurePossibleRejectionHandled = function () {
            if (0 == (524288 & this._bitField)) {
              this._setRejectionIsUnhandled();

              var t = this;
              setTimeout(function () {
                t._notifyUnhandledRejection();
              }, 1);
            }
          }, r.prototype._notifyUnhandledRejectionIsHandled = function () {
            q("rejectionHandled", i, void 0, this);
          }, r.prototype._setReturnedNonUndefined = function () {
            this._bitField = 268435456 | this._bitField;
          }, r.prototype._returnedNonUndefined = function () {
            return 0 != (268435456 & this._bitField);
          }, r.prototype._notifyUnhandledRejection = function () {
            if (this._isRejectionUnhandled()) {
              var t = this._settledValue();

              this._setUnhandledRejectionIsNotified(), q("unhandledRejection", o, t, this);
            }
          }, r.prototype._setUnhandledRejectionIsNotified = function () {
            this._bitField = 262144 | this._bitField;
          }, r.prototype._unsetUnhandledRejectionIsNotified = function () {
            this._bitField = -262145 & this._bitField;
          }, r.prototype._isUnhandledRejectionNotified = function () {
            return (262144 & this._bitField) > 0;
          }, r.prototype._setRejectionIsUnhandled = function () {
            this._bitField = 1048576 | this._bitField;
          }, r.prototype._unsetRejectionIsUnhandled = function () {
            this._bitField = -1048577 & this._bitField, this._isUnhandledRejectionNotified() && (this._unsetUnhandledRejectionIsNotified(), this._notifyUnhandledRejectionIsHandled());
          }, r.prototype._isRejectionUnhandled = function () {
            return (1048576 & this._bitField) > 0;
          }, r.prototype._warn = function (t, e, r) {
            return U(t, e, r || this);
          }, r.onPossiblyUnhandledRejection = function (t) {
            var e = a();
            o = "function" == typeof t ? null === e ? t : l.domainBind(e, t) : void 0;
          }, r.onUnhandledRejectionHandled = function (t) {
            var e = a();
            i = "function" == typeof t ? null === e ? t : l.domainBind(e, t) : void 0;
          };

          var E = function () {};

          r.longStackTraces = function () {
            if (u.haveItemsQueued() && !J.longStackTraces) throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");

            if (!J.longStackTraces && Y()) {
              var t = r.prototype._captureStackTrace,
                  e = r.prototype._attachExtraTrace;
              J.longStackTraces = !0, E = function () {
                if (u.haveItemsQueued() && !J.longStackTraces) throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
                r.prototype._captureStackTrace = t, r.prototype._attachExtraTrace = e, n.deactivateLongStackTraces(), u.enableTrampoline(), J.longStackTraces = !1;
              }, r.prototype._captureStackTrace = D, r.prototype._attachExtraTrace = I, n.activateLongStackTraces(), u.disableTrampolineIfNecessary();
            }
          }, r.hasLongStackTraces = function () {
            return J.longStackTraces && Y();
          };

          var C = function () {
            try {
              if ("function" == typeof CustomEvent) {
                var t = new CustomEvent("CustomEvent");
                return l.global.dispatchEvent(t), function (t, e) {
                  var r = new CustomEvent(t.toLowerCase(), {
                    detail: e,
                    cancelable: !0
                  });
                  return !l.global.dispatchEvent(r);
                };
              }

              return "function" == typeof Event ? (t = new Event("CustomEvent"), l.global.dispatchEvent(t), function (t, e) {
                var r = new Event(t.toLowerCase(), {
                  cancelable: !0
                });
                return r.detail = e, !l.global.dispatchEvent(r);
              }) : ((t = document.createEvent("CustomEvent")).initCustomEvent("testingtheevent", !1, !0, {}), l.global.dispatchEvent(t), function (t, e) {
                var r = document.createEvent("CustomEvent");
                return r.initCustomEvent(t.toLowerCase(), !1, !0, e), !l.global.dispatchEvent(r);
              });
            } catch (t) {}

            return function () {
              return !1;
            };
          }(),
              x = l.isNode ? function () {
            return e.emit.apply(e, arguments);
          } : l.global ? function (t) {
            var e = "on" + t.toLowerCase(),
                r = l.global[e];
            return !!r && (r.apply(l.global, [].slice.call(arguments, 1)), !0);
          } : function () {
            return !1;
          };

          function j(t, e) {
            return {
              promise: e
            };
          }

          var S = {
            promiseCreated: j,
            promiseFulfilled: j,
            promiseRejected: j,
            promiseResolved: j,
            promiseCancelled: j,
            promiseChained: function (t, e, r) {
              return {
                promise: e,
                child: r
              };
            },
            warning: function (t, e) {
              return {
                warning: e
              };
            },
            unhandledRejection: function (t, e, r) {
              return {
                reason: e,
                promise: r
              };
            },
            rejectionHandled: j
          },
              R = function (t) {
            var e = !1;

            try {
              e = x.apply(null, arguments);
            } catch (t) {
              u.throwLater(t), e = !0;
            }

            var r = !1;

            try {
              r = C(t, S[t].apply(null, arguments));
            } catch (t) {
              u.throwLater(t), r = !0;
            }

            return r || e;
          };

          function k() {
            return !1;
          }

          function T(t, e, r) {
            var n = this;

            try {
              t(e, r, function (t) {
                if ("function" != typeof t) throw new TypeError("onCancel must be a function, got: " + l.toString(t));

                n._attachCancellationCallback(t);
              });
            } catch (t) {
              return t;
            }
          }

          function P(t) {
            if (!this._isCancellable()) return this;

            var e = this._onCancel();

            void 0 !== e ? l.isArray(e) ? e.push(t) : this._setOnCancel([e, t]) : this._setOnCancel(t);
          }

          function O() {
            return this._onCancelField;
          }

          function A(t) {
            this._onCancelField = t;
          }

          function F() {
            this._cancellationParent = void 0, this._onCancelField = void 0;
          }

          function L(t, e) {
            if (0 != (1 & e)) {
              this._cancellationParent = t;
              var r = t._branchesRemainingToCancel;
              void 0 === r && (r = 0), t._branchesRemainingToCancel = r + 1;
            }

            0 != (2 & e) && t._isBound() && this._setBoundTo(t._boundTo);
          }

          r.config = function (t) {
            if ("longStackTraces" in (t = Object(t)) && (t.longStackTraces ? r.longStackTraces() : !t.longStackTraces && r.hasLongStackTraces() && E()), "warnings" in t) {
              var e = t.warnings;
              J.warnings = !!e, w = J.warnings, l.isObject(e) && "wForgottenReturn" in e && (w = !!e.wForgottenReturn);
            }

            if ("cancellation" in t && t.cancellation && !J.cancellation) {
              if (u.haveItemsQueued()) throw new Error("cannot enable cancellation after promises are in use");
              r.prototype._clearCancellationData = F, r.prototype._propagateFrom = L, r.prototype._onCancel = O, r.prototype._setOnCancel = A, r.prototype._attachCancellationCallback = P, r.prototype._execute = T, M = L, J.cancellation = !0;
            }

            return "monitoring" in t && (t.monitoring && !J.monitoring ? (J.monitoring = !0, r.prototype._fireEvent = R) : !t.monitoring && J.monitoring && (J.monitoring = !1, r.prototype._fireEvent = k)), r;
          }, r.prototype._fireEvent = k, r.prototype._execute = function (t, e, r) {
            try {
              t(e, r);
            } catch (t) {
              return t;
            }
          }, r.prototype._onCancel = function () {}, r.prototype._setOnCancel = function (t) {}, r.prototype._attachCancellationCallback = function (t) {}, r.prototype._captureStackTrace = function () {}, r.prototype._attachExtraTrace = function () {}, r.prototype._clearCancellationData = function () {}, r.prototype._propagateFrom = function (t, e) {};

          var M = function (t, e) {
            0 != (2 & e) && t._isBound() && this._setBoundTo(t._boundTo);
          };

          function B() {
            var t = this._boundTo;
            return void 0 !== t && t instanceof r ? t.isFulfilled() ? t.value() : void 0 : t;
          }

          function D() {
            this._trace = new X(this._peekContext());
          }

          function I(t, e) {
            if (f(t)) {
              var r = this._trace;
              if (void 0 !== r && e && (r = r._parent), void 0 !== r) r.attachExtraTrace(t);else if (!t.__stackCleaned__) {
                var n = H(t);
                l.notEnumerableProp(t, "stack", n.message + "\n" + n.stack.join("\n")), l.notEnumerableProp(t, "__stackCleaned__", !0);
              }
            }
          }

          function U(t, e, n) {
            if (J.warnings) {
              var i,
                  o = new c(t);
              if (e) n._attachExtraTrace(o);else if (J.longStackTraces && (i = r._peekContext())) i.attachExtraTrace(o);else {
                var s = H(o);
                o.stack = s.message + "\n" + s.stack.join("\n");
              }
              R("warning", o) || V(o, "", !0);
            }
          }

          function N(t) {
            for (var e = [], r = 0; r < t.length; ++r) {
              var n = t[r],
                  i = "    (No stack trace)" === n || _.test(n),
                  o = i && $(n);

              i && !o && (y && " " !== n.charAt(0) && (n = "    " + n), e.push(n));
            }

            return e;
          }

          function H(t) {
            var e = t.stack,
                r = t.toString();
            return e = "string" == typeof e && e.length > 0 ? function (t) {
              for (var e = t.stack.replace(/\s+$/g, "").split("\n"), r = 0; r < e.length; ++r) {
                var n = e[r];
                if ("    (No stack trace)" === n || _.test(n)) break;
              }

              return r > 0 && "SyntaxError" != t.name && (e = e.slice(r)), e;
            }(t) : ["    (No stack trace)"], {
              message: r,
              stack: "SyntaxError" == t.name ? e : N(e)
            };
          }

          function V(t, e, r) {
            if ("undefined" != typeof console) {
              var n;

              if (l.isObject(t)) {
                var i = t.stack;
                n = e + v(i, t);
              } else n = e + String(t);

              "function" == typeof s ? s(n, r) : "function" != typeof console.log && "object" != _typeof(console.log) || console.log(n);
            }
          }

          function q(t, e, r, n) {
            var i = !1;

            try {
              "function" == typeof e && (i = !0, "rejectionHandled" === t ? e(n) : e(r, n));
            } catch (t) {
              u.throwLater(t);
            }

            "unhandledRejection" === t ? R(t, r, n) || i || V(r, "Unhandled rejection ") : R(t, n);
          }

          function W(t) {
            var e;
            if ("function" == typeof t) e = "[function " + (t.name || "anonymous") + "]";else {
              if (e = t && "function" == typeof t.toString ? t.toString() : l.toString(t), /\[object [a-zA-Z0-9$_]+\]/.test(e)) try {
                e = JSON.stringify(t);
              } catch (t) {}
              0 === e.length && (e = "(empty array)");
            }
            return "(<" + function (t) {
              return t.length < 41 ? t : t.substr(0, 38) + "...";
            }(e) + ">, no stack trace)";
          }

          function Y() {
            return "function" == typeof G;
          }

          var $ = function () {
            return !1;
          },
              z = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;

          function Q(t) {
            var e = t.match(z);
            if (e) return {
              fileName: e[1],
              line: parseInt(e[2], 10)
            };
          }

          function X(t) {
            this._parent = t, this._promisesCreated = 0;
            var e = this._length = 1 + (void 0 === t ? 0 : t._length);
            G(this, X), e > 32 && this.uncycle();
          }

          l.inherits(X, Error), n.CapturedTrace = X, X.prototype.uncycle = function () {
            var t = this._length;

            if (!(t < 2)) {
              for (var e = [], r = {}, n = 0, i = this; void 0 !== i; ++n) e.push(i), i = i._parent;

              for (n = (t = this._length = n) - 1; n >= 0; --n) {
                var o = e[n].stack;
                void 0 === r[o] && (r[o] = n);
              }

              for (n = 0; n < t; ++n) {
                var s = r[e[n].stack];

                if (void 0 !== s && s !== n) {
                  s > 0 && (e[s - 1]._parent = void 0, e[s - 1]._length = 1), e[n]._parent = void 0, e[n]._length = 1;
                  var a = n > 0 ? e[n - 1] : this;
                  s < t - 1 ? (a._parent = e[s + 1], a._parent.uncycle(), a._length = a._parent._length + 1) : (a._parent = void 0, a._length = 1);

                  for (var u = a._length + 1, c = n - 2; c >= 0; --c) e[c]._length = u, u++;

                  return;
                }
              }
            }
          }, X.prototype.attachExtraTrace = function (t) {
            if (!t.__stackCleaned__) {
              this.uncycle();

              for (var e = H(t), r = e.message, n = [e.stack], i = this; void 0 !== i;) n.push(N(i.stack.split("\n"))), i = i._parent;

              !function (t) {
                for (var e = t[0], r = 1; r < t.length; ++r) {
                  for (var n = t[r], i = e.length - 1, o = e[i], s = -1, a = n.length - 1; a >= 0; --a) if (n[a] === o) {
                    s = a;
                    break;
                  }

                  for (a = s; a >= 0; --a) {
                    var u = n[a];
                    if (e[i] !== u) break;
                    e.pop(), i--;
                  }

                  e = n;
                }
              }(n), function (t) {
                for (var e = 0; e < t.length; ++e) (0 === t[e].length || e + 1 < t.length && t[e][0] === t[e + 1][0]) && (t.splice(e, 1), e--);
              }(n), l.notEnumerableProp(t, "stack", function (t, e) {
                for (var r = 0; r < e.length - 1; ++r) e[r].push("From previous event:"), e[r] = e[r].join("\n");

                return r < e.length && (e[r] = e[r].join("\n")), t + "\n" + e.join("\n");
              }(r, n)), l.notEnumerableProp(t, "__stackCleaned__", !0);
            }
          };

          var G = function () {
            var t = /^\s*at\s*/,
                e = function (t, e) {
              return "string" == typeof t ? t : void 0 !== e.name && void 0 !== e.message ? e.toString() : W(e);
            };

            if ("number" == typeof Error.stackTraceLimit && "function" == typeof Error.captureStackTrace) {
              Error.stackTraceLimit += 6, _ = t, v = e;
              var r = Error.captureStackTrace;
              return $ = function (t) {
                return h.test(t);
              }, function (t, e) {
                Error.stackTraceLimit += 6, r(t, e), Error.stackTraceLimit -= 6;
              };
            }

            var n,
                i = new Error();
            if ("string" == typeof i.stack && i.stack.split("\n")[0].indexOf("stackDetection@") >= 0) return _ = /@/, v = e, y = !0, function (t) {
              t.stack = new Error().stack;
            };

            try {
              throw new Error();
            } catch (t) {
              n = "stack" in t;
            }

            return "stack" in i || !n || "number" != typeof Error.stackTraceLimit ? (v = function (t, e) {
              return "string" == typeof t ? t : "object" != _typeof(e) && "function" != typeof e || void 0 === e.name || void 0 === e.message ? W(e) : e.toString();
            }, null) : (_ = t, v = e, function (t) {
              Error.stackTraceLimit += 6;

              try {
                throw new Error();
              } catch (e) {
                t.stack = e.stack;
              }

              Error.stackTraceLimit -= 6;
            });
          }();

          "undefined" != typeof console && void 0 !== console.warn && (s = function (t) {
            console.warn(t);
          }, l.isNode && e.stderr.isTTY ? s = function (t, e) {
            var r = e ? "[33m" : "[31m";
            console.warn(r + t + "[0m\n");
          } : l.isNode || "string" != typeof new Error().stack || (s = function (t, e) {
            console.warn("%c" + t, e ? "color: darkorange" : "color: red");
          }));
          var J = {
            warnings: g,
            longStackTraces: !1,
            cancellation: !1,
            monitoring: !1
          };
          return b && r.longStackTraces(), {
            longStackTraces: function () {
              return J.longStackTraces;
            },
            warnings: function () {
              return J.warnings;
            },
            cancellation: function () {
              return J.cancellation;
            },
            monitoring: function () {
              return J.monitoring;
            },
            propagateFromFunction: function () {
              return M;
            },
            boundValueFunction: function () {
              return B;
            },
            checkForgottenReturns: function (t, e, r, n, i) {
              if (void 0 === t && null !== e && w) {
                if (void 0 !== i && i._returnedNonUndefined()) return;
                if (0 == (65535 & n._bitField)) return;
                r && (r += " ");
                var o = "",
                    s = "";

                if (e._trace) {
                  for (var a = e._trace.stack.split("\n"), u = N(a), c = u.length - 1; c >= 0; --c) {
                    var l = u[c];

                    if (!p.test(l)) {
                      var f = l.match(d);
                      f && (o = "at " + f[1] + ":" + f[2] + ":" + f[3] + " ");
                      break;
                    }
                  }

                  if (u.length > 0) {
                    var h = u[0];

                    for (c = 0; c < a.length; ++c) if (a[c] === h) {
                      c > 0 && (s = "\n" + a[c - 1]);
                      break;
                    }
                  }
                }

                var _ = "a promise was created in a " + r + "handler " + o + "but was not returned from it, see http://goo.gl/rRqMUw" + s;

                n._warn(_, !0, e);
              }
            },
            setBounds: function (t, e) {
              if (Y()) {
                for (var r, n, i = t.stack.split("\n"), o = e.stack.split("\n"), s = -1, a = -1, u = 0; u < i.length; ++u) if (c = Q(i[u])) {
                  r = c.fileName, s = c.line;
                  break;
                }

                for (u = 0; u < o.length; ++u) {
                  var c;

                  if (c = Q(o[u])) {
                    n = c.fileName, a = c.line;
                    break;
                  }
                }

                s < 0 || a < 0 || !r || !n || r !== n || s >= a || ($ = function (t) {
                  if (h.test(t)) return !0;
                  var e = Q(t);
                  return !!(e && e.fileName === r && s <= e.line && e.line <= a);
                });
              }
            },
            warn: U,
            deprecated: function (t, e) {
              var r = t + " is deprecated and will be removed in a future version.";
              return e && (r += " Use " + e + " instead."), U(r);
            },
            CapturedTrace: X,
            fireDomEvent: C,
            fireGlobalEvent: x
          };
        };
      }, {
        "./errors": 12,
        "./util": 36
      }],
      10: [function (t, e, r) {
        "use strict";

        e.exports = function (t) {
          function e() {
            return this.value;
          }

          function r() {
            throw this.reason;
          }

          t.prototype.return = t.prototype.thenReturn = function (r) {
            return r instanceof t && r.suppressUnhandledRejections(), this._then(e, void 0, void 0, {
              value: r
            }, void 0);
          }, t.prototype.throw = t.prototype.thenThrow = function (t) {
            return this._then(r, void 0, void 0, {
              reason: t
            }, void 0);
          }, t.prototype.catchThrow = function (t) {
            if (arguments.length <= 1) return this._then(void 0, r, void 0, {
              reason: t
            }, void 0);
            var e = arguments[1];
            return this.caught(t, function () {
              throw e;
            });
          }, t.prototype.catchReturn = function (r) {
            if (arguments.length <= 1) return r instanceof t && r.suppressUnhandledRejections(), this._then(void 0, e, void 0, {
              value: r
            }, void 0);
            var n = arguments[1];
            return n instanceof t && n.suppressUnhandledRejections(), this.caught(r, function () {
              return n;
            });
          };
        };
      }, {}],
      11: [function (t, e, r) {
        "use strict";

        e.exports = function (t, e) {
          var r = t.reduce,
              n = t.all;

          function i() {
            return n(this);
          }

          t.prototype.each = function (t) {
            return r(this, t, e, 0)._then(i, void 0, void 0, this, void 0);
          }, t.prototype.mapSeries = function (t) {
            return r(this, t, e, e);
          }, t.each = function (t, n) {
            return r(t, n, e, 0)._then(i, void 0, void 0, t, void 0);
          }, t.mapSeries = function (t, n) {
            return r(t, n, e, e);
          };
        };
      }, {}],
      12: [function (t, e, r) {
        "use strict";

        var n,
            i,
            o = t("./es5"),
            s = o.freeze,
            a = t("./util"),
            u = a.inherits,
            c = a.notEnumerableProp;

        function l(t, e) {
          function r(n) {
            if (!(this instanceof r)) return new r(n);
            c(this, "message", "string" == typeof n ? n : e), c(this, "name", t), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : Error.call(this);
          }

          return u(r, Error), r;
        }

        var f = l("Warning", "warning"),
            h = l("CancellationError", "cancellation error"),
            p = l("TimeoutError", "timeout error"),
            d = l("AggregateError", "aggregate error");

        try {
          n = TypeError, i = RangeError;
        } catch (t) {
          n = l("TypeError", "type error"), i = l("RangeError", "range error");
        }

        for (var _ = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" "), v = 0; v < _.length; ++v) "function" == typeof Array.prototype[_[v]] && (d.prototype[_[v]] = Array.prototype[_[v]]);

        o.defineProperty(d.prototype, "length", {
          value: 0,
          configurable: !1,
          writable: !0,
          enumerable: !0
        }), d.prototype.isOperational = !0;
        var y = 0;

        function m(t) {
          if (!(this instanceof m)) return new m(t);
          c(this, "name", "OperationalError"), c(this, "message", t), this.cause = t, this.isOperational = !0, t instanceof Error ? (c(this, "message", t.message), c(this, "stack", t.stack)) : Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
        }

        d.prototype.toString = function () {
          var t = Array(4 * y + 1).join(" "),
              e = "\n" + t + "AggregateError of:\n";
          y++, t = Array(4 * y + 1).join(" ");

          for (var r = 0; r < this.length; ++r) {
            for (var n = this[r] === this ? "[Circular AggregateError]" : this[r] + "", i = n.split("\n"), o = 0; o < i.length; ++o) i[o] = t + i[o];

            e += (n = i.join("\n")) + "\n";
          }

          return y--, e;
        }, u(m, Error);
        var g = Error.__BluebirdErrorTypes__;
        g || (g = s({
          CancellationError: h,
          TimeoutError: p,
          OperationalError: m,
          RejectionError: m,
          AggregateError: d
        }), o.defineProperty(Error, "__BluebirdErrorTypes__", {
          value: g,
          writable: !1,
          enumerable: !1,
          configurable: !1
        })), e.exports = {
          Error: Error,
          TypeError: n,
          RangeError: i,
          CancellationError: g.CancellationError,
          OperationalError: g.OperationalError,
          TimeoutError: g.TimeoutError,
          AggregateError: g.AggregateError,
          Warning: f
        };
      }, {
        "./es5": 13,
        "./util": 36
      }],
      13: [function (t, e, r) {
        var n = function () {
          "use strict";

          return void 0 === this;
        }();

        if (n) e.exports = {
          freeze: Object.freeze,
          defineProperty: Object.defineProperty,
          getDescriptor: Object.getOwnPropertyDescriptor,
          keys: Object.keys,
          names: Object.getOwnPropertyNames,
          getPrototypeOf: Object.getPrototypeOf,
          isArray: Array.isArray,
          isES5: n,
          propertyIsWritable: function (t, e) {
            var r = Object.getOwnPropertyDescriptor(t, e);
            return !(r && !r.writable && !r.set);
          }
        };else {
          var i = {}.hasOwnProperty,
              o = {}.toString,
              s = {}.constructor.prototype,
              a = function (t) {
            var e = [];

            for (var r in t) i.call(t, r) && e.push(r);

            return e;
          };

          e.exports = {
            isArray: function (t) {
              try {
                return "[object Array]" === o.call(t);
              } catch (t) {
                return !1;
              }
            },
            keys: a,
            names: a,
            defineProperty: function (t, e, r) {
              return t[e] = r.value, t;
            },
            getDescriptor: function (t, e) {
              return {
                value: t[e]
              };
            },
            freeze: function (t) {
              return t;
            },
            getPrototypeOf: function (t) {
              try {
                return Object(t).constructor.prototype;
              } catch (t) {
                return s;
              }
            },
            isES5: n,
            propertyIsWritable: function () {
              return !0;
            }
          };
        }
      }, {}],
      14: [function (t, e, r) {
        "use strict";

        e.exports = function (t, e) {
          var r = t.map;
          t.prototype.filter = function (t, n) {
            return r(this, t, n, e);
          }, t.filter = function (t, n, i) {
            return r(t, n, i, e);
          };
        };
      }, {}],
      15: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n) {
          var i = t("./util"),
              o = e.CancellationError,
              s = i.errorObj,
              a = t("./catch_filter")(n);

          function u(t, e, r) {
            this.promise = t, this.type = e, this.handler = r, this.called = !1, this.cancelPromise = null;
          }

          function c(t) {
            this.finallyHandler = t;
          }

          function l(t, e) {
            return null != t.cancelPromise && (arguments.length > 1 ? t.cancelPromise._reject(e) : t.cancelPromise._cancel(), t.cancelPromise = null, !0);
          }

          function f() {
            return p.call(this, this.promise._target()._settledValue());
          }

          function h(t) {
            if (!l(this, t)) return s.e = t, s;
          }

          function p(t) {
            var i = this.promise,
                a = this.handler;

            if (!this.called) {
              this.called = !0;
              var u = this.isFinallyHandler() ? a.call(i._boundValue()) : a.call(i._boundValue(), t);
              if (u === n) return u;

              if (void 0 !== u) {
                i._setReturnedNonUndefined();

                var p = r(u, i);

                if (p instanceof e) {
                  if (null != this.cancelPromise) {
                    if (p._isCancelled()) {
                      var d = new o("late cancellation observer");
                      return i._attachExtraTrace(d), s.e = d, s;
                    }

                    p.isPending() && p._attachCancellationCallback(new c(this));
                  }

                  return p._then(f, h, void 0, this, void 0);
                }
              }
            }

            return i.isRejected() ? (l(this), s.e = t, s) : (l(this), t);
          }

          return u.prototype.isFinallyHandler = function () {
            return 0 === this.type;
          }, c.prototype._resultCancelled = function () {
            l(this.finallyHandler);
          }, e.prototype._passThrough = function (t, e, r, n) {
            return "function" != typeof t ? this.then() : this._then(r, n, void 0, new u(this, e, t), void 0);
          }, e.prototype.lastly = e.prototype.finally = function (t) {
            return this._passThrough(t, 0, p, p);
          }, e.prototype.tap = function (t) {
            return this._passThrough(t, 1, p);
          }, e.prototype.tapCatch = function (t) {
            var r = arguments.length;
            if (1 === r) return this._passThrough(t, 1, void 0, p);
            var n,
                o = new Array(r - 1),
                s = 0;

            for (n = 0; n < r - 1; ++n) {
              var u = arguments[n];
              if (!i.isObject(u)) return e.reject(new TypeError("tapCatch statement predicate: expecting an object but got " + i.classString(u)));
              o[s++] = u;
            }

            o.length = s;
            var c = arguments[n];
            return this._passThrough(a(o, c, this), 1, void 0, p);
          }, u;
        };
      }, {
        "./catch_filter": 7,
        "./util": 36
      }],
      16: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n, i, o, s) {
          var a = t("./errors").TypeError,
              u = t("./util"),
              c = u.errorObj,
              l = u.tryCatch,
              f = [];

          function h(t, r, i, o) {
            if (s.cancellation()) {
              var a = new e(n),
                  u = this._finallyPromise = new e(n);
              this._promise = a.lastly(function () {
                return u;
              }), a._captureStackTrace(), a._setOnCancel(this);
            } else (this._promise = new e(n))._captureStackTrace();

            this._stack = o, this._generatorFunction = t, this._receiver = r, this._generator = void 0, this._yieldHandlers = "function" == typeof i ? [i].concat(f) : f, this._yieldedPromise = null, this._cancellationPhase = !1;
          }

          u.inherits(h, o), h.prototype._isResolved = function () {
            return null === this._promise;
          }, h.prototype._cleanup = function () {
            this._promise = this._generator = null, s.cancellation() && null !== this._finallyPromise && (this._finallyPromise._fulfill(), this._finallyPromise = null);
          }, h.prototype._promiseCancelled = function () {
            if (!this._isResolved()) {
              var t;
              if (void 0 !== this._generator.return) this._promise._pushContext(), t = l(this._generator.return).call(this._generator, void 0), this._promise._popContext();else {
                var r = new e.CancellationError("generator .return() sentinel");
                e.coroutine.returnSentinel = r, this._promise._attachExtraTrace(r), this._promise._pushContext(), t = l(this._generator.throw).call(this._generator, r), this._promise._popContext();
              }
              this._cancellationPhase = !0, this._yieldedPromise = null, this._continue(t);
            }
          }, h.prototype._promiseFulfilled = function (t) {
            this._yieldedPromise = null, this._promise._pushContext();
            var e = l(this._generator.next).call(this._generator, t);
            this._promise._popContext(), this._continue(e);
          }, h.prototype._promiseRejected = function (t) {
            this._yieldedPromise = null, this._promise._attachExtraTrace(t), this._promise._pushContext();
            var e = l(this._generator.throw).call(this._generator, t);
            this._promise._popContext(), this._continue(e);
          }, h.prototype._resultCancelled = function () {
            if (this._yieldedPromise instanceof e) {
              var t = this._yieldedPromise;
              this._yieldedPromise = null, t.cancel();
            }
          }, h.prototype.promise = function () {
            return this._promise;
          }, h.prototype._run = function () {
            this._generator = this._generatorFunction.call(this._receiver), this._receiver = this._generatorFunction = void 0, this._promiseFulfilled(void 0);
          }, h.prototype._continue = function (t) {
            var r = this._promise;
            if (t === c) return this._cleanup(), this._cancellationPhase ? r.cancel() : r._rejectCallback(t.e, !1);
            var n = t.value;
            if (!0 === t.done) return this._cleanup(), this._cancellationPhase ? r.cancel() : r._resolveCallback(n);
            var o = i(n, this._promise);

            if (o instanceof e || null !== (o = function (t, r, n) {
              for (var o = 0; o < r.length; ++o) {
                n._pushContext();

                var s = l(r[o])(t);

                if (n._popContext(), s === c) {
                  n._pushContext();

                  var a = e.reject(c.e);
                  return n._popContext(), a;
                }

                var u = i(s, n);
                if (u instanceof e) return u;
              }

              return null;
            }(o, this._yieldHandlers, this._promise))) {
              var s = (o = o._target())._bitField;

              0 == (50397184 & s) ? (this._yieldedPromise = o, o._proxy(this, null)) : 0 != (33554432 & s) ? e._async.invoke(this._promiseFulfilled, this, o._value()) : 0 != (16777216 & s) ? e._async.invoke(this._promiseRejected, this, o._reason()) : this._promiseCancelled();
            } else this._promiseRejected(new a("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", String(n)) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));
          }, e.coroutine = function (t, e) {
            if ("function" != typeof t) throw new a("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
            var r = Object(e).yieldHandler,
                n = h,
                i = new Error().stack;
            return function () {
              var e = t.apply(this, arguments),
                  o = new n(void 0, void 0, r, i),
                  s = o.promise();
              return o._generator = e, o._promiseFulfilled(void 0), s;
            };
          }, e.coroutine.addYieldHandler = function (t) {
            if ("function" != typeof t) throw new a("expecting a function but got " + u.classString(t));
            f.push(t);
          }, e.spawn = function (t) {
            if (s.deprecated("Promise.spawn()", "Promise.coroutine()"), "function" != typeof t) return r("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
            var n = new h(t, this),
                i = n.promise();
            return n._run(e.spawn), i;
          };
        };
      }, {
        "./errors": 12,
        "./util": 36
      }],
      17: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n, i, o, s) {
          var a = t("./util");
          a.canEvaluate, a.tryCatch, a.errorObj, e.join = function () {
            var t,
                e = arguments.length - 1;
            e > 0 && "function" == typeof arguments[e] && (t = arguments[e]);
            var n = [].slice.call(arguments);
            t && n.pop();
            var i = new r(n).promise();
            return void 0 !== t ? i.spread(t) : i;
          };
        };
      }, {
        "./util": 36
      }],
      18: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n, i, o, s) {
          var a = e._getDomain,
              u = t("./util"),
              c = u.tryCatch,
              l = u.errorObj,
              f = e._async;

          function h(t, e, r, n) {
            this.constructor$(t), this._promise._captureStackTrace();
            var i = a();
            this._callback = null === i ? e : u.domainBind(i, e), this._preservedValues = n === o ? new Array(this.length()) : null, this._limit = r, this._inFlight = 0, this._queue = [], f.invoke(this._asyncInit, this, void 0);
          }

          function p(t, r, i, o) {
            if ("function" != typeof r) return n("expecting a function but got " + u.classString(r));
            var s = 0;

            if (void 0 !== i) {
              if ("object" != _typeof(i) || null === i) return e.reject(new TypeError("options argument must be an object but it is " + u.classString(i)));
              if ("number" != typeof i.concurrency) return e.reject(new TypeError("'concurrency' must be a number but it is " + u.classString(i.concurrency)));
              s = i.concurrency;
            }

            return new h(t, r, s = "number" == typeof s && isFinite(s) && s >= 1 ? s : 0, o).promise();
          }

          u.inherits(h, r), h.prototype._asyncInit = function () {
            this._init$(void 0, -2);
          }, h.prototype._init = function () {}, h.prototype._promiseFulfilled = function (t, r) {
            var n = this._values,
                o = this.length(),
                a = this._preservedValues,
                u = this._limit;

            if (r < 0) {
              if (n[r = -1 * r - 1] = t, u >= 1 && (this._inFlight--, this._drainQueue(), this._isResolved())) return !0;
            } else {
              if (u >= 1 && this._inFlight >= u) return n[r] = t, this._queue.push(r), !1;
              null !== a && (a[r] = t);

              var f = this._promise,
                  h = this._callback,
                  p = f._boundValue();

              f._pushContext();

              var d = c(h).call(p, t, r, o),
                  _ = f._popContext();

              if (s.checkForgottenReturns(d, _, null !== a ? "Promise.filter" : "Promise.map", f), d === l) return this._reject(d.e), !0;
              var v = i(d, this._promise);

              if (v instanceof e) {
                var y = (v = v._target())._bitField;

                if (0 == (50397184 & y)) return u >= 1 && this._inFlight++, n[r] = v, v._proxy(this, -1 * (r + 1)), !1;
                if (0 == (33554432 & y)) return 0 != (16777216 & y) ? (this._reject(v._reason()), !0) : (this._cancel(), !0);
                d = v._value();
              }

              n[r] = d;
            }

            return ++this._totalResolved >= o && (null !== a ? this._filter(n, a) : this._resolve(n), !0);
          }, h.prototype._drainQueue = function () {
            for (var t = this._queue, e = this._limit, r = this._values; t.length > 0 && this._inFlight < e;) {
              if (this._isResolved()) return;
              var n = t.pop();

              this._promiseFulfilled(r[n], n);
            }
          }, h.prototype._filter = function (t, e) {
            for (var r = e.length, n = new Array(r), i = 0, o = 0; o < r; ++o) t[o] && (n[i++] = e[o]);

            n.length = i, this._resolve(n);
          }, h.prototype.preservedValues = function () {
            return this._preservedValues;
          }, e.prototype.map = function (t, e) {
            return p(this, t, e, null);
          }, e.map = function (t, e, r, n) {
            return p(t, e, r, n);
          };
        };
      }, {
        "./util": 36
      }],
      19: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n, i, o) {
          var s = t("./util"),
              a = s.tryCatch;
          e.method = function (t) {
            if ("function" != typeof t) throw new e.TypeError("expecting a function but got " + s.classString(t));
            return function () {
              var n = new e(r);
              n._captureStackTrace(), n._pushContext();

              var i = a(t).apply(this, arguments),
                  s = n._popContext();

              return o.checkForgottenReturns(i, s, "Promise.method", n), n._resolveFromSyncValue(i), n;
            };
          }, e.attempt = e.try = function (t) {
            if ("function" != typeof t) return i("expecting a function but got " + s.classString(t));
            var n,
                u = new e(r);

            if (u._captureStackTrace(), u._pushContext(), arguments.length > 1) {
              o.deprecated("calling Promise.try with more than 1 argument");
              var c = arguments[1],
                  l = arguments[2];
              n = s.isArray(c) ? a(t).apply(l, c) : a(t).call(l, c);
            } else n = a(t)();

            var f = u._popContext();

            return o.checkForgottenReturns(n, f, "Promise.try", u), u._resolveFromSyncValue(n), u;
          }, e.prototype._resolveFromSyncValue = function (t) {
            t === s.errorObj ? this._rejectCallback(t.e, !1) : this._resolveCallback(t, !0);
          };
        };
      }, {
        "./util": 36
      }],
      20: [function (t, e, r) {
        "use strict";

        var n = t("./util"),
            i = n.maybeWrapAsError,
            o = t("./errors").OperationalError,
            s = t("./es5"),
            a = /^(?:name|message|stack|cause)$/;

        function u(t) {
          var e;

          if (function (t) {
            return t instanceof Error && s.getPrototypeOf(t) === Error.prototype;
          }(t)) {
            (e = new o(t)).name = t.name, e.message = t.message, e.stack = t.stack;

            for (var r = s.keys(t), i = 0; i < r.length; ++i) {
              var u = r[i];
              a.test(u) || (e[u] = t[u]);
            }

            return e;
          }

          return n.markAsOriginatingFromRejection(t), t;
        }

        e.exports = function (t, e) {
          return function (r, n) {
            if (null !== t) {
              if (r) {
                var o = u(i(r));
                t._attachExtraTrace(o), t._reject(o);
              } else if (e) {
                var s = [].slice.call(arguments, 1);

                t._fulfill(s);
              } else t._fulfill(n);

              t = null;
            }
          };
        };
      }, {
        "./errors": 12,
        "./es5": 13,
        "./util": 36
      }],
      21: [function (t, e, r) {
        "use strict";

        e.exports = function (e) {
          var r = t("./util"),
              n = e._async,
              i = r.tryCatch,
              o = r.errorObj;

          function s(t, e) {
            if (!r.isArray(t)) return a.call(this, t, e);
            var s = i(e).apply(this._boundValue(), [null].concat(t));
            s === o && n.throwLater(s.e);
          }

          function a(t, e) {
            var r = this._boundValue(),
                s = void 0 === t ? i(e).call(r, null) : i(e).call(r, null, t);

            s === o && n.throwLater(s.e);
          }

          function u(t, e) {
            if (!t) {
              var r = new Error(t + "");
              r.cause = t, t = r;
            }

            var s = i(e).call(this._boundValue(), t);
            s === o && n.throwLater(s.e);
          }

          e.prototype.asCallback = e.prototype.nodeify = function (t, e) {
            if ("function" == typeof t) {
              var r = a;
              void 0 !== e && Object(e).spread && (r = s), this._then(r, u, void 0, this, t);
            }

            return this;
          };
        };
      }, {
        "./util": 36
      }],
      22: [function (t, r, n) {
        "use strict";

        r.exports = function () {
          var n = function () {
            return new d("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
          },
              i = function () {
            return new T.PromiseInspection(this._target());
          },
              o = function (t) {
            return T.reject(new d(t));
          };

          function s() {}

          var a,
              u = {},
              c = t("./util");
          a = c.isNode ? function () {
            var t = e.domain;
            return void 0 === t && (t = null), t;
          } : function () {
            return null;
          }, c.notEnumerableProp(T, "_getDomain", a);
          var l = t("./es5"),
              f = t("./async"),
              h = new f();
          l.defineProperty(T, "_async", {
            value: h
          });
          var p = t("./errors"),
              d = T.TypeError = p.TypeError;
          T.RangeError = p.RangeError;

          var _ = T.CancellationError = p.CancellationError;

          T.TimeoutError = p.TimeoutError, T.OperationalError = p.OperationalError, T.RejectionError = p.OperationalError, T.AggregateError = p.AggregateError;

          var v = function () {},
              y = {},
              m = {},
              g = t("./thenables")(T, v),
              b = t("./promise_array")(T, v, g, o, s),
              w = t("./context")(T),
              E = w.create,
              C = t("./debuggability")(T, w),
              x = (C.CapturedTrace, t("./finally")(T, g, m)),
              j = t("./catch_filter")(m),
              S = t("./nodeback"),
              R = c.errorObj,
              k = c.tryCatch;

          function T(t) {
            t !== v && function (t, e) {
              if (null == t || t.constructor !== T) throw new d("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
              if ("function" != typeof e) throw new d("expecting a function but got " + c.classString(e));
            }(this, t), this._bitField = 0, this._fulfillmentHandler0 = void 0, this._rejectionHandler0 = void 0, this._promise0 = void 0, this._receiver0 = void 0, this._resolveFromExecutor(t), this._promiseCreated(), this._fireEvent("promiseCreated", this);
          }

          function P(t) {
            this.promise._resolveCallback(t);
          }

          function O(t) {
            this.promise._rejectCallback(t, !1);
          }

          function A(t) {
            var e = new T(v);
            e._fulfillmentHandler0 = t, e._rejectionHandler0 = t, e._promise0 = t, e._receiver0 = t;
          }

          return T.prototype.toString = function () {
            return "[object Promise]";
          }, T.prototype.caught = T.prototype.catch = function (t) {
            var e = arguments.length;

            if (e > 1) {
              var r,
                  n = new Array(e - 1),
                  i = 0;

              for (r = 0; r < e - 1; ++r) {
                var s = arguments[r];
                if (!c.isObject(s)) return o("Catch statement predicate: expecting an object but got " + c.classString(s));
                n[i++] = s;
              }

              return n.length = i, t = arguments[r], this.then(void 0, j(n, t, this));
            }

            return this.then(void 0, t);
          }, T.prototype.reflect = function () {
            return this._then(i, i, void 0, this, void 0);
          }, T.prototype.then = function (t, e) {
            if (C.warnings() && arguments.length > 0 && "function" != typeof t && "function" != typeof e) {
              var r = ".then() only accepts functions but was passed: " + c.classString(t);
              arguments.length > 1 && (r += ", " + c.classString(e)), this._warn(r);
            }

            return this._then(t, e, void 0, void 0, void 0);
          }, T.prototype.done = function (t, e) {
            this._then(t, e, void 0, void 0, void 0)._setIsFinal();
          }, T.prototype.spread = function (t) {
            return "function" != typeof t ? o("expecting a function but got " + c.classString(t)) : this.all()._then(t, void 0, void 0, y, void 0);
          }, T.prototype.toJSON = function () {
            var t = {
              isFulfilled: !1,
              isRejected: !1,
              fulfillmentValue: void 0,
              rejectionReason: void 0
            };
            return this.isFulfilled() ? (t.fulfillmentValue = this.value(), t.isFulfilled = !0) : this.isRejected() && (t.rejectionReason = this.reason(), t.isRejected = !0), t;
          }, T.prototype.all = function () {
            return arguments.length > 0 && this._warn(".all() was passed arguments but it does not take any"), new b(this).promise();
          }, T.prototype.error = function (t) {
            return this.caught(c.originatesFromRejection, t);
          }, T.getNewLibraryCopy = r.exports, T.is = function (t) {
            return t instanceof T;
          }, T.fromNode = T.fromCallback = function (t) {
            var e = new T(v);

            e._captureStackTrace();

            var r = arguments.length > 1 && !!Object(arguments[1]).multiArgs,
                n = k(t)(S(e, r));
            return n === R && e._rejectCallback(n.e, !0), e._isFateSealed() || e._setAsyncGuaranteed(), e;
          }, T.all = function (t) {
            return new b(t).promise();
          }, T.cast = function (t) {
            var e = g(t);
            return e instanceof T || ((e = new T(v))._captureStackTrace(), e._setFulfilled(), e._rejectionHandler0 = t), e;
          }, T.resolve = T.fulfilled = T.cast, T.reject = T.rejected = function (t) {
            var e = new T(v);
            return e._captureStackTrace(), e._rejectCallback(t, !0), e;
          }, T.setScheduler = function (t) {
            if ("function" != typeof t) throw new d("expecting a function but got " + c.classString(t));
            return h.setScheduler(t);
          }, T.prototype._then = function (t, e, r, n, i) {
            var o = void 0 !== i,
                s = o ? i : new T(v),
                u = this._target(),
                l = u._bitField;

            o || (s._propagateFrom(this, 3), s._captureStackTrace(), void 0 === n && 0 != (2097152 & this._bitField) && (n = 0 != (50397184 & l) ? this._boundValue() : u === this ? void 0 : this._boundTo), this._fireEvent("promiseChained", this, s));
            var f = a();

            if (0 != (50397184 & l)) {
              var p,
                  d,
                  y = u._settlePromiseCtx;
              0 != (33554432 & l) ? (d = u._rejectionHandler0, p = t) : 0 != (16777216 & l) ? (d = u._fulfillmentHandler0, p = e, u._unsetRejectionIsUnhandled()) : (y = u._settlePromiseLateCancellationObserver, d = new _("late cancellation observer"), u._attachExtraTrace(d), p = e), h.invoke(y, u, {
                handler: null === f ? p : "function" == typeof p && c.domainBind(f, p),
                promise: s,
                receiver: n,
                value: d
              });
            } else u._addCallbacks(t, e, s, n, f);

            return s;
          }, T.prototype._length = function () {
            return 65535 & this._bitField;
          }, T.prototype._isFateSealed = function () {
            return 0 != (117506048 & this._bitField);
          }, T.prototype._isFollowing = function () {
            return 67108864 == (67108864 & this._bitField);
          }, T.prototype._setLength = function (t) {
            this._bitField = -65536 & this._bitField | 65535 & t;
          }, T.prototype._setFulfilled = function () {
            this._bitField = 33554432 | this._bitField, this._fireEvent("promiseFulfilled", this);
          }, T.prototype._setRejected = function () {
            this._bitField = 16777216 | this._bitField, this._fireEvent("promiseRejected", this);
          }, T.prototype._setFollowing = function () {
            this._bitField = 67108864 | this._bitField, this._fireEvent("promiseResolved", this);
          }, T.prototype._setIsFinal = function () {
            this._bitField = 4194304 | this._bitField;
          }, T.prototype._isFinal = function () {
            return (4194304 & this._bitField) > 0;
          }, T.prototype._unsetCancelled = function () {
            this._bitField = -65537 & this._bitField;
          }, T.prototype._setCancelled = function () {
            this._bitField = 65536 | this._bitField, this._fireEvent("promiseCancelled", this);
          }, T.prototype._setWillBeCancelled = function () {
            this._bitField = 8388608 | this._bitField;
          }, T.prototype._setAsyncGuaranteed = function () {
            h.hasCustomScheduler() || (this._bitField = 134217728 | this._bitField);
          }, T.prototype._receiverAt = function (t) {
            var e = 0 === t ? this._receiver0 : this[4 * t - 4 + 3];
            if (e !== u) return void 0 === e && this._isBound() ? this._boundValue() : e;
          }, T.prototype._promiseAt = function (t) {
            return this[4 * t - 4 + 2];
          }, T.prototype._fulfillmentHandlerAt = function (t) {
            return this[4 * t - 4 + 0];
          }, T.prototype._rejectionHandlerAt = function (t) {
            return this[4 * t - 4 + 1];
          }, T.prototype._boundValue = function () {}, T.prototype._migrateCallback0 = function (t) {
            t._bitField;

            var e = t._fulfillmentHandler0,
                r = t._rejectionHandler0,
                n = t._promise0,
                i = t._receiverAt(0);

            void 0 === i && (i = u), this._addCallbacks(e, r, n, i, null);
          }, T.prototype._migrateCallbackAt = function (t, e) {
            var r = t._fulfillmentHandlerAt(e),
                n = t._rejectionHandlerAt(e),
                i = t._promiseAt(e),
                o = t._receiverAt(e);

            void 0 === o && (o = u), this._addCallbacks(r, n, i, o, null);
          }, T.prototype._addCallbacks = function (t, e, r, n, i) {
            var o = this._length();

            if (o >= 65531 && (o = 0, this._setLength(0)), 0 === o) this._promise0 = r, this._receiver0 = n, "function" == typeof t && (this._fulfillmentHandler0 = null === i ? t : c.domainBind(i, t)), "function" == typeof e && (this._rejectionHandler0 = null === i ? e : c.domainBind(i, e));else {
              var s = 4 * o - 4;
              this[s + 2] = r, this[s + 3] = n, "function" == typeof t && (this[s + 0] = null === i ? t : c.domainBind(i, t)), "function" == typeof e && (this[s + 1] = null === i ? e : c.domainBind(i, e));
            }
            return this._setLength(o + 1), o;
          }, T.prototype._proxy = function (t, e) {
            this._addCallbacks(void 0, void 0, e, t, null);
          }, T.prototype._resolveCallback = function (t, e) {
            if (0 == (117506048 & this._bitField)) {
              if (t === this) return this._rejectCallback(n(), !1);
              var r = g(t, this);
              if (!(r instanceof T)) return this._fulfill(t);
              e && this._propagateFrom(r, 2);

              var i = r._target();

              if (i !== this) {
                var o = i._bitField;

                if (0 == (50397184 & o)) {
                  var s = this._length();

                  s > 0 && i._migrateCallback0(this);

                  for (var a = 1; a < s; ++a) i._migrateCallbackAt(this, a);

                  this._setFollowing(), this._setLength(0), this._setFollowee(i);
                } else if (0 != (33554432 & o)) this._fulfill(i._value());else if (0 != (16777216 & o)) this._reject(i._reason());else {
                  var u = new _("late cancellation observer");
                  i._attachExtraTrace(u), this._reject(u);
                }
              } else this._reject(n());
            }
          }, T.prototype._rejectCallback = function (t, e, r) {
            var n = c.ensureErrorObject(t),
                i = n === t;

            if (!i && !r && C.warnings()) {
              var o = "a promise was rejected with a non-error: " + c.classString(t);

              this._warn(o, !0);
            }

            this._attachExtraTrace(n, !!e && i), this._reject(t);
          }, T.prototype._resolveFromExecutor = function (t) {
            if (t !== v) {
              var e = this;
              this._captureStackTrace(), this._pushContext();

              var r = !0,
                  n = this._execute(t, function (t) {
                e._resolveCallback(t);
              }, function (t) {
                e._rejectCallback(t, r);
              });

              r = !1, this._popContext(), void 0 !== n && e._rejectCallback(n, !0);
            }
          }, T.prototype._settlePromiseFromHandler = function (t, e, r, n) {
            var i = n._bitField;

            if (0 == (65536 & i)) {
              var o;
              n._pushContext(), e === y ? r && "number" == typeof r.length ? o = k(t).apply(this._boundValue(), r) : (o = R).e = new d("cannot .spread() a non-array: " + c.classString(r)) : o = k(t).call(e, r);

              var s = n._popContext();

              0 == (65536 & (i = n._bitField)) && (o === m ? n._reject(r) : o === R ? n._rejectCallback(o.e, !1) : (C.checkForgottenReturns(o, s, "", n, this), n._resolveCallback(o)));
            }
          }, T.prototype._target = function () {
            for (var t = this; t._isFollowing();) t = t._followee();

            return t;
          }, T.prototype._followee = function () {
            return this._rejectionHandler0;
          }, T.prototype._setFollowee = function (t) {
            this._rejectionHandler0 = t;
          }, T.prototype._settlePromise = function (t, e, r, n) {
            var o = t instanceof T,
                a = this._bitField,
                u = 0 != (134217728 & a);
            0 != (65536 & a) ? (o && t._invokeInternalOnCancel(), r instanceof x && r.isFinallyHandler() ? (r.cancelPromise = t, k(e).call(r, n) === R && t._reject(R.e)) : e === i ? t._fulfill(i.call(r)) : r instanceof s ? r._promiseCancelled(t) : o || t instanceof b ? t._cancel() : r.cancel()) : "function" == typeof e ? o ? (u && t._setAsyncGuaranteed(), this._settlePromiseFromHandler(e, r, n, t)) : e.call(r, n, t) : r instanceof s ? r._isResolved() || (0 != (33554432 & a) ? r._promiseFulfilled(n, t) : r._promiseRejected(n, t)) : o && (u && t._setAsyncGuaranteed(), 0 != (33554432 & a) ? t._fulfill(n) : t._reject(n));
          }, T.prototype._settlePromiseLateCancellationObserver = function (t) {
            var e = t.handler,
                r = t.promise,
                n = t.receiver,
                i = t.value;
            "function" == typeof e ? r instanceof T ? this._settlePromiseFromHandler(e, n, i, r) : e.call(n, i, r) : r instanceof T && r._reject(i);
          }, T.prototype._settlePromiseCtx = function (t) {
            this._settlePromise(t.promise, t.handler, t.receiver, t.value);
          }, T.prototype._settlePromise0 = function (t, e, r) {
            var n = this._promise0,
                i = this._receiverAt(0);

            this._promise0 = void 0, this._receiver0 = void 0, this._settlePromise(n, t, i, e);
          }, T.prototype._clearCallbackDataAtIndex = function (t) {
            var e = 4 * t - 4;
            this[e + 2] = this[e + 3] = this[e + 0] = this[e + 1] = void 0;
          }, T.prototype._fulfill = function (t) {
            var e = this._bitField;

            if (!((117506048 & e) >>> 16)) {
              if (t === this) {
                var r = n();
                return this._attachExtraTrace(r), this._reject(r);
              }

              this._setFulfilled(), this._rejectionHandler0 = t, (65535 & e) > 0 && (0 != (134217728 & e) ? this._settlePromises() : h.settlePromises(this));
            }
          }, T.prototype._reject = function (t) {
            var e = this._bitField;

            if (!((117506048 & e) >>> 16)) {
              if (this._setRejected(), this._fulfillmentHandler0 = t, this._isFinal()) return h.fatalError(t, c.isNode);
              (65535 & e) > 0 ? h.settlePromises(this) : this._ensurePossibleRejectionHandled();
            }
          }, T.prototype._fulfillPromises = function (t, e) {
            for (var r = 1; r < t; r++) {
              var n = this._fulfillmentHandlerAt(r),
                  i = this._promiseAt(r),
                  o = this._receiverAt(r);

              this._clearCallbackDataAtIndex(r), this._settlePromise(i, n, o, e);
            }
          }, T.prototype._rejectPromises = function (t, e) {
            for (var r = 1; r < t; r++) {
              var n = this._rejectionHandlerAt(r),
                  i = this._promiseAt(r),
                  o = this._receiverAt(r);

              this._clearCallbackDataAtIndex(r), this._settlePromise(i, n, o, e);
            }
          }, T.prototype._settlePromises = function () {
            var t = this._bitField,
                e = 65535 & t;

            if (e > 0) {
              if (0 != (16842752 & t)) {
                var r = this._fulfillmentHandler0;
                this._settlePromise0(this._rejectionHandler0, r, t), this._rejectPromises(e, r);
              } else {
                var n = this._rejectionHandler0;
                this._settlePromise0(this._fulfillmentHandler0, n, t), this._fulfillPromises(e, n);
              }

              this._setLength(0);
            }

            this._clearCancellationData();
          }, T.prototype._settledValue = function () {
            var t = this._bitField;
            return 0 != (33554432 & t) ? this._rejectionHandler0 : 0 != (16777216 & t) ? this._fulfillmentHandler0 : void 0;
          }, T.defer = T.pending = function () {
            return C.deprecated("Promise.defer", "new Promise"), {
              promise: new T(v),
              resolve: P,
              reject: O
            };
          }, c.notEnumerableProp(T, "_makeSelfResolutionError", n), t("./method")(T, v, g, o, C), t("./bind")(T, v, g, C), t("./cancel")(T, b, o, C), t("./direct_resolve")(T), t("./synchronous_inspection")(T), t("./join")(T, b, g, v, h, a), T.Promise = T, T.version = "3.5.1", t("./map.js")(T, b, o, g, v, C), t("./call_get.js")(T), t("./using.js")(T, o, g, E, v, C), t("./timers.js")(T, v, C), t("./generators.js")(T, o, v, g, s, C), t("./nodeify.js")(T), t("./promisify.js")(T, v), t("./props.js")(T, b, g, o), t("./race.js")(T, v, g, o), t("./reduce.js")(T, b, o, g, v, C), t("./settle.js")(T, b, C), t("./some.js")(T, b, o), t("./filter.js")(T, v), t("./each.js")(T, v), t("./any.js")(T), c.toFastProperties(T), c.toFastProperties(T.prototype), A({
            a: 1
          }), A({
            b: 2
          }), A({
            c: 3
          }), A(1), A(function () {}), A(void 0), A(!1), A(new T(v)), C.setBounds(f.firstLineError, c.lastLineError), T;
        };
      }, {
        "./any.js": 1,
        "./async": 2,
        "./bind": 3,
        "./call_get.js": 5,
        "./cancel": 6,
        "./catch_filter": 7,
        "./context": 8,
        "./debuggability": 9,
        "./direct_resolve": 10,
        "./each.js": 11,
        "./errors": 12,
        "./es5": 13,
        "./filter.js": 14,
        "./finally": 15,
        "./generators.js": 16,
        "./join": 17,
        "./map.js": 18,
        "./method": 19,
        "./nodeback": 20,
        "./nodeify.js": 21,
        "./promise_array": 23,
        "./promisify.js": 24,
        "./props.js": 25,
        "./race.js": 27,
        "./reduce.js": 28,
        "./settle.js": 30,
        "./some.js": 31,
        "./synchronous_inspection": 32,
        "./thenables": 33,
        "./timers.js": 34,
        "./using.js": 35,
        "./util": 36
      }],
      23: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n, i, o) {
          var s = t("./util");

          function a(t) {
            var n = this._promise = new e(r);
            t instanceof e && n._propagateFrom(t, 3), n._setOnCancel(this), this._values = t, this._length = 0, this._totalResolved = 0, this._init(void 0, -2);
          }

          return s.isArray, s.inherits(a, o), a.prototype.length = function () {
            return this._length;
          }, a.prototype.promise = function () {
            return this._promise;
          }, a.prototype._init = function t(r, o) {
            var a = n(this._values, this._promise);

            if (a instanceof e) {
              var u = (a = a._target())._bitField;

              if (this._values = a, 0 == (50397184 & u)) return this._promise._setAsyncGuaranteed(), a._then(t, this._reject, void 0, this, o);
              if (0 == (33554432 & u)) return 0 != (16777216 & u) ? this._reject(a._reason()) : this._cancel();
              a = a._value();
            }

            if (null !== (a = s.asArray(a))) 0 !== a.length ? this._iterate(a) : -5 === o ? this._resolveEmptyArray() : this._resolve(function (t) {
              switch (o) {
                case -2:
                  return [];

                case -3:
                  return {};

                case -6:
                  return new Map();
              }
            }());else {
              var c = i("expecting an array or an iterable object but got " + s.classString(a)).reason();

              this._promise._rejectCallback(c, !1);
            }
          }, a.prototype._iterate = function (t) {
            var r = this.getActualLength(t.length);
            this._length = r, this._values = this.shouldCopyValues() ? new Array(r) : this._values;

            for (var i = this._promise, o = !1, s = null, a = 0; a < r; ++a) {
              var u = n(t[a], i);
              s = u instanceof e ? (u = u._target())._bitField : null, o ? null !== s && u.suppressUnhandledRejections() : null !== s ? 0 == (50397184 & s) ? (u._proxy(this, a), this._values[a] = u) : o = 0 != (33554432 & s) ? this._promiseFulfilled(u._value(), a) : 0 != (16777216 & s) ? this._promiseRejected(u._reason(), a) : this._promiseCancelled(a) : o = this._promiseFulfilled(u, a);
            }

            o || i._setAsyncGuaranteed();
          }, a.prototype._isResolved = function () {
            return null === this._values;
          }, a.prototype._resolve = function (t) {
            this._values = null, this._promise._fulfill(t);
          }, a.prototype._cancel = function () {
            !this._isResolved() && this._promise._isCancellable() && (this._values = null, this._promise._cancel());
          }, a.prototype._reject = function (t) {
            this._values = null, this._promise._rejectCallback(t, !1);
          }, a.prototype._promiseFulfilled = function (t, e) {
            return this._values[e] = t, ++this._totalResolved >= this._length && (this._resolve(this._values), !0);
          }, a.prototype._promiseCancelled = function () {
            return this._cancel(), !0;
          }, a.prototype._promiseRejected = function (t) {
            return this._totalResolved++, this._reject(t), !0;
          }, a.prototype._resultCancelled = function () {
            if (!this._isResolved()) {
              var t = this._values;
              if (this._cancel(), t instanceof e) t.cancel();else for (var r = 0; r < t.length; ++r) t[r] instanceof e && t[r].cancel();
            }
          }, a.prototype.shouldCopyValues = function () {
            return !0;
          }, a.prototype.getActualLength = function (t) {
            return t;
          }, a;
        };
      }, {
        "./util": 36
      }],
      24: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r) {
          var n = {},
              i = t("./util"),
              o = t("./nodeback"),
              s = i.withAppended,
              a = i.maybeWrapAsError,
              u = i.canEvaluate,
              c = t("./errors").TypeError,
              l = {
            __isPromisified__: !0
          },
              f = new RegExp("^(?:" + ["arity", "length", "name", "arguments", "caller", "callee", "prototype", "__isPromisified__"].join("|") + ")$"),
              h = function (t) {
            return i.isIdentifier(t) && "_" !== t.charAt(0) && "constructor" !== t;
          };

          function p(t) {
            return !f.test(t);
          }

          function d(t) {
            try {
              return !0 === t.__isPromisified__;
            } catch (t) {
              return !1;
            }
          }

          function _(t, e, r) {
            var n = i.getDataPropertyOrDefault(t, e + r, l);
            return !!n && d(n);
          }

          function v(t, e, r, n) {
            for (var o = i.inheritedDataKeys(t), s = [], a = 0; a < o.length; ++a) {
              var u = o[a],
                  l = t[u],
                  f = n === h || h(u, l, t);
              "function" != typeof l || d(l) || _(t, u, e) || !n(u, l, t, f) || s.push(u, l);
            }

            return function (t, e, r) {
              for (var n = 0; n < t.length; n += 2) {
                var i = t[n];
                if (r.test(i)) for (var o = i.replace(r, ""), s = 0; s < t.length; s += 2) if (t[s] === o) throw new c("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", e));
              }
            }(s, e, r), s;
          }

          var y = function (t) {
            return t.replace(/([$])/, "\\$");
          },
              m = u ? void 0 : function (t, u, c, l, f, h) {
            var p = function () {
              return this;
            }(),
                d = t;

            function _() {
              var i = u;
              u === n && (i = this);
              var c = new e(r);

              c._captureStackTrace();

              var l = "string" == typeof d && this !== p ? this[d] : t,
                  f = o(c, h);

              try {
                l.apply(i, s(arguments, f));
              } catch (t) {
                c._rejectCallback(a(t), !0, !0);
              }

              return c._isFateSealed() || c._setAsyncGuaranteed(), c;
            }

            return "string" == typeof d && (t = l), i.notEnumerableProp(_, "__isPromisified__", !0), _;
          };

          function g(t, e, r, o, s) {
            for (var a = new RegExp(y(e) + "$"), u = v(t, e, a, r), c = 0, l = u.length; c < l; c += 2) {
              var f = u[c],
                  h = u[c + 1],
                  p = f + e;
              if (o === m) t[p] = m(f, n, f, h, e, s);else {
                var d = o(h, function () {
                  return m(f, n, f, h, e, s);
                });
                i.notEnumerableProp(d, "__isPromisified__", !0), t[p] = d;
              }
            }

            return i.toFastProperties(t), t;
          }

          e.promisify = function (t, e) {
            if ("function" != typeof t) throw new c("expecting a function but got " + i.classString(t));
            if (d(t)) return t;

            var r = void 0 === (e = Object(e)).context ? n : e.context,
                o = !!e.multiArgs,
                s = function (t, e, r) {
              return m(t, e, void 0, t, null, o);
            }(t, r);

            return i.copyDescriptors(t, s, p), s;
          }, e.promisifyAll = function (t, e) {
            if ("function" != typeof t && "object" != _typeof(t)) throw new c("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
            var r = !!(e = Object(e)).multiArgs,
                n = e.suffix;
            "string" != typeof n && (n = "Async");
            var o = e.filter;
            "function" != typeof o && (o = h);
            var s = e.promisifier;
            if ("function" != typeof s && (s = m), !i.isIdentifier(n)) throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");

            for (var a = i.inheritedDataKeys(t), u = 0; u < a.length; ++u) {
              var l = t[a[u]];
              "constructor" !== a[u] && i.isClass(l) && (g(l.prototype, n, o, s, r), g(l, n, o, s, r));
            }

            return g(t, n, o, s, r);
          };
        };
      }, {
        "./errors": 12,
        "./nodeback": 20,
        "./util": 36
      }],
      25: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n, i) {
          var o,
              s = t("./util"),
              a = s.isObject,
              u = t("./es5");
          "function" == typeof Map && (o = Map);

          var c = function () {
            var t = 0,
                e = 0;

            function r(r, n) {
              this[t] = r, this[t + e] = n, t++;
            }

            return function (n) {
              e = n.size, t = 0;
              var i = new Array(2 * n.size);
              return n.forEach(r, i), i;
            };
          }();

          function l(t) {
            var e,
                r = !1;
            if (void 0 !== o && t instanceof o) e = c(t), r = !0;else {
              var n = u.keys(t),
                  i = n.length;
              e = new Array(2 * i);

              for (var s = 0; s < i; ++s) {
                var a = n[s];
                e[s] = t[a], e[s + i] = a;
              }
            }
            this.constructor$(e), this._isMap = r, this._init$(void 0, r ? -6 : -3);
          }

          function f(t) {
            var r,
                o = n(t);
            return a(o) ? (r = o instanceof e ? o._then(e.props, void 0, void 0, void 0, void 0) : new l(o).promise(), o instanceof e && r._propagateFrom(o, 2), r) : i("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
          }

          s.inherits(l, r), l.prototype._init = function () {}, l.prototype._promiseFulfilled = function (t, e) {
            if (this._values[e] = t, ++this._totalResolved >= this._length) {
              var r;
              if (this._isMap) r = function (t) {
                for (var e = new o(), r = t.length / 2 | 0, n = 0; n < r; ++n) {
                  var i = t[r + n],
                      s = t[n];
                  e.set(i, s);
                }

                return e;
              }(this._values);else {
                r = {};

                for (var n = this.length(), i = 0, s = this.length(); i < s; ++i) r[this._values[i + n]] = this._values[i];
              }
              return this._resolve(r), !0;
            }

            return !1;
          }, l.prototype.shouldCopyValues = function () {
            return !1;
          }, l.prototype.getActualLength = function (t) {
            return t >> 1;
          }, e.prototype.props = function () {
            return f(this);
          }, e.props = function (t) {
            return f(t);
          };
        };
      }, {
        "./es5": 13,
        "./util": 36
      }],
      26: [function (t, e, r) {
        "use strict";

        function n(t) {
          this._capacity = t, this._length = 0, this._front = 0;
        }

        n.prototype._willBeOverCapacity = function (t) {
          return this._capacity < t;
        }, n.prototype._pushOne = function (t) {
          var e = this.length();
          this._checkCapacity(e + 1), this[this._front + e & this._capacity - 1] = t, this._length = e + 1;
        }, n.prototype.push = function (t, e, r) {
          var n = this.length() + 3;
          if (this._willBeOverCapacity(n)) return this._pushOne(t), this._pushOne(e), void this._pushOne(r);
          var i = this._front + n - 3;

          this._checkCapacity(n);

          var o = this._capacity - 1;
          this[i + 0 & o] = t, this[i + 1 & o] = e, this[i + 2 & o] = r, this._length = n;
        }, n.prototype.shift = function () {
          var t = this._front,
              e = this[t];
          return this[t] = void 0, this._front = t + 1 & this._capacity - 1, this._length--, e;
        }, n.prototype.length = function () {
          return this._length;
        }, n.prototype._checkCapacity = function (t) {
          this._capacity < t && this._resizeTo(this._capacity << 1);
        }, n.prototype._resizeTo = function (t) {
          var e = this._capacity;
          this._capacity = t, function (t, e, r, n, i) {
            for (var o = 0; o < i; ++o) r[o + n] = t[o + 0], t[o + 0] = void 0;
          }(this, 0, this, e, this._front + this._length & e - 1);
        }, e.exports = n;
      }, {}],
      27: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n, i) {
          var o = t("./util"),
              s = function (t) {
            return t.then(function (e) {
              return a(e, t);
            });
          };

          function a(t, a) {
            var u = n(t);
            if (u instanceof e) return s(u);
            if (null === (t = o.asArray(t))) return i("expecting an array or an iterable object but got " + o.classString(t));
            var c = new e(r);
            void 0 !== a && c._propagateFrom(a, 3);

            for (var l = c._fulfill, f = c._reject, h = 0, p = t.length; h < p; ++h) {
              var d = t[h];
              (void 0 !== d || h in t) && e.cast(d)._then(l, f, void 0, c, null);
            }

            return c;
          }

          e.race = function (t) {
            return a(t, void 0);
          }, e.prototype.race = function () {
            return a(this, void 0);
          };
        };
      }, {
        "./util": 36
      }],
      28: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n, i, o, s) {
          var a = e._getDomain,
              u = t("./util"),
              c = u.tryCatch;

          function l(t, r, n, i) {
            this.constructor$(t);
            var s = a();
            this._fn = null === s ? r : u.domainBind(s, r), void 0 !== n && (n = e.resolve(n))._attachCancellationCallback(this), this._initialValue = n, this._currentCancellable = null, this._eachValues = i === o ? Array(this._length) : 0 === i ? null : void 0, this._promise._captureStackTrace(), this._init$(void 0, -5);
          }

          function f(t, e) {
            this.isFulfilled() ? e._resolve(t) : e._reject(t);
          }

          function h(t, e, r, i) {
            return "function" != typeof e ? n("expecting a function but got " + u.classString(e)) : new l(t, e, r, i).promise();
          }

          function p(t) {
            this.accum = t, this.array._gotAccum(t);
            var r = i(this.value, this.array._promise);
            return r instanceof e ? (this.array._currentCancellable = r, r._then(d, void 0, void 0, this, void 0)) : d.call(this, r);
          }

          function d(t) {
            var r,
                n = this.array,
                i = n._promise,
                o = c(n._fn);
            i._pushContext(), (r = void 0 !== n._eachValues ? o.call(i._boundValue(), t, this.index, this.length) : o.call(i._boundValue(), this.accum, t, this.index, this.length)) instanceof e && (n._currentCancellable = r);

            var a = i._popContext();

            return s.checkForgottenReturns(r, a, void 0 !== n._eachValues ? "Promise.each" : "Promise.reduce", i), r;
          }

          u.inherits(l, r), l.prototype._gotAccum = function (t) {
            void 0 !== this._eachValues && null !== this._eachValues && t !== o && this._eachValues.push(t);
          }, l.prototype._eachComplete = function (t) {
            return null !== this._eachValues && this._eachValues.push(t), this._eachValues;
          }, l.prototype._init = function () {}, l.prototype._resolveEmptyArray = function () {
            this._resolve(void 0 !== this._eachValues ? this._eachValues : this._initialValue);
          }, l.prototype.shouldCopyValues = function () {
            return !1;
          }, l.prototype._resolve = function (t) {
            this._promise._resolveCallback(t), this._values = null;
          }, l.prototype._resultCancelled = function (t) {
            if (t === this._initialValue) return this._cancel();
            this._isResolved() || (this._resultCancelled$(), this._currentCancellable instanceof e && this._currentCancellable.cancel(), this._initialValue instanceof e && this._initialValue.cancel());
          }, l.prototype._iterate = function (t) {
            var r, n;
            this._values = t;
            var i = t.length;
            if (void 0 !== this._initialValue ? (r = this._initialValue, n = 0) : (r = e.resolve(t[0]), n = 1), this._currentCancellable = r, !r.isRejected()) for (; n < i; ++n) {
              var o = {
                accum: null,
                value: t[n],
                index: n,
                length: i,
                array: this
              };
              r = r._then(p, void 0, void 0, o, void 0);
            }
            void 0 !== this._eachValues && (r = r._then(this._eachComplete, void 0, void 0, this, void 0)), r._then(f, f, void 0, r, this);
          }, e.prototype.reduce = function (t, e) {
            return h(this, t, e, null);
          }, e.reduce = function (t, e, r, n) {
            return h(t, e, r, n);
          };
        };
      }, {
        "./util": 36
      }],
      29: [function (t, i, o) {
        "use strict";

        var s,
            a = t("./util"),
            u = a.getNativePromise();

        if (a.isNode && "undefined" == typeof MutationObserver) {
          var c = r.setImmediate,
              l = e.nextTick;
          s = a.isRecentNode ? function (t) {
            c.call(r, t);
          } : function (t) {
            l.call(e, t);
          };
        } else if ("function" == typeof u && "function" == typeof u.resolve) {
          var f = u.resolve();

          s = function (t) {
            f.then(t);
          };
        } else s = "undefined" == typeof MutationObserver || "undefined" != typeof window && window.navigator && (window.navigator.standalone || window.cordova) ? void 0 !== n ? function (t) {
          n(t);
        } : "undefined" != typeof setTimeout ? function (t) {
          setTimeout(t, 0);
        } : function () {
          throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
        } : function () {
          var t = document.createElement("div"),
              e = {
            attributes: !0
          },
              r = !1,
              n = document.createElement("div");
          return new MutationObserver(function () {
            t.classList.toggle("foo"), r = !1;
          }).observe(n, e), function (i) {
            var o = new MutationObserver(function () {
              o.disconnect(), i();
            });
            o.observe(t, e), r || (r = !0, n.classList.toggle("foo"));
          };
        }();

        i.exports = s;
      }, {
        "./util": 36
      }],
      30: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n) {
          var i = e.PromiseInspection;

          function o(t) {
            this.constructor$(t);
          }

          t("./util").inherits(o, r), o.prototype._promiseResolved = function (t, e) {
            return this._values[t] = e, ++this._totalResolved >= this._length && (this._resolve(this._values), !0);
          }, o.prototype._promiseFulfilled = function (t, e) {
            var r = new i();
            return r._bitField = 33554432, r._settledValueField = t, this._promiseResolved(e, r);
          }, o.prototype._promiseRejected = function (t, e) {
            var r = new i();
            return r._bitField = 16777216, r._settledValueField = t, this._promiseResolved(e, r);
          }, e.settle = function (t) {
            return n.deprecated(".settle()", ".reflect()"), new o(t).promise();
          }, e.prototype.settle = function () {
            return e.settle(this);
          };
        };
      }, {
        "./util": 36
      }],
      31: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n) {
          var i = t("./util"),
              o = t("./errors").RangeError,
              s = t("./errors").AggregateError,
              a = i.isArray,
              u = {};

          function c(t) {
            this.constructor$(t), this._howMany = 0, this._unwrap = !1, this._initialized = !1;
          }

          function l(t, e) {
            if ((0 | e) !== e || e < 0) return n("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
            var r = new c(t),
                i = r.promise();
            return r.setHowMany(e), r.init(), i;
          }

          i.inherits(c, r), c.prototype._init = function () {
            if (this._initialized) if (0 !== this._howMany) {
              this._init$(void 0, -5);

              var t = a(this._values);
              !this._isResolved() && t && this._howMany > this._canPossiblyFulfill() && this._reject(this._getRangeError(this.length()));
            } else this._resolve([]);
          }, c.prototype.init = function () {
            this._initialized = !0, this._init();
          }, c.prototype.setUnwrap = function () {
            this._unwrap = !0;
          }, c.prototype.howMany = function () {
            return this._howMany;
          }, c.prototype.setHowMany = function (t) {
            this._howMany = t;
          }, c.prototype._promiseFulfilled = function (t) {
            return this._addFulfilled(t), this._fulfilled() === this.howMany() && (this._values.length = this.howMany(), 1 === this.howMany() && this._unwrap ? this._resolve(this._values[0]) : this._resolve(this._values), !0);
          }, c.prototype._promiseRejected = function (t) {
            return this._addRejected(t), this._checkOutcome();
          }, c.prototype._promiseCancelled = function () {
            return this._values instanceof e || null == this._values ? this._cancel() : (this._addRejected(u), this._checkOutcome());
          }, c.prototype._checkOutcome = function () {
            if (this.howMany() > this._canPossiblyFulfill()) {
              for (var t = new s(), e = this.length(); e < this._values.length; ++e) this._values[e] !== u && t.push(this._values[e]);

              return t.length > 0 ? this._reject(t) : this._cancel(), !0;
            }

            return !1;
          }, c.prototype._fulfilled = function () {
            return this._totalResolved;
          }, c.prototype._rejected = function () {
            return this._values.length - this.length();
          }, c.prototype._addRejected = function (t) {
            this._values.push(t);
          }, c.prototype._addFulfilled = function (t) {
            this._values[this._totalResolved++] = t;
          }, c.prototype._canPossiblyFulfill = function () {
            return this.length() - this._rejected();
          }, c.prototype._getRangeError = function (t) {
            var e = "Input array must contain at least " + this._howMany + " items but contains only " + t + " items";
            return new o(e);
          }, c.prototype._resolveEmptyArray = function () {
            this._reject(this._getRangeError(0));
          }, e.some = function (t, e) {
            return l(t, e);
          }, e.prototype.some = function (t) {
            return l(this, t);
          }, e._SomePromiseArray = c;
        };
      }, {
        "./errors": 12,
        "./util": 36
      }],
      32: [function (t, e, r) {
        "use strict";

        e.exports = function (t) {
          function e(t) {
            void 0 !== t ? (t = t._target(), this._bitField = t._bitField, this._settledValueField = t._isFateSealed() ? t._settledValue() : void 0) : (this._bitField = 0, this._settledValueField = void 0);
          }

          e.prototype._settledValue = function () {
            return this._settledValueField;
          };

          var r = e.prototype.value = function () {
            if (!this.isFulfilled()) throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
            return this._settledValue();
          },
              n = e.prototype.error = e.prototype.reason = function () {
            if (!this.isRejected()) throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
            return this._settledValue();
          },
              i = e.prototype.isFulfilled = function () {
            return 0 != (33554432 & this._bitField);
          },
              o = e.prototype.isRejected = function () {
            return 0 != (16777216 & this._bitField);
          },
              s = e.prototype.isPending = function () {
            return 0 == (50397184 & this._bitField);
          },
              a = e.prototype.isResolved = function () {
            return 0 != (50331648 & this._bitField);
          };

          e.prototype.isCancelled = function () {
            return 0 != (8454144 & this._bitField);
          }, t.prototype.__isCancelled = function () {
            return 65536 == (65536 & this._bitField);
          }, t.prototype._isCancelled = function () {
            return this._target().__isCancelled();
          }, t.prototype.isCancelled = function () {
            return 0 != (8454144 & this._target()._bitField);
          }, t.prototype.isPending = function () {
            return s.call(this._target());
          }, t.prototype.isRejected = function () {
            return o.call(this._target());
          }, t.prototype.isFulfilled = function () {
            return i.call(this._target());
          }, t.prototype.isResolved = function () {
            return a.call(this._target());
          }, t.prototype.value = function () {
            return r.call(this._target());
          }, t.prototype.reason = function () {
            var t = this._target();

            return t._unsetRejectionIsUnhandled(), n.call(t);
          }, t.prototype._value = function () {
            return this._settledValue();
          }, t.prototype._reason = function () {
            return this._unsetRejectionIsUnhandled(), this._settledValue();
          }, t.PromiseInspection = e;
        };
      }, {}],
      33: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r) {
          var n = t("./util"),
              i = n.errorObj,
              o = n.isObject,
              s = {}.hasOwnProperty;
          return function (t, a) {
            if (o(t)) {
              if (t instanceof e) return t;

              var u = function (t) {
                try {
                  return function (t) {
                    return t.then;
                  }(t);
                } catch (t) {
                  return i.e = t, i;
                }
              }(t);

              if (u === i) {
                a && a._pushContext();
                var c = e.reject(u.e);
                return a && a._popContext(), c;
              }

              if ("function" == typeof u) return function (t) {
                try {
                  return s.call(t, "_promise0");
                } catch (t) {
                  return !1;
                }
              }(t) ? (c = new e(r), t._then(c._fulfill, c._reject, void 0, c, null), c) : function (t, o, s) {
                var a = new e(r),
                    u = a;
                s && s._pushContext(), a._captureStackTrace(), s && s._popContext();
                var c = !0,
                    l = n.tryCatch(o).call(t, function (t) {
                  a && (a._resolveCallback(t), a = null);
                }, function (t) {
                  a && (a._rejectCallback(t, c, !0), a = null);
                });
                return c = !1, a && l === i && (a._rejectCallback(l.e, !0, !0), a = null), u;
              }(t, u, a);
            }

            return t;
          };
        };
      }, {
        "./util": 36
      }],
      34: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n) {
          var i = t("./util"),
              o = e.TimeoutError;

          function s(t) {
            this.handle = t;
          }

          s.prototype._resultCancelled = function () {
            clearTimeout(this.handle);
          };

          var a = function (t) {
            return u(+this).thenReturn(t);
          },
              u = e.delay = function (t, i) {
            var o, u;
            return void 0 !== i ? (o = e.resolve(i)._then(a, null, null, t, void 0), n.cancellation() && i instanceof e && o._setOnCancel(i)) : (o = new e(r), u = setTimeout(function () {
              o._fulfill();
            }, +t), n.cancellation() && o._setOnCancel(new s(u)), o._captureStackTrace()), o._setAsyncGuaranteed(), o;
          };

          function c(t) {
            return clearTimeout(this.handle), t;
          }

          function l(t) {
            throw clearTimeout(this.handle), t;
          }

          e.prototype.delay = function (t) {
            return u(t, this);
          }, e.prototype.timeout = function (t, e) {
            var r, a;
            t = +t;
            var u = new s(setTimeout(function () {
              r.isPending() && function (t, e, r) {
                var n;
                n = "string" != typeof e ? e instanceof Error ? e : new o("operation timed out") : new o(e), i.markAsOriginatingFromRejection(n), t._attachExtraTrace(n), t._reject(n), null != r && r.cancel();
              }(r, e, a);
            }, t));
            return n.cancellation() ? (a = this.then(), (r = a._then(c, l, void 0, u, void 0))._setOnCancel(u)) : r = this._then(c, l, void 0, u, void 0), r;
          };
        };
      }, {
        "./util": 36
      }],
      35: [function (t, e, r) {
        "use strict";

        e.exports = function (e, r, n, i, o, s) {
          var a = t("./util"),
              u = t("./errors").TypeError,
              c = t("./util").inherits,
              l = a.errorObj,
              f = a.tryCatch,
              h = {};

          function p(t) {
            setTimeout(function () {
              throw t;
            }, 0);
          }

          function d(t, r) {
            var i = 0,
                s = t.length,
                a = new e(o);
            return function o() {
              if (i >= s) return a._fulfill();

              var u = function (t) {
                var e = n(t);
                return e !== t && "function" == typeof t._isDisposable && "function" == typeof t._getDisposer && t._isDisposable() && e._setDisposable(t._getDisposer()), e;
              }(t[i++]);

              if (u instanceof e && u._isDisposable()) {
                try {
                  u = n(u._getDisposer().tryDispose(r), t.promise);
                } catch (t) {
                  return p(t);
                }

                if (u instanceof e) return u._then(o, p, null, null, null);
              }

              o();
            }(), a;
          }

          function _(t, e, r) {
            this._data = t, this._promise = e, this._context = r;
          }

          function v(t, e, r) {
            this.constructor$(t, e, r);
          }

          function y(t) {
            return _.isDisposer(t) ? (this.resources[this.index]._setDisposable(t), t.promise()) : t;
          }

          function m(t) {
            this.length = t, this.promise = null, this[t - 1] = null;
          }

          _.prototype.data = function () {
            return this._data;
          }, _.prototype.promise = function () {
            return this._promise;
          }, _.prototype.resource = function () {
            return this.promise().isFulfilled() ? this.promise().value() : h;
          }, _.prototype.tryDispose = function (t) {
            var e = this.resource(),
                r = this._context;
            void 0 !== r && r._pushContext();
            var n = e !== h ? this.doDispose(e, t) : null;
            return void 0 !== r && r._popContext(), this._promise._unsetDisposable(), this._data = null, n;
          }, _.isDisposer = function (t) {
            return null != t && "function" == typeof t.resource && "function" == typeof t.tryDispose;
          }, c(v, _), v.prototype.doDispose = function (t, e) {
            return this.data().call(t, t, e);
          }, m.prototype._resultCancelled = function () {
            for (var t = this.length, r = 0; r < t; ++r) {
              var n = this[r];
              n instanceof e && n.cancel();
            }
          }, e.using = function () {
            var t = arguments.length;
            if (t < 2) return r("you must pass at least 2 arguments to Promise.using");
            var i,
                o = arguments[t - 1];
            if ("function" != typeof o) return r("expecting a function but got " + a.classString(o));
            var u = !0;
            2 === t && Array.isArray(arguments[0]) ? (t = (i = arguments[0]).length, u = !1) : (i = arguments, t--);

            for (var c = new m(t), h = 0; h < t; ++h) {
              var p = i[h];

              if (_.isDisposer(p)) {
                var v = p;

                (p = p.promise())._setDisposable(v);
              } else {
                var g = n(p);
                g instanceof e && (p = g._then(y, null, null, {
                  resources: c,
                  index: h
                }, void 0));
              }

              c[h] = p;
            }

            var b = new Array(c.length);

            for (h = 0; h < b.length; ++h) b[h] = e.resolve(c[h]).reflect();

            var w = e.all(b).then(function (t) {
              for (var e = 0; e < t.length; ++e) {
                var r = t[e];
                if (r.isRejected()) return l.e = r.error(), l;
                if (!r.isFulfilled()) return void w.cancel();
                t[e] = r.value();
              }

              E._pushContext(), o = f(o);

              var n = u ? o.apply(void 0, t) : o(t),
                  i = E._popContext();

              return s.checkForgottenReturns(n, i, "Promise.using", E), n;
            }),
                E = w.lastly(function () {
              var t = new e.PromiseInspection(w);
              return d(c, t);
            });
            return c.promise = E, E._setOnCancel(c), E;
          }, e.prototype._setDisposable = function (t) {
            this._bitField = 131072 | this._bitField, this._disposer = t;
          }, e.prototype._isDisposable = function () {
            return (131072 & this._bitField) > 0;
          }, e.prototype._getDisposer = function () {
            return this._disposer;
          }, e.prototype._unsetDisposable = function () {
            this._bitField = -131073 & this._bitField, this._disposer = void 0;
          }, e.prototype.disposer = function (t) {
            if ("function" == typeof t) return new v(t, this, i());
            throw new u();
          };
        };
      }, {
        "./errors": 12,
        "./util": 36
      }],
      36: [function (t, n, i) {
        "use strict";

        var o,
            s = t("./es5"),
            a = "undefined" == typeof navigator,
            u = {
          e: {}
        },
            c = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== r ? r : void 0 !== this ? this : null;

        function l() {
          try {
            var t = o;
            return o = null, t.apply(this, arguments);
          } catch (t) {
            return u.e = t, u;
          }
        }

        function f(t) {
          return null == t || !0 === t || !1 === t || "string" == typeof t || "number" == typeof t;
        }

        function h(t, e, r) {
          if (f(t)) return t;
          var n = {
            value: r,
            configurable: !0,
            enumerable: !1,
            writable: !0
          };
          return s.defineProperty(t, e, n), t;
        }

        var p = function () {
          var t = [Array.prototype, Object.prototype, Function.prototype],
              e = function (e) {
            for (var r = 0; r < t.length; ++r) if (t[r] === e) return !0;

            return !1;
          };

          if (s.isES5) {
            var r = Object.getOwnPropertyNames;
            return function (t) {
              for (var n = [], i = Object.create(null); null != t && !e(t);) {
                var o;

                try {
                  o = r(t);
                } catch (t) {
                  return n;
                }

                for (var a = 0; a < o.length; ++a) {
                  var u = o[a];

                  if (!i[u]) {
                    i[u] = !0;
                    var c = Object.getOwnPropertyDescriptor(t, u);
                    null != c && null == c.get && null == c.set && n.push(u);
                  }
                }

                t = s.getPrototypeOf(t);
              }

              return n;
            };
          }

          var n = {}.hasOwnProperty;
          return function (r) {
            if (e(r)) return [];
            var i = [];

            t: for (var o in r) if (n.call(r, o)) i.push(o);else {
              for (var s = 0; s < t.length; ++s) if (n.call(t[s], o)) continue t;

              i.push(o);
            }

            return i;
          };
        }(),
            d = /this\s*\.\s*\S+\s*=/,
            _ = /^[a-z$_][a-z$_0-9]*$/i;

        function v(t) {
          try {
            return t + "";
          } catch (t) {
            return "[no string representation]";
          }
        }

        function y(t) {
          return t instanceof Error || null !== t && "object" == _typeof(t) && "string" == typeof t.message && "string" == typeof t.name;
        }

        function m(t) {
          return y(t) && s.propertyIsWritable(t, "stack");
        }

        var g = "stack" in new Error() ? function (t) {
          return m(t) ? t : new Error(v(t));
        } : function (t) {
          if (m(t)) return t;

          try {
            throw new Error(v(t));
          } catch (t) {
            return t;
          }
        };

        function b(t) {
          return {}.toString.call(t);
        }

        var w = function (t) {
          return s.isArray(t) ? t : null;
        };

        if ("undefined" != typeof Symbol && Symbol.iterator) {
          var E = "function" == typeof Array.from ? function (t) {
            return Array.from(t);
          } : function (t) {
            for (var e, r = [], n = t[Symbol.iterator](); !(e = n.next()).done;) r.push(e.value);

            return r;
          };

          w = function (t) {
            return s.isArray(t) ? t : null != t && "function" == typeof t[Symbol.iterator] ? E(t) : null;
          };
        }

        var C = void 0 !== e && "[object process]" === b(e).toLowerCase(),
            x = void 0 !== e && void 0 !== e.env,
            j = {
          isClass: function (t) {
            try {
              if ("function" == typeof t) {
                var e = s.names(t.prototype),
                    r = s.isES5 && e.length > 1,
                    n = e.length > 0 && !(1 === e.length && "constructor" === e[0]),
                    i = d.test(t + "") && s.names(t).length > 0;
                if (r || n || i) return !0;
              }

              return !1;
            } catch (t) {
              return !1;
            }
          },
          isIdentifier: function (t) {
            return _.test(t);
          },
          inheritedDataKeys: p,
          getDataPropertyOrDefault: function (t, e, r) {
            if (!s.isES5) return {}.hasOwnProperty.call(t, e) ? t[e] : void 0;
            var n = Object.getOwnPropertyDescriptor(t, e);
            return null != n ? null == n.get && null == n.set ? n.value : r : void 0;
          },
          thrower: function (t) {
            throw t;
          },
          isArray: s.isArray,
          asArray: w,
          notEnumerableProp: h,
          isPrimitive: f,
          isObject: function (t) {
            return "function" == typeof t || "object" == _typeof(t) && null !== t;
          },
          isError: y,
          canEvaluate: a,
          errorObj: u,
          tryCatch: function (t) {
            return o = t, l;
          },
          inherits: function (t, e) {
            var r = {}.hasOwnProperty;

            function n() {
              for (var n in this.constructor = t, this.constructor$ = e, e.prototype) r.call(e.prototype, n) && "$" !== n.charAt(n.length - 1) && (this[n + "$"] = e.prototype[n]);
            }

            return n.prototype = e.prototype, t.prototype = new n(), t.prototype;
          },
          withAppended: function (t, e) {
            var r,
                n = t.length,
                i = new Array(n + 1);

            for (r = 0; r < n; ++r) i[r] = t[r];

            return i[r] = e, i;
          },
          maybeWrapAsError: function (t) {
            return f(t) ? new Error(v(t)) : t;
          },
          toFastProperties: function (t) {
            function e() {}

            e.prototype = t;

            for (var r = 8; r--;) new e();

            return t;
          },
          filledRange: function (t, e, r) {
            for (var n = new Array(t), i = 0; i < t; ++i) n[i] = e + i + r;

            return n;
          },
          toString: v,
          canAttachTrace: m,
          ensureErrorObject: g,
          originatesFromRejection: function (t) {
            return null != t && (t instanceof Error.__BluebirdErrorTypes__.OperationalError || !0 === t.isOperational);
          },
          markAsOriginatingFromRejection: function (t) {
            try {
              h(t, "isOperational", !0);
            } catch (t) {}
          },
          classString: b,
          copyDescriptors: function (t, e, r) {
            for (var n = s.names(t), i = 0; i < n.length; ++i) {
              var o = n[i];
              if (r(o)) try {
                s.defineProperty(e, o, s.getDescriptor(t, o));
              } catch (t) {}
            }
          },
          hasDevTools: "undefined" != typeof chrome && chrome && "function" == typeof chrome.loadTimes,
          isNode: C,
          hasEnvVariables: x,
          env: function (t) {
            return x ? e.env[t] : void 0;
          },
          global: c,
          getNativePromise: function () {
            if ("function" == typeof Promise) try {
              var t = new Promise(function () {});
              if ("[object Promise]" === {}.toString.call(t)) return Promise;
            } catch (t) {}
          },
          domainBind: function (t, e) {
            return t.bind(e);
          }
        };
        j.isRecentNode = j.isNode && function () {
          var t = e.versions.node.split(".").map(Number);
          return 0 === t[0] && t[1] > 10 || t[0] > 0;
        }(), j.isNode && j.toFastProperties(e);

        try {
          throw new Error();
        } catch (t) {
          j.lastLineError = t;
        }

        n.exports = j;
      }, {
        "./es5": 13
      }]
    }, {}, [4])(4), "undefined" != typeof window && null !== window ? window.P = window.Promise : "undefined" != typeof self && null !== self && (self.P = self.Promise);
  }).call(this, r(4), r(0), r(11).setImmediate);
}, function (t, e, r) {
  "use strict";

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = function (t, e) {
    if (!e.eol && t) for (var r = 0, n = t.length; r < n; r++) if ("\r" === t[r]) {
      if ("\n" === t[r + 1]) {
        e.eol = "\r\n";
        break;
      }

      if (t[r + 1]) {
        e.eol = "\r";
        break;
      }
    } else if ("\n" === t[r]) {
      e.eol = "\n";
      break;
    }
    return e.eol || "\n";
  };
}, function (t, e, r) {
  var n = r(65),
      i = r(73);

  t.exports = function (t, e) {
    var r = i(t, e);
    return n(r) ? r : void 0;
  };
}, function (t, e, r) {
  var n = r(19).Symbol;
  t.exports = n;
}, function (t, e, r) {
  var n = r(67),
      i = "object" == (typeof self === "undefined" ? "undefined" : _typeof(self)) && self && self.Object === Object && self,
      o = n || i || Function("return this")();
  t.exports = o;
}, function (t, e) {
  t.exports = function (t) {
    var e = _typeof(t);

    return null != t && ("object" == e || "function" == e);
  };
}, function (t, e) {
  var r = Array.isArray;
  t.exports = r;
}, function (t, e, r) {
  var n = r(30),
      i = r(76);

  t.exports = function (t) {
    return "symbol" == _typeof(t) || i(t) && "[object Symbol]" == n(t);
  };
}, function (t, e, r) {
  "use strict";

  (function (e, n) {
    var i = r(6);
    t.exports = g;
    var o,
        s = r(37);
    g.ReadableState = m, r(12).EventEmitter;

    var a = function (t, e) {
      return t.listeners(e).length;
    },
        u = r(24),
        c = r(7).Buffer,
        l = e.Uint8Array || function () {},
        f = r(5);

    f.inherits = r(2);
    var h = r(41),
        p = void 0;
    p = h && h.debuglog ? h.debuglog("stream") : function () {};

    var d,
        _ = r(42),
        v = r(25);

    f.inherits(g, u);
    var y = ["error", "close", "destroy", "pause", "resume"];

    function m(t, e) {
      o = o || r(1), t = t || {};
      var n = e instanceof o;
      this.objectMode = !!t.objectMode, n && (this.objectMode = this.objectMode || !!t.readableObjectMode);
      var i = t.highWaterMark,
          s = t.readableHighWaterMark,
          a = this.objectMode ? 16 : 16384;
      this.highWaterMark = i || 0 === i ? i : n && (s || 0 === s) ? s : a, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new _(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = t.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (d || (d = r(26).StringDecoder), this.decoder = new d(t.encoding), this.encoding = t.encoding);
    }

    function g(t) {
      if (o = o || r(1), !(this instanceof g)) return new g(t);
      this._readableState = new m(t, this), this.readable = !0, t && ("function" == typeof t.read && (this._read = t.read), "function" == typeof t.destroy && (this._destroy = t.destroy)), u.call(this);
    }

    function b(t, e, r, n, i) {
      var o,
          s = t._readableState;
      return null === e ? (s.reading = !1, function (t, e) {
        if (!e.ended) {
          if (e.decoder) {
            var r = e.decoder.end();
            r && r.length && (e.buffer.push(r), e.length += e.objectMode ? 1 : r.length);
          }

          e.ended = !0, x(t);
        }
      }(t, s)) : (i || (o = function (t, e) {
        var r;
        return function (t) {
          return c.isBuffer(t) || t instanceof l;
        }(e) || "string" == typeof e || void 0 === e || t.objectMode || (r = new TypeError("Invalid non-string/buffer chunk")), r;
      }(s, e)), o ? t.emit("error", o) : s.objectMode || e && e.length > 0 ? ("string" == typeof e || s.objectMode || Object.getPrototypeOf(e) === c.prototype || (e = function (t) {
        return c.from(t);
      }(e)), n ? s.endEmitted ? t.emit("error", new Error("stream.unshift() after end event")) : w(t, s, e, !0) : s.ended ? t.emit("error", new Error("stream.push() after EOF")) : (s.reading = !1, s.decoder && !r ? (e = s.decoder.write(e), s.objectMode || 0 !== e.length ? w(t, s, e, !1) : S(t, s)) : w(t, s, e, !1))) : n || (s.reading = !1)), function (t) {
        return !t.ended && (t.needReadable || t.length < t.highWaterMark || 0 === t.length);
      }(s);
    }

    function w(t, e, r, n) {
      e.flowing && 0 === e.length && !e.sync ? (t.emit("data", r), t.read(0)) : (e.length += e.objectMode ? 1 : r.length, n ? e.buffer.unshift(r) : e.buffer.push(r), e.needReadable && x(t)), S(t, e);
    }

    Object.defineProperty(g.prototype, "destroyed", {
      get: function () {
        return void 0 !== this._readableState && this._readableState.destroyed;
      },
      set: function (t) {
        this._readableState && (this._readableState.destroyed = t);
      }
    }), g.prototype.destroy = v.destroy, g.prototype._undestroy = v.undestroy, g.prototype._destroy = function (t, e) {
      this.push(null), e(t);
    }, g.prototype.push = function (t, e) {
      var r,
          n = this._readableState;
      return n.objectMode ? r = !0 : "string" == typeof t && ((e = e || n.defaultEncoding) !== n.encoding && (t = c.from(t, e), e = ""), r = !0), b(this, t, e, !1, r);
    }, g.prototype.unshift = function (t) {
      return b(this, t, null, !0, !1);
    }, g.prototype.isPaused = function () {
      return !1 === this._readableState.flowing;
    }, g.prototype.setEncoding = function (t) {
      return d || (d = r(26).StringDecoder), this._readableState.decoder = new d(t), this._readableState.encoding = t, this;
    };
    var E = 8388608;

    function C(t, e) {
      return t <= 0 || 0 === e.length && e.ended ? 0 : e.objectMode ? 1 : t != t ? e.flowing && e.length ? e.buffer.head.data.length : e.length : (t > e.highWaterMark && (e.highWaterMark = function (t) {
        return t >= E ? t = E : (t--, t |= t >>> 1, t |= t >>> 2, t |= t >>> 4, t |= t >>> 8, t |= t >>> 16, t++), t;
      }(t)), t <= e.length ? t : e.ended ? e.length : (e.needReadable = !0, 0));
    }

    function x(t) {
      var e = t._readableState;
      e.needReadable = !1, e.emittedReadable || (p("emitReadable", e.flowing), e.emittedReadable = !0, e.sync ? i.nextTick(j, t) : j(t));
    }

    function j(t) {
      p("emit readable"), t.emit("readable"), P(t);
    }

    function S(t, e) {
      e.readingMore || (e.readingMore = !0, i.nextTick(R, t, e));
    }

    function R(t, e) {
      for (var r = e.length; !e.reading && !e.flowing && !e.ended && e.length < e.highWaterMark && (p("maybeReadMore read 0"), t.read(0), r !== e.length);) r = e.length;

      e.readingMore = !1;
    }

    function k(t) {
      p("readable nexttick read 0"), t.read(0);
    }

    function T(t, e) {
      e.reading || (p("resume read 0"), t.read(0)), e.resumeScheduled = !1, e.awaitDrain = 0, t.emit("resume"), P(t), e.flowing && !e.reading && t.read(0);
    }

    function P(t) {
      var e = t._readableState;

      for (p("flow", e.flowing); e.flowing && null !== t.read(););
    }

    function O(t, e) {
      return 0 === e.length ? null : (e.objectMode ? r = e.buffer.shift() : !t || t >= e.length ? (r = e.decoder ? e.buffer.join("") : 1 === e.buffer.length ? e.buffer.head.data : e.buffer.concat(e.length), e.buffer.clear()) : r = function (t, e, r) {
        var n;
        return t < e.head.data.length ? (n = e.head.data.slice(0, t), e.head.data = e.head.data.slice(t)) : n = t === e.head.data.length ? e.shift() : r ? function (t, e) {
          var r = e.head,
              n = 1,
              i = r.data;

          for (t -= i.length; r = r.next;) {
            var o = r.data,
                s = t > o.length ? o.length : t;

            if (s === o.length ? i += o : i += o.slice(0, t), 0 == (t -= s)) {
              s === o.length ? (++n, r.next ? e.head = r.next : e.head = e.tail = null) : (e.head = r, r.data = o.slice(s));
              break;
            }

            ++n;
          }

          return e.length -= n, i;
        }(t, e) : function (t, e) {
          var r = c.allocUnsafe(t),
              n = e.head,
              i = 1;

          for (n.data.copy(r), t -= n.data.length; n = n.next;) {
            var o = n.data,
                s = t > o.length ? o.length : t;

            if (o.copy(r, r.length - t, 0, s), 0 == (t -= s)) {
              s === o.length ? (++i, n.next ? e.head = n.next : e.head = e.tail = null) : (e.head = n, n.data = o.slice(s));
              break;
            }

            ++i;
          }

          return e.length -= i, r;
        }(t, e), n;
      }(t, e.buffer, e.decoder), r);
      var r;
    }

    function A(t) {
      var e = t._readableState;
      if (e.length > 0) throw new Error('"endReadable()" called on non-empty stream');
      e.endEmitted || (e.ended = !0, i.nextTick(F, e, t));
    }

    function F(t, e) {
      t.endEmitted || 0 !== t.length || (t.endEmitted = !0, e.readable = !1, e.emit("end"));
    }

    function L(t, e) {
      for (var r = 0, n = t.length; r < n; r++) if (t[r] === e) return r;

      return -1;
    }

    g.prototype.read = function (t) {
      p("read", t), t = parseInt(t, 10);
      var e = this._readableState,
          r = t;
      if (0 !== t && (e.emittedReadable = !1), 0 === t && e.needReadable && (e.length >= e.highWaterMark || e.ended)) return p("read: emitReadable", e.length, e.ended), 0 === e.length && e.ended ? A(this) : x(this), null;
      if (0 === (t = C(t, e)) && e.ended) return 0 === e.length && A(this), null;
      var n,
          i = e.needReadable;
      return p("need readable", i), (0 === e.length || e.length - t < e.highWaterMark) && p("length less than watermark", i = !0), e.ended || e.reading ? p("reading or ended", i = !1) : i && (p("do read"), e.reading = !0, e.sync = !0, 0 === e.length && (e.needReadable = !0), this._read(e.highWaterMark), e.sync = !1, e.reading || (t = C(r, e))), null === (n = t > 0 ? O(t, e) : null) ? (e.needReadable = !0, t = 0) : e.length -= t, 0 === e.length && (e.ended || (e.needReadable = !0), r !== t && e.ended && A(this)), null !== n && this.emit("data", n), n;
    }, g.prototype._read = function (t) {
      this.emit("error", new Error("_read() is not implemented"));
    }, g.prototype.pipe = function (t, e) {
      var r = this,
          o = this._readableState;

      switch (o.pipesCount) {
        case 0:
          o.pipes = t;
          break;

        case 1:
          o.pipes = [o.pipes, t];
          break;

        default:
          o.pipes.push(t);
      }

      o.pipesCount += 1, p("pipe count=%d opts=%j", o.pipesCount, e);
      var u = e && !1 === e.end || t === n.stdout || t === n.stderr ? m : c;

      function c() {
        p("onend"), t.end();
      }

      o.endEmitted ? i.nextTick(u) : r.once("end", u), t.on("unpipe", function e(n, i) {
        p("onunpipe"), n === r && i && !1 === i.hasUnpiped && (i.hasUnpiped = !0, p("cleanup"), t.removeListener("close", v), t.removeListener("finish", y), t.removeListener("drain", l), t.removeListener("error", _), t.removeListener("unpipe", e), r.removeListener("end", c), r.removeListener("end", m), r.removeListener("data", d), f = !0, !o.awaitDrain || t._writableState && !t._writableState.needDrain || l());
      });

      var l = function (t) {
        return function () {
          var e = t._readableState;
          p("pipeOnDrain", e.awaitDrain), e.awaitDrain && e.awaitDrain--, 0 === e.awaitDrain && a(t, "data") && (e.flowing = !0, P(t));
        };
      }(r);

      t.on("drain", l);
      var f = !1,
          h = !1;

      function d(e) {
        p("ondata"), h = !1, !1 !== t.write(e) || h || ((1 === o.pipesCount && o.pipes === t || o.pipesCount > 1 && -1 !== L(o.pipes, t)) && !f && (p("false write response, pause", r._readableState.awaitDrain), r._readableState.awaitDrain++, h = !0), r.pause());
      }

      function _(e) {
        p("onerror", e), m(), t.removeListener("error", _), 0 === a(t, "error") && t.emit("error", e);
      }

      function v() {
        t.removeListener("finish", y), m();
      }

      function y() {
        p("onfinish"), t.removeListener("close", v), m();
      }

      function m() {
        p("unpipe"), r.unpipe(t);
      }

      return r.on("data", d), function (t, e, r) {
        if ("function" == typeof t.prependListener) return t.prependListener(e, r);
        t._events && t._events[e] ? s(t._events[e]) ? t._events[e].unshift(r) : t._events[e] = [r, t._events[e]] : t.on(e, r);
      }(t, "error", _), t.once("close", v), t.once("finish", y), t.emit("pipe", r), o.flowing || (p("pipe resume"), r.resume()), t;
    }, g.prototype.unpipe = function (t) {
      var e = this._readableState,
          r = {
        hasUnpiped: !1
      };
      if (0 === e.pipesCount) return this;
      if (1 === e.pipesCount) return t && t !== e.pipes ? this : (t || (t = e.pipes), e.pipes = null, e.pipesCount = 0, e.flowing = !1, t && t.emit("unpipe", this, r), this);

      if (!t) {
        var n = e.pipes,
            i = e.pipesCount;
        e.pipes = null, e.pipesCount = 0, e.flowing = !1;

        for (var o = 0; o < i; o++) n[o].emit("unpipe", this, r);

        return this;
      }

      var s = L(e.pipes, t);
      return -1 === s ? this : (e.pipes.splice(s, 1), e.pipesCount -= 1, 1 === e.pipesCount && (e.pipes = e.pipes[0]), t.emit("unpipe", this, r), this);
    }, g.prototype.on = function (t, e) {
      var r = u.prototype.on.call(this, t, e);
      if ("data" === t) !1 !== this._readableState.flowing && this.resume();else if ("readable" === t) {
        var n = this._readableState;
        n.endEmitted || n.readableListening || (n.readableListening = n.needReadable = !0, n.emittedReadable = !1, n.reading ? n.length && x(this) : i.nextTick(k, this));
      }
      return r;
    }, g.prototype.addListener = g.prototype.on, g.prototype.resume = function () {
      var t = this._readableState;
      return t.flowing || (p("resume"), t.flowing = !0, function (t, e) {
        e.resumeScheduled || (e.resumeScheduled = !0, i.nextTick(T, t, e));
      }(this, t)), this;
    }, g.prototype.pause = function () {
      return p("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (p("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
    }, g.prototype.wrap = function (t) {
      var e = this,
          r = this._readableState,
          n = !1;

      for (var i in t.on("end", function () {
        if (p("wrapped end"), r.decoder && !r.ended) {
          var t = r.decoder.end();
          t && t.length && e.push(t);
        }

        e.push(null);
      }), t.on("data", function (i) {
        p("wrapped data"), r.decoder && (i = r.decoder.write(i)), (!r.objectMode || null !== i && void 0 !== i) && (r.objectMode || i && i.length) && (e.push(i) || (n = !0, t.pause()));
      }), t) void 0 === this[i] && "function" == typeof t[i] && (this[i] = function (e) {
        return function () {
          return t[e].apply(t, arguments);
        };
      }(i));

      for (var o = 0; o < y.length; o++) t.on(y[o], this.emit.bind(this, y[o]));

      return this._read = function (e) {
        p("wrapped _read", e), n && (n = !1, t.resume());
      }, this;
    }, Object.defineProperty(g.prototype, "readableHighWaterMark", {
      enumerable: !1,
      get: function () {
        return this._readableState.highWaterMark;
      }
    }), g._fromList = O;
  }).call(this, r(0), r(4));
}, function (t, e, r) {
  t.exports = r(12).EventEmitter;
}, function (t, e, r) {
  "use strict";

  var n = r(6);

  function i(t, e) {
    t.emit("error", e);
  }

  t.exports = {
    destroy: function (t, e) {
      var r = this,
          o = this._readableState && this._readableState.destroyed,
          s = this._writableState && this._writableState.destroyed;
      return o || s ? (e ? e(t) : !t || this._writableState && this._writableState.errorEmitted || n.nextTick(i, this, t), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(t || null, function (t) {
        !e && t ? (n.nextTick(i, r, t), r._writableState && (r._writableState.errorEmitted = !0)) : e && e(t);
      }), this);
    },
    undestroy: function () {
      this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
    }
  };
}, function (t, e, r) {
  "use strict";

  var n = r(7).Buffer,
      i = n.isEncoding || function (t) {
    switch ((t = "" + t) && t.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return !0;

      default:
        return !1;
    }
  };

  function o(t) {
    var e;

    switch (this.encoding = function (t) {
      var e = function (t) {
        if (!t) return "utf8";

        for (var e;;) switch (t) {
          case "utf8":
          case "utf-8":
            return "utf8";

          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";

          case "latin1":
          case "binary":
            return "latin1";

          case "base64":
          case "ascii":
          case "hex":
            return t;

          default:
            if (e) return;
            t = ("" + t).toLowerCase(), e = !0;
        }
      }(t);

      if ("string" != typeof e && (n.isEncoding === i || !i(t))) throw new Error("Unknown encoding: " + t);
      return e || t;
    }(t), this.encoding) {
      case "utf16le":
        this.text = u, this.end = c, e = 4;
        break;

      case "utf8":
        this.fillLast = a, e = 4;
        break;

      case "base64":
        this.text = l, this.end = f, e = 3;
        break;

      default:
        return this.write = h, void (this.end = p);
    }

    this.lastNeed = 0, this.lastTotal = 0, this.lastChar = n.allocUnsafe(e);
  }

  function s(t) {
    return t <= 127 ? 0 : t >> 5 == 6 ? 2 : t >> 4 == 14 ? 3 : t >> 3 == 30 ? 4 : t >> 6 == 2 ? -1 : -2;
  }

  function a(t) {
    var e = this.lastTotal - this.lastNeed,
        r = function (t, e, r) {
      if (128 != (192 & e[0])) return t.lastNeed = 0, "�";

      if (t.lastNeed > 1 && e.length > 1) {
        if (128 != (192 & e[1])) return t.lastNeed = 1, "�";
        if (t.lastNeed > 2 && e.length > 2 && 128 != (192 & e[2])) return t.lastNeed = 2, "�";
      }
    }(this, t);

    return void 0 !== r ? r : this.lastNeed <= t.length ? (t.copy(this.lastChar, e, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (t.copy(this.lastChar, e, 0, t.length), void (this.lastNeed -= t.length));
  }

  function u(t, e) {
    if ((t.length - e) % 2 == 0) {
      var r = t.toString("utf16le", e);

      if (r) {
        var n = r.charCodeAt(r.length - 1);
        if (n >= 55296 && n <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1], r.slice(0, -1);
      }

      return r;
    }

    return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = t[t.length - 1], t.toString("utf16le", e, t.length - 1);
  }

  function c(t) {
    var e = t && t.length ? this.write(t) : "";

    if (this.lastNeed) {
      var r = this.lastTotal - this.lastNeed;
      return e + this.lastChar.toString("utf16le", 0, r);
    }

    return e;
  }

  function l(t, e) {
    var r = (t.length - e) % 3;
    return 0 === r ? t.toString("base64", e) : (this.lastNeed = 3 - r, this.lastTotal = 3, 1 === r ? this.lastChar[0] = t[t.length - 1] : (this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1]), t.toString("base64", e, t.length - r));
  }

  function f(t) {
    var e = t && t.length ? this.write(t) : "";
    return this.lastNeed ? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : e;
  }

  function h(t) {
    return t.toString(this.encoding);
  }

  function p(t) {
    return t && t.length ? this.write(t) : "";
  }

  e.StringDecoder = o, o.prototype.write = function (t) {
    if (0 === t.length) return "";
    var e, r;

    if (this.lastNeed) {
      if (void 0 === (e = this.fillLast(t))) return "";
      r = this.lastNeed, this.lastNeed = 0;
    } else r = 0;

    return r < t.length ? e ? e + this.text(t, r) : this.text(t, r) : e || "";
  }, o.prototype.end = function (t) {
    var e = t && t.length ? this.write(t) : "";
    return this.lastNeed ? e + "�" : e;
  }, o.prototype.text = function (t, e) {
    var r = function (t, e, r) {
      var n = e.length - 1;
      if (n < r) return 0;
      var i = s(e[n]);
      return i >= 0 ? (i > 0 && (t.lastNeed = i - 1), i) : --n < r || -2 === i ? 0 : (i = s(e[n])) >= 0 ? (i > 0 && (t.lastNeed = i - 2), i) : --n < r || -2 === i ? 0 : (i = s(e[n])) >= 0 ? (i > 0 && (2 === i ? i = 0 : t.lastNeed = i - 3), i) : 0;
    }(this, t, e);

    if (!this.lastNeed) return t.toString("utf8", e);
    this.lastTotal = r;
    var n = t.length - (r - this.lastNeed);
    return t.copy(this.lastChar, 0, n), t.toString("utf8", e, n);
  }, o.prototype.fillLast = function (t) {
    if (this.lastNeed <= t.length) return t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, t.length), this.lastNeed -= t.length;
  };
}, function (t, e, r) {
  "use strict";

  t.exports = o;
  var n = r(1),
      i = r(5);

  function o(t) {
    if (!(this instanceof o)) return new o(t);
    n.call(this, t), this._transformState = {
      afterTransform: function (t, e) {
        var r = this._transformState;
        r.transforming = !1;
        var n = r.writecb;
        if (!n) return this.emit("error", new Error("write callback called multiple times"));
        r.writechunk = null, r.writecb = null, null != e && this.push(e), n(t);
        var i = this._readableState;
        i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
      }.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, t && ("function" == typeof t.transform && (this._transform = t.transform), "function" == typeof t.flush && (this._flush = t.flush)), this.on("prefinish", s);
  }

  function s() {
    var t = this;
    "function" == typeof this._flush ? this._flush(function (e, r) {
      a(t, e, r);
    }) : a(this, null, null);
  }

  function a(t, e, r) {
    if (e) return t.emit("error", e);
    if (null != r && t.push(r), t._writableState.length) throw new Error("Calling transform done when ws.length != 0");
    if (t._transformState.transforming) throw new Error("Calling transform done when still transforming");
    return t.push(null);
  }

  i.inherits = r(2), i.inherits(o, n), o.prototype.push = function (t, e) {
    return this._transformState.needTransform = !1, n.prototype.push.call(this, t, e);
  }, o.prototype._transform = function (t, e, r) {
    throw new Error("_transform() is not implemented");
  }, o.prototype._write = function (t, e, r) {
    var n = this._transformState;

    if (n.writecb = r, n.writechunk = t, n.writeencoding = e, !n.transforming) {
      var i = this._readableState;
      (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
    }
  }, o.prototype._read = function (t) {
    var e = this._transformState;
    null !== e.writechunk && e.writecb && !e.transforming ? (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform)) : e.needTransform = !0;
  }, o.prototype._destroy = function (t, e) {
    var r = this;

    n.prototype._destroy.call(this, t, function (t) {
      e(t), r.emit("close");
    });
  };
}, function (t, e, r) {
  "use strict";

  (function (t) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.bufFromString = function (e) {
      var r = t.byteLength(e),
          n = t.allocUnsafe ? t.allocUnsafe(r) : new t(r);
      return n.write(e), n;
    }, e.emptyBuffer = function () {
      return t.allocUnsafe ? t.allocUnsafe(0) : new t(0);
    }, e.filterArray = function (t, e) {
      for (var r = [], n = 0; n < t.length; n++) e.indexOf(n) > -1 && r.push(t[n]);

      return r;
    }, e.trimLeft = String.prototype.trimLeft ? function (t) {
      return t.trimLeft();
    } : function (t) {
      return t.replace(/^\s+/, "");
    }, e.trimRight = String.prototype.trimRight ? function (t) {
      return t.trimRight();
    } : function (t) {
      return t.replace(/\s+$/, "");
    };
  }).call(this, r(3).Buffer);
}, function (t, e, r) {
  "use strict";

  var n = this && this.__extends || function () {
    var t = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (t, e) {
      t.__proto__ = e;
    } || function (t, e) {
      for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
    };

    return function (e, r) {
      function n() {
        this.constructor = e;
      }

      t(e, r), e.prototype = null === r ? Object.create(r) : (n.prototype = r.prototype, new n());
    };
  }();

  Object.defineProperty(e, "__esModule", {
    value: !0
  });

  var i = function (t) {
    function e(e, r, n) {
      var i = t.call(this, "Error: " + e + ". JSON Line number: " + r + (n ? " near: " + n : "")) || this;
      return i.err = e, i.line = r, i.extra = n, i.name = "CSV Parse Error", i;
    }

    return n(e, t), e.column_mismatched = function (t, r) {
      return new e("column_mismatched", t, r);
    }, e.unclosed_quote = function (t, r) {
      return new e("unclosed_quote", t, r);
    }, e.fromJSON = function (t) {
      return new e(t.err, t.line, t.extra);
    }, e.prototype.toJSON = function () {
      return {
        err: this.err,
        line: this.line,
        extra: this.extra
      };
    }, e;
  }(Error);

  e.default = i;
}, function (t, e, r) {
  var n = r(18),
      i = r(68),
      o = r(69),
      s = n ? n.toStringTag : void 0;

  t.exports = function (t) {
    return null == t ? void 0 === t ? "[object Undefined]" : "[object Null]" : s && s in Object(t) ? i(t) : o(t);
  };
}, function (t, e) {
  t.exports = function (t, e) {
    return t === e || t != t && e != e;
  };
}, function (t, e, r) {
  t.exports = r(33);
}, function (t, e, r) {
  "use strict";

  var n = r(34),
      i = function (t, e) {
    return new n.Converter(t, e);
  };

  i.csv = i, i.Converter = n.Converter, t.exports = i;
}, function (t, e, r) {
  "use strict";

  (function (t) {
    var n = this && this.__extends || function () {
      var t = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
      };

      return function (e, r) {
        function n() {
          this.constructor = e;
        }

        t(e, r), e.prototype = null === r ? Object.create(r) : (n.prototype = r.prototype, new n());
      };
    }(),
        i = this && this.__importDefault || function (t) {
      return t && t.__esModule ? t : {
        default: t
      };
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });

    var o = r(36),
        s = r(50),
        a = r(51),
        u = i(r(15)),
        c = r(52),
        l = r(105),
        f = function (e) {
      function i(r, n) {
        void 0 === n && (n = {});
        var i = e.call(this, n) || this;
        return i.options = n, i.params = s.mergeParams(r), i.runtime = a.initParseRuntime(i), i.result = new l.Result(i), i.processor = new c.ProcessorLocal(i), i.once("error", function (e) {
          t(function () {
            i.result.processError(e), i.emit("done", e);
          });
        }), i.once("done", function () {
          i.processor.destroy();
        }), i;
      }

      return n(i, e), i.prototype.preRawData = function (t) {
        return this.runtime.preRawDataHook = t, this;
      }, i.prototype.preFileLine = function (t) {
        return this.runtime.preFileLineHook = t, this;
      }, i.prototype.subscribe = function (t, e, r) {
        return this.parseRuntime.subscribe = {
          onNext: t,
          onError: e,
          onCompleted: r
        }, this;
      }, i.prototype.fromFile = function (t, e) {
        var n = this,
            i = r(!function () {
          var t = new Error("Cannot find module 'fs'");
          throw t.code = "MODULE_NOT_FOUND", t;
        }());
        return i.exists(t, function (r) {
          r ? i.createReadStream(t, e).pipe(n) : n.emit("error", new Error("File does not exist. Check to make sure the file path to your csv is correct."));
        }), this;
      }, i.prototype.fromStream = function (t) {
        return t.pipe(this), this;
      }, i.prototype.fromString = function (t) {
        t.toString();
        var e = new o.Readable(),
            r = 0;
        return e._read = function (e) {
          if (r >= t.length) this.push(null);else {
            var n = t.substr(r, e);
            this.push(n), r += e;
          }
        }, this.fromStream(e);
      }, i.prototype.then = function (t, e) {
        var r = this;
        return new u.default(function (n, i) {
          r.parseRuntime.then = {
            onfulfilled: function (e) {
              n(t ? t(e) : e);
            },
            onrejected: function (t) {
              e ? n(e(t)) : i(t);
            }
          };
        });
      }, Object.defineProperty(i.prototype, "parseParam", {
        get: function () {
          return this.params;
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(i.prototype, "parseRuntime", {
        get: function () {
          return this.runtime;
        },
        enumerable: !0,
        configurable: !0
      }), i.prototype._transform = function (t, e, r) {
        var n = this;
        this.processor.process(t).then(function (t) {
          if (t.length > 0) return n.runtime.started = !0, n.result.processResult(t);
        }).then(function () {
          n.emit("drained"), r();
        }, function (t) {
          n.runtime.hasError = !0, n.runtime.error = t, n.emit("error", t), r();
        });
      }, i.prototype._flush = function (t) {
        var e = this;
        this.processor.flush().then(function (t) {
          if (t.length > 0) return e.result.processResult(t);
        }).then(function () {
          e.processEnd(t);
        }, function (r) {
          e.emit("error", r), t();
        });
      }, i.prototype.processEnd = function (t) {
        this.result.endProcess(), this.emit("done"), t();
      }, Object.defineProperty(i.prototype, "parsedLineNumber", {
        get: function () {
          return this.runtime.parsedLineNumber;
        },
        enumerable: !0,
        configurable: !0
      }), i;
    }(o.Transform);

    e.Converter = f;
  }).call(this, r(11).setImmediate);
}, function (t, e, r) {
  (function (t, e) {
    !function (t, r) {
      "use strict";

      if (!t.setImmediate) {
        var n,
            i = 1,
            o = {},
            s = !1,
            a = t.document,
            u = Object.getPrototypeOf && Object.getPrototypeOf(t);
        u = u && u.setTimeout ? u : t, "[object process]" === {}.toString.call(t.process) ? n = function (t) {
          e.nextTick(function () {
            l(t);
          });
        } : function () {
          if (t.postMessage && !t.importScripts) {
            var e = !0,
                r = t.onmessage;
            return t.onmessage = function () {
              e = !1;
            }, t.postMessage("", "*"), t.onmessage = r, e;
          }
        }() ? function () {
          var e = "setImmediate$" + Math.random() + "$",
              r = function (r) {
            r.source === t && "string" == typeof r.data && 0 === r.data.indexOf(e) && l(+r.data.slice(e.length));
          };

          t.addEventListener ? t.addEventListener("message", r, !1) : t.attachEvent("onmessage", r), n = function (r) {
            t.postMessage(e + r, "*");
          };
        }() : t.MessageChannel ? function () {
          var t = new MessageChannel();
          t.port1.onmessage = function (t) {
            l(t.data);
          }, n = function (e) {
            t.port2.postMessage(e);
          };
        }() : a && "onreadystatechange" in a.createElement("script") ? function () {
          var t = a.documentElement;

          n = function (e) {
            var r = a.createElement("script");
            r.onreadystatechange = function () {
              l(e), r.onreadystatechange = null, t.removeChild(r), r = null;
            }, t.appendChild(r);
          };
        }() : n = function (t) {
          setTimeout(l, 0, t);
        }, u.setImmediate = function (t) {
          "function" != typeof t && (t = new Function("" + t));

          for (var e = new Array(arguments.length - 1), r = 0; r < e.length; r++) e[r] = arguments[r + 1];

          var s = {
            callback: t,
            args: e
          };
          return o[i] = s, n(i), i++;
        }, u.clearImmediate = c;
      }

      function c(t) {
        delete o[t];
      }

      function l(t) {
        if (s) setTimeout(l, 0, t);else {
          var e = o[t];

          if (e) {
            s = !0;

            try {
              !function (t) {
                var e = t.callback,
                    n = t.args;

                switch (n.length) {
                  case 0:
                    e();
                    break;

                  case 1:
                    e(n[0]);
                    break;

                  case 2:
                    e(n[0], n[1]);
                    break;

                  case 3:
                    e(n[0], n[1], n[2]);
                    break;

                  default:
                    e.apply(r, n);
                }
              }(e);
            } finally {
              c(t), s = !1;
            }
          }
        }
      }
    }("undefined" == typeof self ? void 0 === t ? this : t : self);
  }).call(this, r(0), r(4));
}, function (t, e, r) {
  t.exports = i;
  var n = r(12).EventEmitter;

  function i() {
    n.call(this);
  }

  r(2)(i, n), i.Readable = r(13), i.Writable = r(46), i.Duplex = r(47), i.Transform = r(48), i.PassThrough = r(49), i.Stream = i, i.prototype.pipe = function (t, e) {
    var r = this;

    function i(e) {
      t.writable && !1 === t.write(e) && r.pause && r.pause();
    }

    function o() {
      r.readable && r.resume && r.resume();
    }

    r.on("data", i), t.on("drain", o), t._isStdio || e && !1 === e.end || (r.on("end", a), r.on("close", u));
    var s = !1;

    function a() {
      s || (s = !0, t.end());
    }

    function u() {
      s || (s = !0, "function" == typeof t.destroy && t.destroy());
    }

    function c(t) {
      if (l(), 0 === n.listenerCount(this, "error")) throw t;
    }

    function l() {
      r.removeListener("data", i), t.removeListener("drain", o), r.removeListener("end", a), r.removeListener("close", u), r.removeListener("error", c), t.removeListener("error", c), r.removeListener("end", l), r.removeListener("close", l), t.removeListener("close", l);
    }

    return r.on("error", c), t.on("error", c), r.on("end", l), r.on("close", l), t.on("close", l), t.emit("pipe", r), t;
  };
}, function (t, e) {
  var r = {}.toString;

  t.exports = Array.isArray || function (t) {
    return "[object Array]" == r.call(t);
  };
}, function (t, e, r) {
  "use strict";

  e.byteLength = function (t) {
    var e = c(t),
        r = e[0],
        n = e[1];
    return 3 * (r + n) / 4 - n;
  }, e.toByteArray = function (t) {
    for (var e, r = c(t), n = r[0], s = r[1], a = new o(3 * (n + s) / 4 - s), u = 0, l = s > 0 ? n - 4 : n, f = 0; f < l; f += 4) e = i[t.charCodeAt(f)] << 18 | i[t.charCodeAt(f + 1)] << 12 | i[t.charCodeAt(f + 2)] << 6 | i[t.charCodeAt(f + 3)], a[u++] = e >> 16 & 255, a[u++] = e >> 8 & 255, a[u++] = 255 & e;

    return 2 === s && (e = i[t.charCodeAt(f)] << 2 | i[t.charCodeAt(f + 1)] >> 4, a[u++] = 255 & e), 1 === s && (e = i[t.charCodeAt(f)] << 10 | i[t.charCodeAt(f + 1)] << 4 | i[t.charCodeAt(f + 2)] >> 2, a[u++] = e >> 8 & 255, a[u++] = 255 & e), a;
  }, e.fromByteArray = function (t) {
    for (var e, r = t.length, i = r % 3, o = [], s = 0, a = r - i; s < a; s += 16383) o.push(f(t, s, s + 16383 > a ? a : s + 16383));

    return 1 === i ? (e = t[r - 1], o.push(n[e >> 2] + n[e << 4 & 63] + "==")) : 2 === i && (e = (t[r - 2] << 8) + t[r - 1], o.push(n[e >> 10] + n[e >> 4 & 63] + n[e << 2 & 63] + "=")), o.join("");
  };

  for (var n = [], i = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, u = s.length; a < u; ++a) n[a] = s[a], i[s.charCodeAt(a)] = a;

  function c(t) {
    var e = t.length;
    if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    var r = t.indexOf("=");
    return -1 === r && (r = e), [r, r === e ? 0 : 4 - r % 4];
  }

  function l(t) {
    return n[t >> 18 & 63] + n[t >> 12 & 63] + n[t >> 6 & 63] + n[63 & t];
  }

  function f(t, e, r) {
    for (var n, i = [], o = e; o < r; o += 3) n = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (255 & t[o + 2]), i.push(l(n));

    return i.join("");
  }

  i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63;
}, function (t, e) {
  e.read = function (t, e, r, n, i) {
    var o,
        s,
        a = 8 * i - n - 1,
        u = (1 << a) - 1,
        c = u >> 1,
        l = -7,
        f = r ? i - 1 : 0,
        h = r ? -1 : 1,
        p = t[e + f];

    for (f += h, o = p & (1 << -l) - 1, p >>= -l, l += a; l > 0; o = 256 * o + t[e + f], f += h, l -= 8);

    for (s = o & (1 << -l) - 1, o >>= -l, l += n; l > 0; s = 256 * s + t[e + f], f += h, l -= 8);

    if (0 === o) o = 1 - c;else {
      if (o === u) return s ? NaN : 1 / 0 * (p ? -1 : 1);
      s += Math.pow(2, n), o -= c;
    }
    return (p ? -1 : 1) * s * Math.pow(2, o - n);
  }, e.write = function (t, e, r, n, i, o) {
    var s,
        a,
        u,
        c = 8 * o - i - 1,
        l = (1 << c) - 1,
        f = l >> 1,
        h = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
        p = n ? 0 : o - 1,
        d = n ? 1 : -1,
        _ = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;

    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0, s = l) : (s = Math.floor(Math.log(e) / Math.LN2), e * (u = Math.pow(2, -s)) < 1 && (s--, u *= 2), (e += s + f >= 1 ? h / u : h * Math.pow(2, 1 - f)) * u >= 2 && (s++, u /= 2), s + f >= l ? (a = 0, s = l) : s + f >= 1 ? (a = (e * u - 1) * Math.pow(2, i), s += f) : (a = e * Math.pow(2, f - 1) * Math.pow(2, i), s = 0)); i >= 8; t[r + p] = 255 & a, p += d, a /= 256, i -= 8);

    for (s = s << i | a, c += i; c > 0; t[r + p] = 255 & s, p += d, s /= 256, c -= 8);

    t[r + p - d] |= 128 * _;
  };
}, function (t, e) {
  var r = {}.toString;

  t.exports = Array.isArray || function (t) {
    return "[object Array]" == r.call(t);
  };
}, function (t, e) {}, function (t, e, r) {
  "use strict";

  var n = r(7).Buffer,
      i = r(43);

  function o(t, e, r) {
    t.copy(e, r);
  }

  t.exports = function () {
    function t() {
      !function (t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
      }(this, t), this.head = null, this.tail = null, this.length = 0;
    }

    return t.prototype.push = function (t) {
      var e = {
        data: t,
        next: null
      };
      this.length > 0 ? this.tail.next = e : this.head = e, this.tail = e, ++this.length;
    }, t.prototype.unshift = function (t) {
      var e = {
        data: t,
        next: this.head
      };
      0 === this.length && (this.tail = e), this.head = e, ++this.length;
    }, t.prototype.shift = function () {
      if (0 !== this.length) {
        var t = this.head.data;
        return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, t;
      }
    }, t.prototype.clear = function () {
      this.head = this.tail = null, this.length = 0;
    }, t.prototype.join = function (t) {
      if (0 === this.length) return "";

      for (var e = this.head, r = "" + e.data; e = e.next;) r += t + e.data;

      return r;
    }, t.prototype.concat = function (t) {
      if (0 === this.length) return n.alloc(0);
      if (1 === this.length) return this.head.data;

      for (var e = n.allocUnsafe(t >>> 0), r = this.head, i = 0; r;) o(r.data, e, i), i += r.data.length, r = r.next;

      return e;
    }, t;
  }(), i && i.inspect && i.inspect.custom && (t.exports.prototype[i.inspect.custom] = function () {
    var t = i.inspect({
      length: this.length
    });
    return this.constructor.name + " " + t;
  });
}, function (t, e) {}, function (t, e, r) {
  (function (e) {
    function r(t) {
      try {
        if (!e.localStorage) return !1;
      } catch (t) {
        return !1;
      }

      var r = e.localStorage[t];
      return null != r && "true" === String(r).toLowerCase();
    }

    t.exports = function (t, e) {
      if (r("noDeprecation")) return t;
      var n = !1;
      return function () {
        if (!n) {
          if (r("throwDeprecation")) throw new Error(e);
          r("traceDeprecation") ? console.trace(e) : console.warn(e), n = !0;
        }

        return t.apply(this, arguments);
      };
    };
  }).call(this, r(0));
}, function (t, e, r) {
  "use strict";

  t.exports = o;
  var n = r(27),
      i = r(5);

  function o(t) {
    if (!(this instanceof o)) return new o(t);
    n.call(this, t);
  }

  i.inherits = r(2), i.inherits(o, n), o.prototype._transform = function (t, e, r) {
    r(null, t);
  };
}, function (t, e, r) {
  t.exports = r(14);
}, function (t, e, r) {
  t.exports = r(1);
}, function (t, e, r) {
  t.exports = r(13).Transform;
}, function (t, e, r) {
  t.exports = r(13).PassThrough;
}, function (t, e, r) {
  "use strict";

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.mergeParams = function (t) {
    var e = {
      delimiter: ",",
      ignoreColumns: void 0,
      includeColumns: void 0,
      quote: '"',
      trim: !0,
      checkType: !1,
      ignoreEmpty: !1,
      noheader: !1,
      headers: void 0,
      flatKeys: !1,
      maxRowLength: 0,
      checkColumn: !1,
      escape: '"',
      colParser: {},
      eol: void 0,
      alwaysSplitAtEOL: !1,
      output: "json",
      nullObject: !1,
      downstreamFormat: "line",
      needEmitAll: !0
    };

    for (var r in t || (t = {}), t) t.hasOwnProperty(r) && (Array.isArray(t[r]) ? e[r] = [].concat(t[r]) : e[r] = t[r]);

    return e;
  };
}, function (t, e, r) {
  "use strict";

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.initParseRuntime = function (t) {
    var e = t.parseParam,
        r = {
      needProcessIgnoreColumn: !1,
      needProcessIncludeColumn: !1,
      selectedColumns: void 0,
      ended: !1,
      hasError: !1,
      error: void 0,
      delimiter: t.parseParam.delimiter,
      eol: t.parseParam.eol,
      columnConv: [],
      headerType: [],
      headerTitle: [],
      headerFlag: [],
      headers: void 0,
      started: !1,
      parsedLineNumber: 0,
      columnValueSetter: []
    };
    return e.ignoreColumns && (r.needProcessIgnoreColumn = !0), e.includeColumns && (r.needProcessIncludeColumn = !0), r;
  };
}, function (t, e, r) {
  "use strict";

  (function (t) {
    var n = this && this.__extends || function () {
      var t = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
      };

      return function (e, r) {
        function n() {
          this.constructor = e;
        }

        t(e, r), e.prototype = null === r ? Object.create(r) : (n.prototype = r.prototype, new n());
      };
    }(),
        i = this && this.__importDefault || function (t) {
      return t && t.__esModule ? t : {
        default: t
      };
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });

    var o = r(53),
        s = i(r(15)),
        a = r(54),
        u = i(r(16)),
        c = r(57),
        l = r(28),
        f = r(58),
        h = i(r(59)),
        p = i(r(29)),
        d = function (e) {
      function r() {
        var t = null !== e && e.apply(this, arguments) || this;
        return t.rowSplit = new f.RowSplit(t.converter), t.eolEmitted = !1, t._needEmitEol = void 0, t.headEmitted = !1, t._needEmitHead = void 0, t;
      }

      return n(r, e), r.prototype.flush = function () {
        var t = this;

        if (this.runtime.csvLineBuffer && this.runtime.csvLineBuffer.length > 0) {
          var e = this.runtime.csvLineBuffer;
          return this.runtime.csvLineBuffer = void 0, this.process(e, !0).then(function (e) {
            return t.runtime.csvLineBuffer && t.runtime.csvLineBuffer.length > 0 ? s.default.reject(p.default.unclosed_quote(t.runtime.parsedLineNumber, t.runtime.csvLineBuffer.toString())) : s.default.resolve(e);
          });
        }

        return s.default.resolve([]);
      }, r.prototype.destroy = function () {
        return s.default.resolve();
      }, Object.defineProperty(r.prototype, "needEmitEol", {
        get: function () {
          return void 0 === this._needEmitEol && (this._needEmitEol = this.converter.listeners("eol").length > 0), this._needEmitEol;
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(r.prototype, "needEmitHead", {
        get: function () {
          return void 0 === this._needEmitHead && (this._needEmitHead = this.converter.listeners("header").length > 0), this._needEmitHead;
        },
        enumerable: !0,
        configurable: !0
      }), r.prototype.process = function (t, e) {
        var r,
            n = this;
        return void 0 === e && (e = !1), r = e ? t.toString() : a.prepareData(t, this.converter.parseRuntime), s.default.resolve().then(function () {
          return n.runtime.preRawDataHook ? n.runtime.preRawDataHook(r) : r;
        }).then(function (t) {
          return t && t.length > 0 ? n.processCSV(t, e) : s.default.resolve([]);
        });
      }, r.prototype.processCSV = function (t, e) {
        var r = this,
            n = this.params,
            i = this.runtime;
        i.eol || u.default(t, i), this.needEmitEol && !this.eolEmitted && i.eol && (this.converter.emit("eol", i.eol), this.eolEmitted = !0), n.ignoreEmpty && !i.started && (t = l.trimLeft(t));
        var o = c.stringToLines(t, i);
        return e ? (o.lines.push(o.partial), o.partial = "") : this.prependLeftBuf(l.bufFromString(o.partial)), o.lines.length > 0 ? (i.preFileLineHook ? this.runPreLineHook(o.lines) : s.default.resolve(o.lines)).then(function (t) {
          return i.started || r.runtime.headers ? r.processCSVBody(t) : r.processDataWithHead(t);
        }) : s.default.resolve([]);
      }, r.prototype.processDataWithHead = function (t) {
        if (this.params.noheader) this.params.headers ? this.runtime.headers = this.params.headers : this.runtime.headers = [];else {
          for (var e = "", r = []; t.length;) {
            var n = e + t.shift(),
                i = this.rowSplit.parse(n);

            if (i.closed) {
              r = i.cells, e = "";
              break;
            }

            e = n + u.default(n, this.runtime);
          }

          if (this.prependLeftBuf(l.bufFromString(e)), 0 === r.length) return [];
          this.params.headers ? this.runtime.headers = this.params.headers : this.runtime.headers = r;
        }
        return (this.runtime.needProcessIgnoreColumn || this.runtime.needProcessIncludeColumn) && this.filterHeader(), this.needEmitHead && !this.headEmitted && (this.converter.emit("header", this.runtime.headers), this.headEmitted = !0), this.processCSVBody(t);
      }, r.prototype.filterHeader = function () {
        if (this.runtime.selectedColumns = [], this.runtime.headers) {
          for (var t = this.runtime.headers, e = 0; e < t.length; e++) if (this.params.ignoreColumns) {
            if (this.params.ignoreColumns.test(t[e])) {
              if (!this.params.includeColumns || !this.params.includeColumns.test(t[e])) continue;
              this.runtime.selectedColumns.push(e);
            } else this.runtime.selectedColumns.push(e);
          } else this.params.includeColumns ? this.params.includeColumns.test(t[e]) && this.runtime.selectedColumns.push(e) : this.runtime.selectedColumns.push(e);

          this.runtime.headers = l.filterArray(this.runtime.headers, this.runtime.selectedColumns);
        }
      }, r.prototype.processCSVBody = function (t) {
        if ("line" === this.params.output) return t;
        var e = this.rowSplit.parseMultiLines(t);
        return this.prependLeftBuf(l.bufFromString(e.partial)), "csv" === this.params.output ? e.rowsCells : h.default(e.rowsCells, this.converter);
      }, r.prototype.prependLeftBuf = function (e) {
        e && (this.runtime.csvLineBuffer ? this.runtime.csvLineBuffer = t.concat([e, this.runtime.csvLineBuffer]) : this.runtime.csvLineBuffer = e);
      }, r.prototype.runPreLineHook = function (t) {
        var e = this;
        return new s.default(function (r, n) {
          !function t(e, r, n, i) {
            if (n >= e.length) i();else if (r.preFileLineHook) {
              var o = e[n],
                  s = r.preFileLineHook(o, r.parsedLineNumber + n);
              if (n++, s && s.then) s.then(function (o) {
                e[n - 1] = o, t(e, r, n, i);
              });else {
                for (e[n - 1] = s; n < e.length;) e[n] = r.preFileLineHook(e[n], r.parsedLineNumber + n), n++;

                i();
              }
            } else i();
          }(t, e.runtime, 0, function (e) {
            e ? n(e) : r(t);
          });
        });
      }, r;
    }(o.Processor);

    e.ProcessorLocal = d;
  }).call(this, r(3).Buffer);
}, function (t, e, r) {
  "use strict";

  Object.defineProperty(e, "__esModule", {
    value: !0
  });

  var n = function (t) {
    this.converter = t, this.params = t.parseParam, this.runtime = t.parseRuntime;
  };

  e.Processor = n;
}, function (t, e, r) {
  "use strict";

  (function (t) {
    var n = this && this.__importDefault || function (t) {
      return t && t.__esModule ? t : {
        default: t
      };
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(r(55));

    e.prepareData = function (e, r) {
      var n = function (e, r) {
        return r.csvLineBuffer && r.csvLineBuffer.length > 0 ? t.concat([r.csvLineBuffer, e]) : e;
      }(e, r);

      r.csvLineBuffer = void 0;

      var o = function (t, e) {
        var r = t.length - 1;

        if (0 != (128 & t[r])) {
          for (; 128 == (192 & t[r]);) r--;

          r--;
        }

        return r != t.length - 1 ? (e.csvLineBuffer = t.slice(r + 1), t.slice(0, r + 1)) : t;
      }(n, r).toString("utf8");

      return !1 === r.started ? i.default(o) : o;
    };
  }).call(this, r(3).Buffer);
}, function (t, e, r) {
  "use strict";

  (function (e) {
    var n = r(56);

    t.exports = function (t) {
      return "string" == typeof t && 65279 === t.charCodeAt(0) ? t.slice(1) : e.isBuffer(t) && n(t) && 239 === t[0] && 187 === t[1] && 191 === t[2] ? t.slice(3) : t;
    };
  }).call(this, r(3).Buffer);
}, function (t, e) {
  t.exports = function (t) {
    for (var e = 0; e < t.length;) if (9 == t[e] || 10 == t[e] || 13 == t[e] || 32 <= t[e] && t[e] <= 126) e += 1;else if (194 <= t[e] && t[e] <= 223 && 128 <= t[e + 1] && t[e + 1] <= 191) e += 2;else if (224 == t[e] && 160 <= t[e + 1] && t[e + 1] <= 191 && 128 <= t[e + 2] && t[e + 2] <= 191 || (225 <= t[e] && t[e] <= 236 || 238 == t[e] || 239 == t[e]) && 128 <= t[e + 1] && t[e + 1] <= 191 && 128 <= t[e + 2] && t[e + 2] <= 191 || 237 == t[e] && 128 <= t[e + 1] && t[e + 1] <= 159 && 128 <= t[e + 2] && t[e + 2] <= 191) e += 3;else {
      if (!(240 == t[e] && 144 <= t[e + 1] && t[e + 1] <= 191 && 128 <= t[e + 2] && t[e + 2] <= 191 && 128 <= t[e + 3] && t[e + 3] <= 191 || 241 <= t[e] && t[e] <= 243 && 128 <= t[e + 1] && t[e + 1] <= 191 && 128 <= t[e + 2] && t[e + 2] <= 191 && 128 <= t[e + 3] && t[e + 3] <= 191 || 244 == t[e] && 128 <= t[e + 1] && t[e + 1] <= 143 && 128 <= t[e + 2] && t[e + 2] <= 191 && 128 <= t[e + 3] && t[e + 3] <= 191)) return !1;
      e += 4;
    }

    return !0;
  };
}, function (t, e, r) {
  "use strict";

  var n = this && this.__importDefault || function (t) {
    return t && t.__esModule ? t : {
      default: t
    };
  };

  Object.defineProperty(e, "__esModule", {
    value: !0
  });
  var i = n(r(16));

  e.stringToLines = function (t, e) {
    var r = i.default(t, e),
        n = t.split(r);
    return {
      lines: n,
      partial: n.pop() || ""
    };
  };
}, function (t, e, r) {
  "use strict";

  var n = this && this.__importDefault || function (t) {
    return t && t.__esModule ? t : {
      default: t
    };
  };

  Object.defineProperty(e, "__esModule", {
    value: !0
  });

  var i = n(r(16)),
      o = r(28),
      s = [",", "|", "\t", ";", ":"],
      a = function () {
    function t(t) {
      this.conv = t, this.cachedRegExp = {}, this.delimiterEmitted = !1, this._needEmitDelimiter = void 0, this.quote = t.parseParam.quote, this.trim = t.parseParam.trim, this.escape = t.parseParam.escape;
    }

    return Object.defineProperty(t.prototype, "needEmitDelimiter", {
      get: function () {
        return void 0 === this._needEmitDelimiter && (this._needEmitDelimiter = this.conv.listeners("delimiter").length > 0), this._needEmitDelimiter;
      },
      enumerable: !0,
      configurable: !0
    }), t.prototype.parse = function (t) {
      if (0 === t.length || this.conv.parseParam.ignoreEmpty && 0 === t.trim().length) return {
        cells: [],
        closed: !0
      };
      var e = this.quote,
          r = this.trim;
      this.escape, (this.conv.parseRuntime.delimiter instanceof Array || "auto" === this.conv.parseRuntime.delimiter.toLowerCase()) && (this.conv.parseRuntime.delimiter = this.getDelimiter(t)), this.needEmitDelimiter && !this.delimiterEmitted && (this.conv.emit("delimiter", this.conv.parseRuntime.delimiter), this.delimiterEmitted = !0);
      var n = this.conv.parseRuntime.delimiter,
          i = t.split(n);

      if ("off" === e) {
        if (r) for (var o = 0; o < i.length; o++) i[o] = i[o].trim();
        return {
          cells: i,
          closed: !0
        };
      }

      return this.toCSVRow(i, r, e, n);
    }, t.prototype.toCSVRow = function (t, e, r, n) {
      for (var i = [], s = !1, a = "", u = 0, c = t.length; u < c; u++) {
        var l = t[u];
        !s && e && (l = o.trimLeft(l));
        var f = l.length;
        if (s) this.isQuoteClose(l) ? (s = !1, a += n + (l = l.substr(0, f - 1)), a = this.escapeQuote(a), e && (a = o.trimRight(a)), i.push(a), a = "") : a += n + l;else {
          if (2 === f && l === this.quote + this.quote) {
            i.push("");
            continue;
          }

          if (this.isQuoteOpen(l)) {
            if (l = l.substr(1), this.isQuoteClose(l)) {
              l = l.substring(0, l.lastIndexOf(r)), l = this.escapeQuote(l), i.push(l);
              continue;
            }

            if (-1 !== l.indexOf(r)) {
              for (var h = 0, p = "", d = 0, _ = l; d < _.length; d++) {
                var v = _[d];
                v === r && p !== this.escape ? (h++, p = "") : p = v;
              }

              if (h % 2 == 1) {
                e && (l = o.trimRight(l)), i.push(r + l);
                continue;
              }

              s = !0, a += l;
              continue;
            }

            s = !0, a += l;
            continue;
          }

          e && (l = o.trimRight(l)), i.push(l);
        }
      }

      return {
        cells: i,
        closed: !s
      };
    }, t.prototype.getDelimiter = function (t) {
      var e;
      if ("auto" === this.conv.parseParam.delimiter) e = s;else {
        if (!(this.conv.parseParam.delimiter instanceof Array)) return this.conv.parseParam.delimiter;
        e = this.conv.parseParam.delimiter;
      }
      var r = 0,
          n = ",";
      return e.forEach(function (e) {
        var i = t.split(e).length;
        i > r && (n = e, r = i);
      }), n;
    }, t.prototype.isQuoteOpen = function (t) {
      var e = this.quote,
          r = this.escape;
      return t[0] === e && (t[1] !== e || t[1] === r && (t[2] === e || 2 === t.length));
    }, t.prototype.isQuoteClose = function (t) {
      var e = this.quote,
          r = this.escape;
      this.conv.parseParam.trim && (t = o.trimRight(t));

      for (var n = 0, i = t.length - 1; t[i] === e || t[i] === r;) i--, n++;

      return n % 2 != 0;
    }, t.prototype.escapeQuote = function (t) {
      var e = "es|" + this.quote + "|" + this.escape;
      void 0 === this.cachedRegExp[e] && (this.cachedRegExp[e] = new RegExp("\\" + this.escape + "\\" + this.quote, "g"));
      var r = this.cachedRegExp[e];
      return t.replace(r, this.quote);
    }, t.prototype.parseMultiLines = function (t) {
      for (var e = [], r = ""; t.length;) {
        var n = r + t.shift(),
            s = this.parse(n);
        0 === s.cells.length && this.conv.parseParam.ignoreEmpty || (s.closed || this.conv.parseParam.alwaysSplitAtEOL ? (this.conv.parseRuntime.selectedColumns ? e.push(o.filterArray(s.cells, this.conv.parseRuntime.selectedColumns)) : e.push(s.cells), r = "") : r = n + (i.default(n, this.conv.parseRuntime) || "\n"));
      }

      return {
        rowsCells: e,
        partial: r
      };
    }, t;
  }();

  e.RowSplit = a;
}, function (t, e, r) {
  "use strict";

  var n = this && this.__importDefault || function (t) {
    return t && t.__esModule ? t : {
      default: t
    };
  };

  Object.defineProperty(e, "__esModule", {
    value: !0
  });
  var i = n(r(29)),
      o = n(r(60)),
      s = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;

  function a(t, e, r) {
    if (e.parseParam.checkColumn && e.parseRuntime.headers && t.length !== e.parseRuntime.headers.length) throw i.default.column_mismatched(e.parseRuntime.parsedLineNumber + r);
    return function (t, e, r) {
      for (var n = !1, i = {}, o = 0, s = t.length; o < s; o++) {
        var a = t[o];

        if (!r.parseParam.ignoreEmpty || "" !== a) {
          n = !0;
          var u = e[o];
          u && "" !== u || (u = e[o] = "field" + (o + 1));
          var f = c(u, o, r);

          if (f) {
            var h = f(a, u, i, t, o);
            void 0 !== h && l(i, u, h, r, o);
          } else {
            if (r.parseParam.checkType) a = p(a, u, o, r)(a);
            void 0 !== a && l(i, u, a, r, o);
          }
        }
      }

      return n ? i : null;
    }(t, e.parseRuntime.headers || [], e) || null;
  }

  e.default = function (t, e) {
    for (var r = [], n = 0, i = t.length; n < i; n++) {
      var o = a(t[n], e, n);
      o && r.push(o);
    }

    return r;
  };

  var u = {
    string: _,
    number: d,
    omit: function () {}
  };

  function c(t, e, r) {
    if (void 0 !== r.parseRuntime.columnConv[e]) return r.parseRuntime.columnConv[e];
    var n = r.parseParam.colParser[t];
    if (void 0 === n) return r.parseRuntime.columnConv[e] = null;

    if ("object" == _typeof(n) && (n = n.cellParser || "string"), "string" == typeof n) {
      n = n.trim().toLowerCase();
      var i = u[n];
      return r.parseRuntime.columnConv[e] = i || null;
    }

    return r.parseRuntime.columnConv[e] = "function" == typeof n ? n : null;
  }

  function l(t, e, r, n, i) {
    if (!n.parseRuntime.columnValueSetter[i]) if (n.parseParam.flatKeys) n.parseRuntime.columnValueSetter[i] = f;else if (e.indexOf(".") > -1) {
      for (var o = e.split("."), s = !0; o.length > 0;) if (0 === o.shift().length) {
        s = !1;
        break;
      }

      !s || n.parseParam.colParser[e] && n.parseParam.colParser[e].flat ? n.parseRuntime.columnValueSetter[i] = f : n.parseRuntime.columnValueSetter[i] = h;
    } else n.parseRuntime.columnValueSetter[i] = f;
    !0 === n.parseParam.nullObject && "null" === r && (r = null), n.parseRuntime.columnValueSetter[i](t, e, r);
  }

  function f(t, e, r) {
    t[e] = r;
  }

  function h(t, e, r) {
    o.default(t, e, r);
  }

  function p(t, e, r, n) {
    return n.parseRuntime.headerType[r] ? n.parseRuntime.headerType[r] : e.indexOf("number#!") > -1 ? n.parseRuntime.headerType[r] = d : e.indexOf("string#!") > -1 ? n.parseRuntime.headerType[r] = _ : n.parseParam.checkType ? n.parseRuntime.headerType[r] = v : n.parseRuntime.headerType[r] = _;
  }

  function d(t) {
    var e = parseFloat(t);
    return isNaN(e) ? t : e;
  }

  function _(t) {
    return t.toString();
  }

  function v(t) {
    var e = t.trim();
    return "" === e ? _(t) : s.test(e) ? d(t) : 5 === e.length && "false" === e.toLowerCase() || 4 === e.length && "true" === e.toLowerCase() ? function (t) {
      var e = t.trim();
      return 5 !== e.length || "false" !== e.toLowerCase();
    }(t) : "{" === e[0] && "}" === e[e.length - 1] || "[" === e[0] && "]" === e[e.length - 1] ? function (t) {
      try {
        return JSON.parse(t);
      } catch (e) {
        return t;
      }
    }(t) : _(t);
  }
}, function (t, e, r) {
  var n = r(61);

  t.exports = function (t, e, r) {
    return null == t ? t : n(t, e, r);
  };
}, function (t, e, r) {
  var n = r(62),
      i = r(74),
      o = r(103),
      s = r(20),
      a = r(104);

  t.exports = function (t, e, r, u) {
    if (!s(t)) return t;

    for (var c = -1, l = (e = i(e, t)).length, f = l - 1, h = t; null != h && ++c < l;) {
      var p = a(e[c]),
          d = r;

      if (c != f) {
        var _ = h[p];
        void 0 === (d = u ? u(_, p, h) : void 0) && (d = s(_) ? _ : o(e[c + 1]) ? [] : {});
      }

      n(h, p, d), h = h[p];
    }

    return t;
  };
}, function (t, e, r) {
  var n = r(63),
      i = r(31),
      o = Object.prototype.hasOwnProperty;

  t.exports = function (t, e, r) {
    var s = t[e];
    o.call(t, e) && i(s, r) && (void 0 !== r || e in t) || n(t, e, r);
  };
}, function (t, e, r) {
  var n = r(64);

  t.exports = function (t, e, r) {
    "__proto__" == e && n ? n(t, e, {
      configurable: !0,
      enumerable: !0,
      value: r,
      writable: !0
    }) : t[e] = r;
  };
}, function (t, e, r) {
  var n = r(17),
      i = function () {
    try {
      var t = n(Object, "defineProperty");
      return t({}, "", {}), t;
    } catch (t) {}
  }();

  t.exports = i;
}, function (t, e, r) {
  var n = r(66),
      i = r(70),
      o = r(20),
      s = r(72),
      a = /^\[object .+?Constructor\]$/,
      u = Function.prototype,
      c = Object.prototype,
      l = u.toString,
      f = c.hasOwnProperty,
      h = RegExp("^" + l.call(f).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");

  t.exports = function (t) {
    return !(!o(t) || i(t)) && (n(t) ? h : a).test(s(t));
  };
}, function (t, e, r) {
  var n = r(30),
      i = r(20);

  t.exports = function (t) {
    if (!i(t)) return !1;
    var e = n(t);
    return "[object Function]" == e || "[object GeneratorFunction]" == e || "[object AsyncFunction]" == e || "[object Proxy]" == e;
  };
}, function (t, e, r) {
  (function (e) {
    var r = "object" == _typeof(e) && e && e.Object === Object && e;
    t.exports = r;
  }).call(this, r(0));
}, function (t, e, r) {
  var n = r(18),
      i = Object.prototype,
      o = i.hasOwnProperty,
      s = i.toString,
      a = n ? n.toStringTag : void 0;

  t.exports = function (t) {
    var e = o.call(t, a),
        r = t[a];

    try {
      t[a] = void 0;
      var n = !0;
    } catch (t) {}

    var i = s.call(t);
    return n && (e ? t[a] = r : delete t[a]), i;
  };
}, function (t, e) {
  var r = Object.prototype.toString;

  t.exports = function (t) {
    return r.call(t);
  };
}, function (t, e, r) {
  var n = r(71),
      i = function () {
    var t = /[^.]+$/.exec(n && n.keys && n.keys.IE_PROTO || "");
    return t ? "Symbol(src)_1." + t : "";
  }();

  t.exports = function (t) {
    return !!i && i in t;
  };
}, function (t, e, r) {
  var n = r(19)["__core-js_shared__"];
  t.exports = n;
}, function (t, e) {
  var r = Function.prototype.toString;

  t.exports = function (t) {
    if (null != t) {
      try {
        return r.call(t);
      } catch (t) {}

      try {
        return t + "";
      } catch (t) {}
    }

    return "";
  };
}, function (t, e) {
  t.exports = function (t, e) {
    return null == t ? void 0 : t[e];
  };
}, function (t, e, r) {
  var n = r(21),
      i = r(75),
      o = r(77),
      s = r(100);

  t.exports = function (t, e) {
    return n(t) ? t : i(t, e) ? [t] : o(s(t));
  };
}, function (t, e, r) {
  var n = r(21),
      i = r(22),
      o = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      s = /^\w*$/;

  t.exports = function (t, e) {
    if (n(t)) return !1;

    var r = _typeof(t);

    return !("number" != r && "symbol" != r && "boolean" != r && null != t && !i(t)) || s.test(t) || !o.test(t) || null != e && t in Object(e);
  };
}, function (t, e) {
  t.exports = function (t) {
    return null != t && "object" == _typeof(t);
  };
}, function (t, e, r) {
  var n = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      i = /\\(\\)?/g,
      o = r(78)(function (t) {
    var e = [];
    return 46 === t.charCodeAt(0) && e.push(""), t.replace(n, function (t, r, n, o) {
      e.push(n ? o.replace(i, "$1") : r || t);
    }), e;
  });
  t.exports = o;
}, function (t, e, r) {
  var n = r(79);

  t.exports = function (t) {
    var e = n(t, function (t) {
      return 500 === r.size && r.clear(), t;
    }),
        r = e.cache;
    return e;
  };
}, function (t, e, r) {
  var n = r(80),
      i = "Expected a function";

  function o(t, e) {
    if ("function" != typeof t || null != e && "function" != typeof e) throw new TypeError(i);

    var r = function () {
      var n = arguments,
          i = e ? e.apply(this, n) : n[0],
          o = r.cache;
      if (o.has(i)) return o.get(i);
      var s = t.apply(this, n);
      return r.cache = o.set(i, s) || o, s;
    };

    return r.cache = new (o.Cache || n)(), r;
  }

  o.Cache = n, t.exports = o;
}, function (t, e, r) {
  var n = r(81),
      i = r(95),
      o = r(97),
      s = r(98),
      a = r(99);

  function u(t) {
    var e = -1,
        r = null == t ? 0 : t.length;

    for (this.clear(); ++e < r;) {
      var n = t[e];
      this.set(n[0], n[1]);
    }
  }

  u.prototype.clear = n, u.prototype.delete = i, u.prototype.get = o, u.prototype.has = s, u.prototype.set = a, t.exports = u;
}, function (t, e, r) {
  var n = r(82),
      i = r(88),
      o = r(94);

  t.exports = function () {
    this.size = 0, this.__data__ = {
      hash: new n(),
      map: new (o || i)(),
      string: new n()
    };
  };
}, function (t, e, r) {
  var n = r(83),
      i = r(84),
      o = r(85),
      s = r(86),
      a = r(87);

  function u(t) {
    var e = -1,
        r = null == t ? 0 : t.length;

    for (this.clear(); ++e < r;) {
      var n = t[e];
      this.set(n[0], n[1]);
    }
  }

  u.prototype.clear = n, u.prototype.delete = i, u.prototype.get = o, u.prototype.has = s, u.prototype.set = a, t.exports = u;
}, function (t, e, r) {
  var n = r(8);

  t.exports = function () {
    this.__data__ = n ? n(null) : {}, this.size = 0;
  };
}, function (t, e) {
  t.exports = function (t) {
    var e = this.has(t) && delete this.__data__[t];
    return this.size -= e ? 1 : 0, e;
  };
}, function (t, e, r) {
  var n = r(8),
      i = Object.prototype.hasOwnProperty;

  t.exports = function (t) {
    var e = this.__data__;

    if (n) {
      var r = e[t];
      return "__lodash_hash_undefined__" === r ? void 0 : r;
    }

    return i.call(e, t) ? e[t] : void 0;
  };
}, function (t, e, r) {
  var n = r(8),
      i = Object.prototype.hasOwnProperty;

  t.exports = function (t) {
    var e = this.__data__;
    return n ? void 0 !== e[t] : i.call(e, t);
  };
}, function (t, e, r) {
  var n = r(8);

  t.exports = function (t, e) {
    var r = this.__data__;
    return this.size += this.has(t) ? 0 : 1, r[t] = n && void 0 === e ? "__lodash_hash_undefined__" : e, this;
  };
}, function (t, e, r) {
  var n = r(89),
      i = r(90),
      o = r(91),
      s = r(92),
      a = r(93);

  function u(t) {
    var e = -1,
        r = null == t ? 0 : t.length;

    for (this.clear(); ++e < r;) {
      var n = t[e];
      this.set(n[0], n[1]);
    }
  }

  u.prototype.clear = n, u.prototype.delete = i, u.prototype.get = o, u.prototype.has = s, u.prototype.set = a, t.exports = u;
}, function (t, e) {
  t.exports = function () {
    this.__data__ = [], this.size = 0;
  };
}, function (t, e, r) {
  var n = r(9),
      i = Array.prototype.splice;

  t.exports = function (t) {
    var e = this.__data__,
        r = n(e, t);
    return !(r < 0 || (r == e.length - 1 ? e.pop() : i.call(e, r, 1), --this.size, 0));
  };
}, function (t, e, r) {
  var n = r(9);

  t.exports = function (t) {
    var e = this.__data__,
        r = n(e, t);
    return r < 0 ? void 0 : e[r][1];
  };
}, function (t, e, r) {
  var n = r(9);

  t.exports = function (t) {
    return n(this.__data__, t) > -1;
  };
}, function (t, e, r) {
  var n = r(9);

  t.exports = function (t, e) {
    var r = this.__data__,
        i = n(r, t);
    return i < 0 ? (++this.size, r.push([t, e])) : r[i][1] = e, this;
  };
}, function (t, e, r) {
  var n = r(17)(r(19), "Map");
  t.exports = n;
}, function (t, e, r) {
  var n = r(10);

  t.exports = function (t) {
    var e = n(this, t).delete(t);
    return this.size -= e ? 1 : 0, e;
  };
}, function (t, e) {
  t.exports = function (t) {
    var e = _typeof(t);

    return "string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t;
  };
}, function (t, e, r) {
  var n = r(10);

  t.exports = function (t) {
    return n(this, t).get(t);
  };
}, function (t, e, r) {
  var n = r(10);

  t.exports = function (t) {
    return n(this, t).has(t);
  };
}, function (t, e, r) {
  var n = r(10);

  t.exports = function (t, e) {
    var r = n(this, t),
        i = r.size;
    return r.set(t, e), this.size += r.size == i ? 0 : 1, this;
  };
}, function (t, e, r) {
  var n = r(101);

  t.exports = function (t) {
    return null == t ? "" : n(t);
  };
}, function (t, e, r) {
  var n = r(18),
      i = r(102),
      o = r(21),
      s = r(22),
      a = n ? n.prototype : void 0,
      u = a ? a.toString : void 0;

  t.exports = function t(e) {
    if ("string" == typeof e) return e;
    if (o(e)) return i(e, t) + "";
    if (s(e)) return u ? u.call(e) : "";
    var r = e + "";
    return "0" == r && 1 / e == -1 / 0 ? "-0" : r;
  };
}, function (t, e) {
  t.exports = function (t, e) {
    for (var r = -1, n = null == t ? 0 : t.length, i = Array(n); ++r < n;) i[r] = e(t[r], r, t);

    return i;
  };
}, function (t, e) {
  var r = /^(?:0|[1-9]\d*)$/;

  t.exports = function (t, e) {
    var n = _typeof(t);

    return !!(e = null == e ? 9007199254740991 : e) && ("number" == n || "symbol" != n && r.test(t)) && t > -1 && t % 1 == 0 && t < e;
  };
}, function (t, e, r) {
  var n = r(22);

  t.exports = function (t) {
    if ("string" == typeof t || n(t)) return t;
    var e = t + "";
    return "0" == e && 1 / t == -1 / 0 ? "-0" : e;
  };
}, function (t, e, r) {
  "use strict";

  var n = this && this.__importDefault || function (t) {
    return t && t.__esModule ? t : {
      default: t
    };
  };

  Object.defineProperty(e, "__esModule", {
    value: !0
  });

  var i = n(r(15)),
      o = r(106),
      s = function () {
    function t(t) {
      this.converter = t, this.finalResult = [];
    }

    return Object.defineProperty(t.prototype, "needEmitLine", {
      get: function () {
        return !!this.converter.parseRuntime.subscribe && !!this.converter.parseRuntime.subscribe.onNext || this.needPushDownstream;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "needPushDownstream", {
      get: function () {
        return void 0 === this._needPushDownstream && (this._needPushDownstream = this.converter.listeners("data").length > 0 || this.converter.listeners("readable").length > 0), this._needPushDownstream;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "needEmitAll", {
      get: function () {
        return !!this.converter.parseRuntime.then && this.converter.parseParam.needEmitAll;
      },
      enumerable: !0,
      configurable: !0
    }), t.prototype.processResult = function (t) {
      var e = this,
          r = this.converter.parseRuntime.parsedLineNumber;
      return this.needPushDownstream && "array" === this.converter.parseParam.downstreamFormat && 0 === r && a(this.converter, "[" + o.EOL), new i.default(function (r, n) {
        e.needEmitLine ? function t(e, r, n, i, o) {
          if (n >= e.length) o();else if (r.parseRuntime.subscribe && r.parseRuntime.subscribe.onNext) {
            var s = r.parseRuntime.subscribe.onNext,
                u = e[n],
                c = s(u, r.parseRuntime.parsedLineNumber + n);
            if (n++, c && c.then) c.then(function () {
              !function (e, r, n, i, o, s, u) {
                o && a(n, u), t(e, n, i, o, s);
              }(e, 0, r, n, i, o, u);
            }, o);else {
              for (i && a(r, u); n < e.length;) {
                var l = e[n];
                s(l, r.parseRuntime.parsedLineNumber + n), n++, i && a(r, l);
              }

              o();
            }
          } else {
            if (i) for (; n < e.length;) l = e[n++], a(r, l);
            o();
          }
        }(t, e.converter, 0, e.needPushDownstream, function (i) {
          i ? n(i) : (e.appendFinalResult(t), r());
        }) : (e.appendFinalResult(t), r());
      });
    }, t.prototype.appendFinalResult = function (t) {
      this.needEmitAll && (this.finalResult = this.finalResult.concat(t)), this.converter.parseRuntime.parsedLineNumber += t.length;
    }, t.prototype.processError = function (t) {
      this.converter.parseRuntime.subscribe && this.converter.parseRuntime.subscribe.onError && this.converter.parseRuntime.subscribe.onError(t), this.converter.parseRuntime.then && this.converter.parseRuntime.then.onrejected && this.converter.parseRuntime.then.onrejected(t);
    }, t.prototype.endProcess = function () {
      this.converter.parseRuntime.then && this.converter.parseRuntime.then.onfulfilled && (this.needEmitAll ? this.converter.parseRuntime.then.onfulfilled(this.finalResult) : this.converter.parseRuntime.then.onfulfilled([])), this.converter.parseRuntime.subscribe && this.converter.parseRuntime.subscribe.onCompleted && this.converter.parseRuntime.subscribe.onCompleted(), this.needPushDownstream && "array" === this.converter.parseParam.downstreamFormat && a(this.converter, "]" + o.EOL);
    }, t;
  }();

  function a(t, e) {
    if ("object" != _typeof(e) || t.options.objectMode) t.push(e);else {
      var r = JSON.stringify(e);
      t.push(r + ("array" === t.parseParam.downstreamFormat ? "," + o.EOL : o.EOL), "utf8");
    }
  }

  e.Result = s;
}, function (t, e) {
  e.endianness = function () {
    return "LE";
  }, e.hostname = function () {
    return "undefined" != typeof location ? location.hostname : "";
  }, e.loadavg = function () {
    return [];
  }, e.uptime = function () {
    return 0;
  }, e.freemem = function () {
    return Number.MAX_VALUE;
  }, e.totalmem = function () {
    return Number.MAX_VALUE;
  }, e.cpus = function () {
    return [];
  }, e.type = function () {
    return "Browser";
  }, e.release = function () {
    return "undefined" != typeof navigator ? navigator.appVersion : "";
  }, e.networkInterfaces = e.getNetworkInterfaces = function () {
    return {};
  }, e.arch = function () {
    return "javascript";
  }, e.platform = function () {
    return "browser";
  }, e.tmpdir = e.tmpDir = function () {
    return "/tmp";
  }, e.EOL = "\n", e.homedir = function () {
    return "/";
  };
}]);
},{}],"dEOc":[function(require,module,exports) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],"RonT":[function(require,module,exports) {
function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];

  if (null != _i) {
    var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;

    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) {
        ;
      }
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }
}

module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],"LGpM":[function(require,module,exports) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],"Vzqv":[function(require,module,exports) {
var arrayLikeToArray = require("./arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./arrayLikeToArray.js":"LGpM"}],"sa4T":[function(require,module,exports) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],"xkYc":[function(require,module,exports) {
var arrayWithHoles = require("./arrayWithHoles.js");

var iterableToArrayLimit = require("./iterableToArrayLimit.js");

var unsupportedIterableToArray = require("./unsupportedIterableToArray.js");

var nonIterableRest = require("./nonIterableRest.js");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./arrayWithHoles.js":"dEOc","./iterableToArrayLimit.js":"RonT","./unsupportedIterableToArray.js":"Vzqv","./nonIterableRest.js":"sa4T"}],"kUj2":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],"flex":[function(require,module,exports) {
var _typeof = require("./typeof.js")["default"];

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];

  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }

  return (hint === "string" ? String : Number)(input);
}

module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./typeof.js":"FlpK"}],"ZvLS":[function(require,module,exports) {
var _typeof = require("./typeof.js")["default"];

var toPrimitive = require("./toPrimitive.js");

function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}

module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./typeof.js":"FlpK","./toPrimitive.js":"flex"}],"dMjH":[function(require,module,exports) {
var toPropertyKey = require("./toPropertyKey.js");

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./toPropertyKey.js":"ZvLS"}],"XApn":[function(require,module,exports) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],"AQ4X":[function(require,module,exports) {
var getPrototypeOf = require("./getPrototypeOf.js");

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

module.exports = _superPropBase, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./getPrototypeOf.js":"XApn"}],"rXSD":[function(require,module,exports) {
var superPropBase = require("./superPropBase.js");

function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get.bind(), module.exports.__esModule = true, module.exports["default"] = module.exports;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }

      return desc.value;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }

  return _get.apply(this, arguments);
}

module.exports = _get, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./superPropBase.js":"AQ4X"}],"Omxx":[function(require,module,exports) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],"PhTw":[function(require,module,exports) {
var setPrototypeOf = require("./setPrototypeOf.js");

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
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./setPrototypeOf.js":"Omxx"}],"oXBW":[function(require,module,exports) {
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],"cbGp":[function(require,module,exports) {
var _typeof = require("./typeof.js")["default"];

var assertThisInitialized = require("./assertThisInitialized.js");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./typeof.js":"FlpK","./assertThisInitialized.js":"oXBW"}],"o3SL":[function(require,module,exports) {
var arrayLikeToArray = require("./arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./arrayLikeToArray.js":"LGpM"}],"lZpU":[function(require,module,exports) {
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],"NCaH":[function(require,module,exports) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],"I9dH":[function(require,module,exports) {
var arrayWithoutHoles = require("./arrayWithoutHoles.js");

var iterableToArray = require("./iterableToArray.js");

var unsupportedIterableToArray = require("./unsupportedIterableToArray.js");

var nonIterableSpread = require("./nonIterableSpread.js");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./arrayWithoutHoles.js":"o3SL","./iterableToArray.js":"lZpU","./unsupportedIterableToArray.js":"Vzqv","./nonIterableSpread.js":"NCaH"}],"jzT7":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniqueEntryChecker = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uniqueEntryChecker = /*#__PURE__*/function () {
  function uniqueEntryChecker() {
    (0, _classCallCheck2.default)(this, uniqueEntryChecker);
    this._uniqueTrackingList = {};
  } //check if this uniqueTrackingList has an list with said property


  (0, _createClass2.default)(uniqueEntryChecker, [{
    key: "isUniqueEntry",
    value: function isUniqueEntry(identifier, dataEntry) {
      var allowedDataEntry = this._getStringOrNumberValue(dataEntry);

      if (allowedDataEntry === null) {
        console.error("Only numbers or strings can be marked unique. This entry was: ".concat(dataEntry, " with identifier: ").concat(identifier));
        return false;
      }

      if (Object.prototype.hasOwnProperty.call(this._uniqueTrackingList, identifier)) {
        // has the list
        // does it have the entry?
        if (this._uniqueTrackingList[identifier].findIndex(function (listItem) {
          return listItem === allowedDataEntry;
        }) !== -1) {
          // if so, return false, let parent method throw an error
          return false;
        } else {
          // if not, add
          this._uniqueTrackingList[identifier].push(allowedDataEntry);

          return true;
        }
      } else {
        // does not have the list
        // create the list & add the list and entry
        this._uniqueTrackingList[identifier] = [];

        this._uniqueTrackingList[identifier].push(allowedDataEntry);

        return true;
      }
    }
  }, {
    key: "_getStringOrNumberValue",
    value: function _getStringOrNumberValue(dataEntry) {
      if (typeof dataEntry === 'string') {
        return dataEntry;
      } else if (typeof dataEntry === 'number') {
        return dataEntry;
      }

      return null;
    }
  }]);
  return uniqueEntryChecker;
}();

exports.uniqueEntryChecker = uniqueEntryChecker;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH"}],"ZCrj":[function(require,module,exports) {
var define;
var global = arguments[3];
//! moment.js
//! version : 2.29.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return (
            input instanceof Array ||
            Object.prototype.toString.call(input) === '[object Array]'
        );
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return (
            input != null &&
            Object.prototype.toString.call(input) === '[object Object]'
        );
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(obj).length === 0;
        } else {
            var k;
            for (k in obj) {
                if (hasOwnProp(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return (
            typeof input === 'number' ||
            Object.prototype.toString.call(input) === '[object Number]'
        );
    }

    function isDate(input) {
        return (
            input instanceof Date ||
            Object.prototype.toString.call(input) === '[object Date]'
        );
    }

    function map(arr, fn) {
        var res = [],
            i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false,
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this),
                len = t.length >>> 0,
                i;

            for (i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m),
                parsedParts = some.call(flags.parsedDateParts, function (i) {
                    return i != null;
                }),
                isNowValid =
                    !isNaN(m._d.getTime()) &&
                    flags.overflow < 0 &&
                    !flags.empty &&
                    !flags.invalidEra &&
                    !flags.invalidMonth &&
                    !flags.invalidWeekday &&
                    !flags.weekdayMismatch &&
                    !flags.nullInput &&
                    !flags.invalidFormat &&
                    !flags.userInvalidated &&
                    (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid =
                    isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            } else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = (hooks.momentProperties = []),
        updateInProgress = false;

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return (
            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
        );
    }

    function warn(msg) {
        if (
            hooks.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' &&
            console.warn
        ) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [],
                    arg,
                    i,
                    key;
                for (i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (key in arguments[0]) {
                            if (hasOwnProp(arguments[0], key)) {
                                arg += key + ': ' + arguments[0][key] + ', ';
                            }
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(
                    msg +
                        '\nArguments: ' +
                        Array.prototype.slice.call(args).join('') +
                        '\n' +
                        new Error().stack
                );
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return (
            (typeof Function !== 'undefined' && input instanceof Function) ||
            Object.prototype.toString.call(input) === '[object Function]'
        );
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            if (hasOwnProp(config, i)) {
                prop = config[i];
                if (isFunction(prop)) {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' +
                /\d{1,2}/.source
        );
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (
                hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])
            ) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i,
                res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L',
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (
            (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
            absNumber
        );
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        formatFunctions = {},
        formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(
                    func.apply(this, arguments),
                    token
                );
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i])
                    ? array[i].call(mom, format)
                    : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] =
            formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(
                localFormattingTokens,
                replaceLongDateFormatTokens
            );
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A',
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper
            .match(formattingTokens)
            .map(function (tok) {
                if (
                    tok === 'MMMM' ||
                    tok === 'MM' ||
                    tok === 'DD' ||
                    tok === 'dddd'
                ) {
                    return tok.slice(1);
                }
                return tok;
            })
            .join('');

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d',
        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        w: 'a week',
        ww: '%d weeks',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years',
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output)
            ? output(number, withoutSuffix, string, isFuture)
            : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string'
            ? aliases[units] || aliases[units.toLowerCase()]
            : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [],
            u;
        for (u in unitsObj) {
            if (hasOwnProp(unitsObj, u)) {
                units.push({ unit: u, priority: priorities[u] });
            }
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        return mom.isValid()
            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
            : NaN;
    }

    function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (
                unit === 'FullYear' &&
                isLeapYear(mom.year()) &&
                mom.month() === 1 &&
                mom.date() === 29
            ) {
                value = toInt(value);
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
                    value,
                    mom.month(),
                    daysInMonth(value, mom.month())
                );
            } else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }

    function stringSet(units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units),
                i;
            for (i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    var match1 = /\d/, //       0 - 9
        match2 = /\d\d/, //      00 - 99
        match3 = /\d{3}/, //     000 - 999
        match4 = /\d{4}/, //    0000 - 9999
        match6 = /[+-]?\d{6}/, // -999999 - 999999
        match1to2 = /\d\d?/, //       0 - 99
        match3to4 = /\d\d\d\d?/, //     999 - 9999
        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
        match1to3 = /\d{1,3}/, //       0 - 999
        match1to4 = /\d{1,4}/, //       0 - 9999
        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
        matchUnsigned = /\d+/, //       0 - inf
        matchSigned = /[+-]?\d+/, //    -inf - inf
        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        // any word (or two) characters or numbers including two/three word month in arabic.
        // includes scottish gaelic two word and hyphenated months
        matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
        regexes;

    regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex)
            ? regex
            : function (isStrict, localeData) {
                  return isStrict && strictRegex ? strictRegex : regex;
              };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(
            s
                .replace('\\', '')
                .replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (
                    matched,
                    p1,
                    p2,
                    p3,
                    p4
                ) {
                    return p1 || p2 || p3 || p4;
                })
        );
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i,
            func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,
        WEEK = 7,
        WEEKDAY = 8;

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1
            ? isLeapYear(year)
                ? 29
                : 28
            : 31 - ((modMonth % 7) % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
            '_'
        ),
        defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split(
            '_'
        ),
        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        defaultMonthsShortRegex = matchWord,
        defaultMonthsRegex = matchWord;

    function localeMonths(m, format) {
        if (!m) {
            return isArray(this._months)
                ? this._months
                : this._months['standalone'];
        }
        return isArray(this._months)
            ? this._months[m.month()]
            : this._months[
                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                      ? 'format'
                      : 'standalone'
              ][m.month()];
    }

    function localeMonthsShort(m, format) {
        if (!m) {
            return isArray(this._monthsShort)
                ? this._monthsShort
                : this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort)
            ? this._monthsShort[m.month()]
            : this._monthsShort[
                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
              ][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i,
            ii,
            mom,
            llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp(
                    '^' + this.months(mom, '').replace('.', '') + '$',
                    'i'
                );
                this._shortMonthsParse[i] = new RegExp(
                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                    'i'
                );
            }
            if (!strict && !this._monthsParse[i]) {
                regex =
                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'MMMM' &&
                this._longMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'MMM' &&
                this._shortMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict
                ? this._monthsShortStrictRegex
                : this._monthsShortRegex;
        }
    }

    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict
                ? this._monthsStrictRegex
                : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._monthsShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] =
            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate(y) {
        var date, args;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear,
            resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear,
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek,
            resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear,
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (
        input,
        week,
        config,
        token
    ) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6, // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
            '_'
        ),
        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        defaultWeekdaysRegex = matchWord,
        defaultWeekdaysShortRegex = matchWord,
        defaultWeekdaysMinRegex = matchWord;

    function localeWeekdays(m, format) {
        var weekdays = isArray(this._weekdays)
            ? this._weekdays
            : this._weekdays[
                  m && m !== true && this._weekdays.isFormat.test(format)
                      ? 'format'
                      : 'standalone'
              ];
        return m === true
            ? shiftWeekdays(weekdays, this._week.dow)
            : m
            ? weekdays[m.day()]
            : weekdays;
    }

    function localeWeekdaysShort(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : m
            ? this._weekdaysShort[m.day()]
            : this._weekdaysShort;
    }

    function localeWeekdaysMin(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : m
            ? this._weekdaysMin[m.day()]
            : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i,
            ii,
            mom,
            llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._shortWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._minWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
            }
            if (!this._weekdaysParse[i]) {
                regex =
                    '^' +
                    this.weekdays(mom, '') +
                    '|^' +
                    this.weekdaysShort(mom, '') +
                    '|^' +
                    this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'dddd' &&
                this._fullWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'ddd' &&
                this._shortWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'dd' &&
                this._minWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict
                ? this._weekdaysStrictRegex
                : this._weekdaysRegex;
        }
    }

    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict
                ? this._weekdaysShortStrictRegex
                : this._weekdaysShortRegex;
        }
    }

    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict
                ? this._weekdaysMinStrictRegex
                : this._weekdaysMinRegex;
        }
    }

    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom,
            minp,
            shortp,
            longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = regexEscape(this.weekdaysMin(mom, ''));
            shortp = regexEscape(this.weekdaysShort(mom, ''));
            longp = regexEscape(this.weekdays(mom, ''));
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._weekdaysShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
        this._weekdaysMinStrictRegex = new RegExp(
            '^(' + minPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return (
            '' +
            hFormat.apply(this) +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return (
            '' +
            this.hours() +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(
                this.hours(),
                this.minutes(),
                lowercase
            );
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('k', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return (input + '').toLowerCase().charAt(0) === 'p';
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
        // Setting the hour should keep the time, because the user explicitly
        // specified which hour they want. So trying to maintain the same hour (in
        // a new timezone) makes sense. Adding/subtracting hours does not follow
        // this rule.
        getSetHour = makeGetSet('Hours', true);

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse,
    };

    // internal storage for locale config files
    var locales = {},
        localeFamilies = {},
        globalLocale;

    function commonPrefix(arr1, arr2) {
        var i,
            minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
            if (arr1[i] !== arr2[i]) {
                return i;
            }
        }
        return minl;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (
                    next &&
                    next.length >= j &&
                    commonPrefix(split, next) >= j - 1
                ) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null,
            aliasedRequire;
        // TODO: Find a better way to register and load all the locales in Node
        if (
            locales[name] === undefined &&
            typeof module !== 'undefined' &&
            module &&
            module.exports
        ) {
            try {
                oldLocale = globalLocale._abbr;
                aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {
                // mark as not found to avoid repeating expensive file require call causing high CPU
                // when trying to find en-US, en_US, en-us for every format call
                locales[name] = null; // null means not found
            }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            } else {
                if (typeof console !== 'undefined' && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn(
                        'Locale ' + key + ' not found. Did you forget to load it?'
                    );
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var locale,
                parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple(
                    'defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                );
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config,
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale,
                tmpLocale,
                parentConfig = baseConfig;

            if (locales[name] != null && locales[name].parentLocale != null) {
                // Update existing child locale in-place to avoid memory-leaks
                locales[name].set(mergeConfigs(locales[name]._config, config));
            } else {
                // MERGE
                tmpLocale = loadLocale(name);
                if (tmpLocale != null) {
                    parentConfig = tmpLocale._config;
                }
                config = mergeConfigs(parentConfig, config);
                if (tmpLocale == null) {
                    // updateLocale is called for creating a new locale
                    // Set abbr so it will have a name (getters return
                    // undefined otherwise).
                    config.abbr = name;
                }
                locale = new Locale(config);
                locale.parentLocale = locales[name];
                locales[name] = locale;
            }

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                    if (name === getSetGlobalLocale()) {
                        getSetGlobalLocale(name);
                    }
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow(m) {
        var overflow,
            a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH] < 0 || a[MONTH] > 11
                    ? MONTH
                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
                    ? DATE
                    : a[HOUR] < 0 ||
                      a[HOUR] > 24 ||
                      (a[HOUR] === 24 &&
                          (a[MINUTE] !== 0 ||
                              a[SECOND] !== 0 ||
                              a[MILLISECOND] !== 0))
                    ? HOUR
                    : a[MINUTE] < 0 || a[MINUTE] > 59
                    ? MINUTE
                    : a[SECOND] < 0 || a[SECOND] > 59
                    ? SECOND
                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
                    ? MILLISECOND
                    : -1;

            if (
                getParsingFlags(m)._overflowDayOfYear &&
                (overflow < YEAR || overflow > DATE)
            ) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
            ['YYYY-DDD', /\d{4}-\d{3}/],
            ['YYYY-MM', /\d{4}-\d\d/, false],
            ['YYYYYYMMDD', /[+-]\d{10}/],
            ['YYYYMMDD', /\d{8}/],
            ['GGGG[W]WWE', /\d{4}W\d{3}/],
            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
            ['YYYYDDD', /\d{7}/],
            ['YYYYMM', /\d{6}/, false],
            ['YYYY', /\d{4}/, false],
        ],
        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
            ['HH:mm', /\d\d:\d\d/],
            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
            ['HHmmss', /\d\d\d\d\d\d/],
            ['HHmm', /\d\d\d\d/],
            ['HH', /\d\d/],
        ],
        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
        rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        obsOffsets = {
            UT: 0,
            GMT: 0,
            EDT: -4 * 60,
            EST: -5 * 60,
            CDT: -5 * 60,
            CST: -6 * 60,
            MDT: -6 * 60,
            MST: -7 * 60,
            PDT: -7 * 60,
            PST: -8 * 60,
        };

    // date from iso format
    function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime,
            dateFormat,
            timeFormat,
            tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    function extractFromRFC2822Strings(
        yearStr,
        monthStr,
        dayStr,
        hourStr,
        minuteStr,
        secondStr
    ) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10),
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s
            .replace(/\([^)]*\)|[\n\t]/g, ' ')
            .replace(/(\s\s+)/g, ' ')
            .replace(/^\s\s*/, '')
            .replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(
                    parsedInput[0],
                    parsedInput[1],
                    parsedInput[2]
                ).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10),
                m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)),
            parsedArray;
        if (match) {
            parsedArray = extractFromRFC2822Strings(
                match[4],
                match[3],
                match[2],
                match[5],
                match[6],
                match[7]
            );
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        if (config._strict) {
            config._isValid = false;
        } else {
            // Final attempt, use Input Fallback
            hooks.createFromInputFallback(config);
        }
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [
                nowValue.getUTCFullYear(),
                nowValue.getUTCMonth(),
                nowValue.getUTCDate(),
            ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            expectedWeekday,
            yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (
                config._dayOfYear > daysInYear(yearToUse) ||
                config._dayOfYear === 0
            ) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] =
                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (
            config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0
        ) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(
            null,
            input
        );
        expectedWeekday = config._useUTC
            ? config._d.getUTCDay()
            : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (
            config._w &&
            typeof config._w.d !== 'undefined' &&
            config._w.d !== expectedWeekday
        ) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(
                w.GG,
                config._a[YEAR],
                weekOfYear(createLocal(), 1, 4).year
            );
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0,
            era;

        tokens =
            expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
                [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(
                    string.indexOf(parsedInput) + parsedInput.length
                );
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver =
            stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (
            config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0
        ) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(
            config._locale,
            config._a[HOUR],
            config._meridiem
        );

        // handle era
        era = getParsingFlags(config).era;
        if (era !== null) {
            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }

        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,
            scoreToBeat,
            i,
            currentScore,
            validFormatFound,
            bestFormatIsValid = false;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            validFormatFound = false;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (isValid(tempConfig)) {
                validFormatFound = true;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (!bestFormatIsValid) {
                if (
                    scoreToBeat == null ||
                    currentScore < scoreToBeat ||
                    validFormatFound
                ) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                    if (validFormatFound) {
                        bestFormatIsValid = true;
                    }
                }
            } else {
                if (currentScore < scoreToBeat) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                }
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i),
            dayOrDate = i.day === undefined ? i.date : i.day;
        config._a = map(
            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
            function (obj) {
                return obj && parseInt(obj, 10);
            }
        );

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (format === true || format === false) {
            strict = format;
            format = undefined;
        }

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if (
            (isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)
        ) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other < this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        ),
        prototypeMax = deprecate(
            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other > this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +new Date();
    };

    var ordering = [
        'year',
        'quarter',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond',
    ];

    function isDurationValid(m) {
        var key,
            unitHasDecimal = false,
            i;
        for (key in m) {
            if (
                hasOwnProp(m, key) &&
                !(
                    indexOf.call(ordering, key) !== -1 &&
                    (m[key] == null || !isNaN(m[key]))
                )
            ) {
                return false;
            }
        }

        for (i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds =
            +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (
                (dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
            ) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset(),
                sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return (
                sign +
                zeroFill(~~(offset / 60), 2) +
                separator +
                zeroFill(~~offset % 60, 2)
            );
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher),
            chunk,
            parts,
            minutes;

        if (matches === null) {
            return null;
        }

        chunk = matches[matches.length - 1] || [];
        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff =
                (isMoment(input) || isDate(input)
                    ? input.valueOf()
                    : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset());
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(
                        this,
                        createDuration(input - offset, 'm'),
                        1,
                        false
                    );
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {},
            other;

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted =
                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        // and further modified to allow for strings containing both week and day
        isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months,
            };
        } else if (isNumber(input) || !isNaN(+input)) {
            duration = {};
            if (key) {
                duration[key] = +input;
            } else {
                duration.milliseconds = +input;
            }
        } else if ((match = aspNetRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
            };
        } else if ((match = isoRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign),
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if (
            typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)
        ) {
            diffRes = momentsDifference(
                createLocal(duration.from),
                createLocal(duration.to)
            );

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
            ret._isValid = input._isValid;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months =
            other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'M');

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(
                    name,
                    'moment().' +
                        name +
                        '(period, number) is deprecated. Please use moment().' +
                        name +
                        '(number, period). ' +
                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                );
                tmp = val;
                val = period;
                period = tmp;
            }

            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add'),
        subtract = createAdder(-1, 'subtract');

    function isString(input) {
        return typeof input === 'string' || input instanceof String;
    }

    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
    function isMomentInput(input) {
        return (
            isMoment(input) ||
            isDate(input) ||
            isString(input) ||
            isNumber(input) ||
            isNumberOrStringArray(input) ||
            isMomentInputObject(input) ||
            input === null ||
            input === undefined
        );
    }

    function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'years',
                'year',
                'y',
                'months',
                'month',
                'M',
                'days',
                'day',
                'd',
                'dates',
                'date',
                'D',
                'hours',
                'hour',
                'h',
                'minutes',
                'minute',
                'm',
                'seconds',
                'second',
                's',
                'milliseconds',
                'millisecond',
                'ms',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function isNumberOrStringArray(input) {
        var arrayTest = isArray(input),
            dataTypeTest = false;
        if (arrayTest) {
            dataTypeTest =
                input.filter(function (item) {
                    return !isNumber(item) && isString(input);
                }).length === 0;
        }
        return arrayTest && dataTypeTest;
    }

    function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'sameDay',
                'nextDay',
                'lastDay',
                'nextWeek',
                'lastWeek',
                'sameElse',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6
            ? 'sameElse'
            : diff < -1
            ? 'lastWeek'
            : diff < 0
            ? 'lastDay'
            : diff < 1
            ? 'sameDay'
            : diff < 2
            ? 'nextDay'
            : diff < 7
            ? 'nextWeek'
            : 'sameElse';
    }

    function calendar$1(time, formats) {
        // Support for single parameter, formats only overload to the calendar function
        if (arguments.length === 1) {
            if (!arguments[0]) {
                time = undefined;
                formats = undefined;
            } else if (isMomentInput(arguments[0])) {
                time = arguments[0];
                formats = undefined;
            } else if (isCalendarSpec(arguments[0])) {
                formats = arguments[0];
                time = undefined;
            }
        }
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse',
            output =
                formats &&
                (isFunction(formats[format])
                    ? formats[format].call(this, now)
                    : formats[format]);

        return this.format(
            output || this.localeData().calendar(format, this, createLocal(now))
        );
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (
            (inclusivity[0] === '('
                ? this.isAfter(localFrom, units)
                : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')'
                ? this.isBefore(localTo, units)
                : !this.isAfter(localTo, units))
        );
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return (
                this.clone().startOf(units).valueOf() <= inputMs &&
                inputMs <= this.clone().endOf(units).valueOf()
            );
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that, zoneDelta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year':
                output = monthDiff(this, that) / 12;
                break;
            case 'month':
                output = monthDiff(this, that);
                break;
            case 'quarter':
                output = monthDiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zoneDelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zoneDelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthDiff(b, a);
        }
        // difference in months
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true,
            m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(
                m,
                utc
                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
            );
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                    .toISOString()
                    .replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(
            m,
            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
        );
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment',
            zone = '',
            prefix,
            year,
            datetime,
            suffix;
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        prefix = '[' + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
        datetime = '-MM-DD[T]HH:mm:ss.SSS';
        suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc()
                ? hooks.defaultFormatUtc
                : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ to: this, from: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ from: this, to: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData() {
        return this._locale;
    }

    var MS_PER_SECOND = 1000,
        MS_PER_MINUTE = 60 * MS_PER_SECOND,
        MS_PER_HOUR = 60 * MS_PER_MINUTE,
        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return ((dividend % divisor) + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(
                    this.year(),
                    this.month() - (this.month() % 3),
                    1
                );
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - this.weekday()
                );
                break;
            case 'isoWeek':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - (this.isoWeekday() - 1)
                );
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(
                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                    MS_PER_HOUR
                );
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time =
                    startOfDate(
                        this.year(),
                        this.month() - (this.month() % 3) + 3,
                        1
                    ) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday() + 7
                    ) - 1;
                break;
            case 'isoWeek':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoWeekday() - 1) + 7
                    ) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time +=
                    MS_PER_HOUR -
                    mod$1(
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                        MS_PER_HOUR
                    ) -
                    1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [
            m.year(),
            m.month(),
            m.date(),
            m.hour(),
            m.minute(),
            m.second(),
            m.millisecond(),
        ];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds(),
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict,
        };
    }

    addFormatToken('N', 0, 0, 'eraAbbr');
    addFormatToken('NN', 0, 0, 'eraAbbr');
    addFormatToken('NNN', 0, 0, 'eraAbbr');
    addFormatToken('NNNN', 0, 0, 'eraName');
    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
    addFormatToken('y', ['yy', 2], 0, 'eraYear');
    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

    addRegexToken('N', matchEraAbbr);
    addRegexToken('NN', matchEraAbbr);
    addRegexToken('NNN', matchEraAbbr);
    addRegexToken('NNNN', matchEraName);
    addRegexToken('NNNNN', matchEraNarrow);

    addParseToken(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (
        input,
        array,
        config,
        token
    ) {
        var era = config._locale.erasParse(input, token, config._strict);
        if (era) {
            getParsingFlags(config).era = era;
        } else {
            getParsingFlags(config).invalidEra = input;
        }
    });

    addRegexToken('y', matchUnsigned);
    addRegexToken('yy', matchUnsigned);
    addRegexToken('yyy', matchUnsigned);
    addRegexToken('yyyy', matchUnsigned);
    addRegexToken('yo', matchEraYearOrdinal);

    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
    addParseToken(['yo'], function (input, array, config, token) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
            match = input.match(config._locale._eraYearOrdinalRegex);
        }

        if (config._locale.eraYearOrdinalParse) {
            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
            array[YEAR] = parseInt(input, 10);
        }
    });

    function localeEras(m, format) {
        var i,
            l,
            date,
            eras = this._eras || getLocale('en')._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
            switch (typeof eras[i].since) {
                case 'string':
                    // truncate time
                    date = hooks(eras[i].since).startOf('day');
                    eras[i].since = date.valueOf();
                    break;
            }

            switch (typeof eras[i].until) {
                case 'undefined':
                    eras[i].until = +Infinity;
                    break;
                case 'string':
                    // truncate time
                    date = hooks(eras[i].until).startOf('day').valueOf();
                    eras[i].until = date.valueOf();
                    break;
            }
        }
        return eras;
    }

    function localeErasParse(eraName, format, strict) {
        var i,
            l,
            eras = this.eras(),
            name,
            abbr,
            narrow;
        eraName = eraName.toUpperCase();

        for (i = 0, l = eras.length; i < l; ++i) {
            name = eras[i].name.toUpperCase();
            abbr = eras[i].abbr.toUpperCase();
            narrow = eras[i].narrow.toUpperCase();

            if (strict) {
                switch (format) {
                    case 'N':
                    case 'NN':
                    case 'NNN':
                        if (abbr === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNN':
                        if (name === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNNN':
                        if (narrow === eraName) {
                            return eras[i];
                        }
                        break;
                }
            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                return eras[i];
            }
        }
    }

    function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? +1 : -1;
        if (year === undefined) {
            return hooks(era.since).year();
        } else {
            return hooks(era.since).year() + (year - era.offset) * dir;
        }
    }

    function getEraName() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].name;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].name;
            }
        }

        return '';
    }

    function getEraNarrow() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].narrow;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].narrow;
            }
        }

        return '';
    }

    function getEraAbbr() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].abbr;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].abbr;
            }
        }

        return '';
    }

    function getEraYear() {
        var i,
            l,
            dir,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            dir = eras[i].since <= eras[i].until ? +1 : -1;

            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (
                (eras[i].since <= val && val <= eras[i].until) ||
                (eras[i].until <= val && val <= eras[i].since)
            ) {
                return (
                    (this.year() - hooks(eras[i].since).year()) * dir +
                    eras[i].offset
                );
            }
        }

        return this.year();
    }

    function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNameRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
    }

    function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, '_erasAbbrRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
    }

    function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNarrowRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
    }

    function matchEraAbbr(isStrict, locale) {
        return locale.erasAbbrRegex(isStrict);
    }

    function matchEraName(isStrict, locale) {
        return locale.erasNameRegex(isStrict);
    }

    function matchEraNarrow(isStrict, locale) {
        return locale.erasNarrowRegex(isStrict);
    }

    function matchEraYearOrdinal(isStrict, locale) {
        return locale._eraYearOrdinalRegex || matchUnsigned;
    }

    function computeErasParse() {
        var abbrPieces = [],
            namePieces = [],
            narrowPieces = [],
            mixedPieces = [],
            i,
            l,
            eras = this.eras();

        for (i = 0, l = eras.length; i < l; ++i) {
            namePieces.push(regexEscape(eras[i].name));
            abbrPieces.push(regexEscape(eras[i].abbr));
            narrowPieces.push(regexEscape(eras[i].narrow));

            mixedPieces.push(regexEscape(eras[i].name));
            mixedPieces.push(regexEscape(eras[i].abbr));
            mixedPieces.push(regexEscape(eras[i].narrow));
        }

        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
        this._erasNarrowRegex = new RegExp(
            '^(' + narrowPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);

    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (
        input,
        week,
        config,
        token
    ) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy
        );
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.isoWeek(),
            this.isoWeekday(),
            1,
            4
        );
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null
            ? Math.ceil((this.month() + 1) / 3)
            : this.month((input - 1) * 3 + (this.month() % 3));
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict
            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
            : locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear =
            Math.round(
                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
            ) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token, getSetMillisecond;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }

    getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
            return 'Moment<' + this.format() + '>';
        };
    }
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.eraName = getEraName;
    proto.eraNarrow = getEraNarrow;
    proto.eraAbbr = getEraAbbr;
    proto.eraYear = getEraYear;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.weeksInWeekYear = getWeeksInWeekYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate(
        'dates accessor is deprecated. Use date instead.',
        getSetDayOfMonth
    );
    proto.months = deprecate(
        'months accessor is deprecated. Use month instead',
        getSetMonth
    );
    proto.years = deprecate(
        'years accessor is deprecated. Use year instead',
        getSetYear
    );
    proto.zone = deprecate(
        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
        getSetZone
    );
    proto.isDSTShifted = deprecate(
        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
        isDaylightSavingTimeShifted
    );

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;
    proto$1.eras = localeEras;
    proto$1.erasParse = localeErasParse;
    proto$1.erasConvertYear = localeErasConvertYear;
    proto$1.erasAbbrRegex = erasAbbrRegex;
    proto$1.erasNameRegex = erasNameRegex;
    proto$1.erasNarrowRegex = erasNarrowRegex;

    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale(),
            utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i,
            out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0,
            i,
            out = [];

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        eras: [
            {
                since: '0001-01-01',
                until: +Infinity,
                offset: 1,
                name: 'Anno Domini',
                narrow: 'AD',
                abbr: 'AD',
            },
            {
                since: '0000-12-31',
                until: -Infinity,
                offset: 1,
                name: 'Before Christ',
                narrow: 'BC',
                abbr: 'BC',
            },
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output =
                    toInt((number % 100) / 10) === 1
                        ? 'th'
                        : b === 1
                        ? 'st'
                        : b === 2
                        ? 'nd'
                        : b === 3
                        ? 'rd'
                        : 'th';
            return number + output;
        },
    });

    // Side effect imports

    hooks.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        getSetGlobalLocale
    );
    hooks.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        getLocale
    );

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds,
            days = this._days,
            months = this._months,
            data = this._data,
            seconds,
            minutes,
            hours,
            years,
            monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (
            !(
                (milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0)
            )
        ) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return (days * 4800) / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return (months * 146097) / 4800;
    }

    function as(units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days,
            months,
            milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':
                    return months;
                case 'quarter':
                    return months / 3;
                case 'year':
                    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1() {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms'),
        asSeconds = makeAs('s'),
        asMinutes = makeAs('m'),
        asHours = makeAs('h'),
        asDays = makeAs('d'),
        asWeeks = makeAs('w'),
        asMonths = makeAs('M'),
        asQuarters = makeAs('Q'),
        asYears = makeAs('y');

    function clone$1() {
        return createDuration(this);
    }

    function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds'),
        seconds = makeGetter('seconds'),
        minutes = makeGetter('minutes'),
        hours = makeGetter('hours'),
        days = makeGetter('days'),
        months = makeGetter('months'),
        years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round,
        thresholds = {
            ss: 44, // a few seconds to seconds
            s: 45, // seconds to minute
            m: 45, // minutes to hour
            h: 22, // hours to day
            d: 26, // days to month/week
            w: null, // weeks to month
            M: 11, // months to year
        };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
        var duration = createDuration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            weeks = round(duration.as('w')),
            years = round(duration.as('y')),
            a =
                (seconds <= thresholds.ss && ['s', seconds]) ||
                (seconds < thresholds.s && ['ss', seconds]) ||
                (minutes <= 1 && ['m']) ||
                (minutes < thresholds.m && ['mm', minutes]) ||
                (hours <= 1 && ['h']) ||
                (hours < thresholds.h && ['hh', hours]) ||
                (days <= 1 && ['d']) ||
                (days < thresholds.d && ['dd', days]);

        if (thresholds.w != null) {
            a =
                a ||
                (weeks <= 1 && ['w']) ||
                (weeks < thresholds.w && ['ww', weeks]);
        }
        a = a ||
            (months <= 1 && ['M']) ||
            (months < thresholds.M && ['MM', months]) ||
            (years <= 1 && ['y']) || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof roundingFunction === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var withSuffix = false,
            th = thresholds,
            locale,
            output;

        if (typeof argWithSuffix === 'object') {
            argThresholds = argWithSuffix;
            argWithSuffix = false;
        }
        if (typeof argWithSuffix === 'boolean') {
            withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === 'object') {
            th = Object.assign({}, thresholds, argThresholds);
            if (argThresholds.s != null && argThresholds.ss == null) {
                th.ss = argThresholds.s - 1;
            }
        }

        locale = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return (x > 0) - (x < 0) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000,
            days = abs$1(this._days),
            months = abs$1(this._months),
            minutes,
            hours,
            years,
            s,
            total = this.asSeconds(),
            totalSign,
            ymSign,
            daysSign,
            hmsSign;

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

        totalSign = total < 0 ? '-' : '';
        ymSign = sign(this._months) !== sign(total) ? '-' : '';
        daysSign = sign(this._days) !== sign(total) ? '-' : '';
        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return (
            totalSign +
            'P' +
            (years ? ymSign + years + 'Y' : '') +
            (months ? ymSign + months + 'M' : '') +
            (days ? daysSign + days + 'D' : '') +
            (hours || minutes || seconds ? 'T' : '') +
            (hours ? hmsSign + hours + 'H' : '') +
            (minutes ? hmsSign + minutes + 'M' : '') +
            (seconds ? hmsSign + s + 'S' : '')
        );
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asQuarters = asQuarters;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    proto$2.toIsoString = deprecate(
        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
        toISOString$1
    );
    proto$2.lang = lang;

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    //! moment.js

    hooks.version = '2.29.1';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD', // <input type="date" />
        TIME: 'HH:mm', // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW', // <input type="week" />
        MONTH: 'YYYY-MM', // <input type="month" />
    };

    return hooks;

})));

},{}],"EDRb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateHelperTimeStamp = exports.DateHelper = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DateHelper = /*#__PURE__*/function () {
  function DateHelper() {
    (0, _classCallCheck2.default)(this, DateHelper);
  }

  (0, _createClass2.default)(DateHelper, null, [{
    key: "isDateLaterThanDate",
    value: function isDateLaterThanDate(firstDateTime, secondDateTime) {
      var differenceBetweenDates = (0, _moment.default)(firstDateTime).diff(secondDateTime);
      return differenceBetweenDates > 0 ? true : false;
    }
  }, {
    key: "getAgeFromBirthDate",
    value: function getAgeFromBirthDate(birthdate) {
      if (DateHelper.isValidDate(birthdate)) {
        return _moment.default.duration((0, _moment.default)(new Date()).diff(birthdate)).asYears();
      }

      console.error('Invalid date string');
      return -1;
    }
  }, {
    key: "isValidDate",
    value: function isValidDate(dateString) {
      // hint: e.g. "2021-04-28T20:01:16.126Z" (ISO stringdates are valid dates)
      if ((0, _moment.default)(dateString).isValid()) {
        return true;
      } else {
        console.error("Datestring: ".concat(dateString, " is not a valid datetime string"));
        return false;
      }
    }
  }, {
    key: "isDateBetweenGreaterThanAmountOfDays",
    value: function isDateBetweenGreaterThanAmountOfDays(dateOne, dateTwo, amountOfDays) {
      if (amountOfDays <= 0) {
        console.error("The amount of days cannot be 0 or less");
        return undefined;
      }

      return this.getAmountDaysBetweenDates(dateOne, dateTwo) !== undefined && this.getAmountDaysBetweenDates(dateOne, dateTwo) > amountOfDays ? true : false;
    }
  }, {
    key: "getAmountDaysBetweenDates",
    value: function getAmountDaysBetweenDates(dateFormer, dateLater) {
      if (!DateHelper.isValidDate(dateFormer) || !DateHelper.isValidDate(dateLater)) {
        console.error("Parameter dateOne: ".concat(dateFormer, " and/or dateTwo: ").concat(dateLater, " is not a valid date"));
        return undefined;
      }

      return _moment.default.duration((0, _moment.default)(dateLater).diff(dateFormer)).asDays();
    }
  }, {
    key: "getAmountMilisecondesBetweenDates",
    value: function getAmountMilisecondesBetweenDates(dateFormer, dateLater) {
      if (!DateHelper.isValidDate(dateFormer) || !DateHelper.isValidDate(dateLater)) {
        console.error("Parameter dateOne: ".concat(dateFormer, " and/or dateTwo: ").concat(dateLater, " is not a valid date"));
        return undefined;
      }

      return _moment.default.duration((0, _moment.default)(dateLater).diff(dateFormer)).asMilliseconds();
    }
  }]);
  return DateHelper;
}();

exports.DateHelper = DateHelper;

var DateHelperTimeStamp = /*#__PURE__*/function () {
  function DateHelperTimeStamp() {
    (0, _classCallCheck2.default)(this, DateHelperTimeStamp);
  }

  (0, _createClass2.default)(DateHelperTimeStamp, null, [{
    key: "isDateBetweenGreaterThanAmountOfDays",
    value: function isDateBetweenGreaterThanAmountOfDays(dateOne, dateTwo, amountOfDays) {
      if (amountOfDays <= 0) {
        console.error("The amount of days cannot be 0 or less");
        return null;
      }

      var miliSecondsInDay = 86400000;
      var amountOfDaysInMS = amountOfDays * 86400000; //todo: why can't i type this shorthand without type converting it to a number?

      return this.getAmountDaysBetweenDates(dateOne, dateTwo) !== null && this.getAmountDaysBetweenDates(dateOne, dateTwo) >= amountOfDays ? true : false;
    }
  }, {
    key: "getAmountDaysBetweenDates",
    value: function getAmountDaysBetweenDates(dateFormer, dateLater) {
      if (!DateHelperTimeStamp.isValidDate(dateFormer) || !DateHelperTimeStamp.isValidDate(dateLater)) {
        console.error("Parameter dateOne: ".concat(dateFormer, " and/or dateTwo: ").concat(dateLater, " is not a valid date"));
        return null;
      } // return moment.duration(moment(dateLater).diff(dateFormer)).asDays();


      var miliSecondsInDay = 86400000;
      return (dateLater - dateFormer) / miliSecondsInDay;
    }
  }, {
    key: "isValidDate",
    value: function isValidDate(dateTimeStampNumber) {
      // timestamp 0 is 1-1-1970 01:00:00. Any number below that is in the future thus is invalid
      return dateTimeStampNumber > 0 ? true : false;
    }
  }]);
  return DateHelperTimeStamp;
}();

exports.DateHelperTimeStamp = DateHelperTimeStamp;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","moment":"ZCrj"}],"xYao":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataFieldDistances = exports.DataFieldGhostsList = exports.DataFieldReminderList = exports.DataFieldReactionSpeedList = exports.DataFieldMessages = exports.DataFieldSystemNo = exports.DataField = exports.UIRequiredType = exports.UIRequired = void 0;

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _uniqueEntryChecker = require("../util/uniqueEntryChecker");

var _dateHelper = require("../util/dateHelper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var UIRequired;
exports.UIRequired = UIRequired;

(function (UIRequired) {
  UIRequired["SELECT_ONLY"] = "select_only";
  UIRequired["CHAT_ONLY"] = "chat_only";
  UIRequired["ALL"] = "all";
  UIRequired["NONE"] = "none";
})(UIRequired || (exports.UIRequired = UIRequired = {}));

var UIRequiredType;
exports.UIRequiredType = UIRequiredType;

(function (UIRequiredType) {
  UIRequiredType["TEXTAREA"] = "textarea";
  UIRequiredType["ALPHANUMERIC_INPUT"] = "alphanumeric-input";
  UIRequiredType["NUMERIC_INPUT"] = "numeric-input";
  UIRequiredType["SLIDER"] = "slider";
  UIRequiredType["SWITCH"] = "switch";
  UIRequiredType["MULTISELECT"] = "multiselect";
})(UIRequiredType || (exports.UIRequiredType = UIRequiredType = {}));

var DataField = /*#__PURE__*/function () {
  function DataField(title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic, options) {
    var _this = this;

    (0, _classCallCheck2.default)(this, DataField);
    this.dataEntryList = [];
    this._uniqueIdentifier = new _uniqueEntryChecker.uniqueEntryChecker();

    this.isDataEntryValid = function (dataEntry) {
      if (!_this._isBaseTypeSet(_this.dataLogic.baseType)) {
        return false;
      } // if the data entry is allowed to be empty, and IS empty


      if (_this.emptyFieldAllowed && _this._isDataEntryEmpty(dataEntry)) {
        // return true because undefined/null/empty string is an acceptable value if empty field allowed is true
        return true;
      } //if the data entry is allowed to be empty, but data entry is not empty
      // continue with the check
      // if the data entry IS NOT allowed to be empty, but data entry IS empty AND the current entry is not null (empty)


      if (!_this.emptyFieldAllowed && _this._isDataEntryEmpty(dataEntry) && _this.dataEntry !== null) {
        console.error("The data entry for  ".concat(_this.title, " cannot be empty or of a falsy value. Value: (").concat(dataEntry, ")."));
        return false;
      } // if the data entry IS NOT allowed to be empty, but the data entry is not empty
      // continue with the check


      if (_this.mustBeUnique && !_this._isDataEntryUnique('noDataEntry', dataEntry) && dataEntry !== _this.dataEntry) {
        console.error("dataEntry: ".concat(dataEntry, " for property: ").concat(_this.title, " does not have a unique number."));
      }

      if (_this.dataLogic.baseType === 'specialList' && _this.dataLogic.customCheckClass !== null) {
        if (_this.dataLogic.customCheckClass.isValidEntry(dataEntry)) {
          return true;
        }

        console.error("The converted data entry (".concat(dataEntry, ") does not satisfy the check method set for ").concat(_this.title));
        return false;
      }

      var typeDataEntry = _this._getTypeOfValue(dataEntry);

      switch (_this.dataLogic.baseType) {
        case 'string':
          if (typeDataEntry === 'string') {
            return true;
          }

          console.error("The data entry (".concat(dataEntry, ") provided for ").concat(_this.title, " should be of type ").concat(_this.dataLogic.baseType, " but was found to be of type ").concat(_this._getTypeOfValue(dataEntry)));
          return false;

        case 'boolean':
          if (typeDataEntry === 'boolean') {
            return true;
          }

          console.error("The data entry (".concat(dataEntry, ") provided for ").concat(_this.title, " should be of type ").concat(_this.dataLogic.baseType, " but was found to be of type ").concat(_this._getTypeOfValue(dataEntry)));
          return false;

        case 'number':
          if (typeDataEntry === 'number') {
            return true;
          }

          console.error("The data entry (".concat(dataEntry, ") provided for ").concat(_this.title, " should be of type ").concat(_this.dataLogic.baseType, " but was found to be of type ").concat(_this._getTypeOfValue(dataEntry)));
          return false;

        case 'stringList':
          if (typeDataEntry === 'object' && Array.isArray(dataEntry)) {
            if (_this._isDataEntryValidForStringList(dataEntry)) {
              return true;
            }

            return false;
          }

          console.error("".concat(_this.title, " has baseType set to 'stringList' but received a value which is not an array. Please check the data to ensure values provided to this datafield are always of type array."));
          return false;

        case 'specialList':
          console.error("Datafield ".concat(_this.title, " has baseType 'specialList' but no customCheckClass assigned. Datafields with baseType 'specialList' must have a customCheckClass assigned to it."));
          return false;

        default:
          console.error("The basetype provided for ".concat(_this.title, " has an unknown type"));
          return false;
      }
    };

    this.title = title;
    this.description = description;
    this.emptyFieldAllowed = emptyFieldAllowed; // why did i need this again? What the difference between this setting and the UISetting setting? Don;t i only need the UISetting setting? Idea; refactor this to a specific string keyword mentioning the required ui element needed e.g. 'radio'

    this.UISetting = UISetting; //determines if the fields is visible in UI

    this.multipleDataEntry = multipleDataEntry;
    this.options = options ? options : [];
    this.mustBeUnique = mustBeUnique;
    this.autoGather = autoGather; //if true, then check in the provided dataSource if e.g. a numnber already exists. if not assign a new (increment from the former) number to this person

    this.onlyGatherOnce = onlyGatherOnce;
    this.dataLogic = dataLogic;

    if (!this._isDataFieldValid()) {
      console.error("Data field ".concat(this.title, " is not valid. Check the logs and update."));
    }
  }

  (0, _createClass2.default)(DataField, [{
    key: "getValue",
    value: function getValue(optionalArgumentsObject) {
      // console.log('uses getBaseValue from datafield');
      if (this._isBaseTypeOfAllowedListType(this.dataLogic.baseType)) {
        return this.dataEntryList;
      }

      if (!this.hasValue()) {
        return null;
      }

      if (this.dataEntryList.length > 0) {
        // console.error(`getValue method called on ${this.title} has not yet been inplemented. Please inplement this logic first`);
        // return null;
        return this.dataEntryList;
      } else {
        switch (this.dataLogic.baseType) {
          case 'string':
            return this.dataEntry;

          case 'number':
            return this.dataEntry;

          case 'boolean':
            return this.dataEntry;

          default:
            return null;
        }
      }
    }
  }, {
    key: "hasValue",
    value: function hasValue() {
      if (this.dataEntryList.length > 0) {
        return true;
      }

      if (this.dataEntry !== null || this.dataEntry !== undefined) {
        return true;
      }

      return false;
    }
  }, {
    key: "updateValueAllowed",
    value: function updateValueAllowed() {
      // if has value AND is multipleDataEntry -> can be updated, if has no value -> can be updated.. otherwise NO?
      // if has value AND is onlyGatherOnce = false -> can be updated, if has no value -> can be updated.. otherwise NO
      if (!this.hasValue()) {
        return true;
      }

      if (this.dataEntryList.length > 0 && this.multipleDataEntry) {
        return true;
      }

      if (this.dataEntry !== undefined && this.onlyGatherOnce) {
        return true;
      }

      return false;
    }
  }, {
    key: "addDataEntry",
    value: function addDataEntry(dataEntry) {
      if (!this.isDataEntryValid(dataEntry)) {
        //todo: create a notification system whereby me (the user) is notified through UI instead of console
        console.error('Incompatible dataEntry type with provided dataEntry type');
        return;
      }

      if (this._isBaseTypeOfAllowedListType(this.dataLogic.baseType)) {
        var isArrayDataEntryList = this._getArrayDataEntryList(dataEntry);

        if (isArrayDataEntryList) {
          if (this.multipleDataEntry) {
            if (isArrayDataEntryList !== null) {
              this.dataEntryList = Array.from(new Set([].concat((0, _toConsumableArray2.default)(this.dataEntryList), (0, _toConsumableArray2.default)(isArrayDataEntryList))));
            }
          } else {
            // It is best NOT to use the multipleDataEntry and always use the standard overwrite old data since i'm always getting the old list of messages anyway (and any app also supports always getting your old messages anyway af far as i can tell atm).
            this.dataEntryList = isArrayDataEntryList;
          }
        }
      } else {
        this.dataEntry = dataEntry;
      } // here in this method i do: check if the added data..
      // 1. can be added due to multipleDataEntry setting?
      // -> yep, must also be checked for this
      // 2. must be unique check? if checked, check if given data is unique
      // -> is that the responsibility of the field? or maybe the dataValue object?.. well only the field can control how many entries there already are AND if they're unique!?
      // 3. autoGather.. so idk? call something which gathers the data for this classobject?
      // -> not here, but must be done in tindercontroller
      // 4. if one entry already exists, prevent the addition of multiple entries (e.g. i can change my attractiveness rating of a girl afterwards thus allowing multiple, but if i got a match with her or not is really only added once, thus should be prevented from adding the same data again)
      // -> yup, must also be checked for this

    }
  }, {
    key: "_isBaseTypeSet",
    value: function _isBaseTypeSet(baseType) {
      if (!baseType) {
        console.error("No basetype and/or datalogic checkmethod was set for: ".concat(this.title));
        return false;
      }

      return true;
    }
  }, {
    key: "_isDataEntryEmpty",
    value: function _isDataEntryEmpty(dataEntry) {
      var _this2 = this;

      //todo: should refactor this to 1. convert unknown to a known type and 2. use a enum instead of true/false cause this aint working..
      if (this._isBaseTypeOfAllowedListType(this.dataLogic.baseType) && dataEntry instanceof Array) {
        return dataEntry.every(function (dataEntryItem) {
          if ((0, _typeof2.default)(dataEntryItem) === 'object') {
            return _this2._isObjectEntryEmpty(dataEntryItem);
          } else {
            return _this2._isEntryEmpty(dataEntry);
          }
        });
      }

      if ((0, _typeof2.default)(dataEntry) === 'object' && dataEntry !== null) {
        return this._isObjectEntryEmpty(dataEntry);
      }

      return this._isEntryEmpty(dataEntry);
    }
  }, {
    key: "_isEntryEmpty",
    value: function _isEntryEmpty(dataEntry) {
      if (dataEntry === undefined || dataEntry === null || dataEntry === "") {
        return true;
      }

      return false;
    }
  }, {
    key: "_isObjectEntryEmpty",
    value: function _isObjectEntryEmpty(dataEntry) {
      var objectValues = Object.values(dataEntry);

      if (objectValues.every(function (objectValue) {
        return objectValue === undefined || objectValue === null || objectValue === "";
      })) {
        return true;
      }

      return false;
    }
  }, {
    key: "_isDataEntryUnique",
    value: function _isDataEntryUnique(identifier, dataEntry) {
      return this._uniqueIdentifier.isUniqueEntry(identifier, dataEntry);
    }
  }, {
    key: "_getArrayDataEntryList",
    value: function _getArrayDataEntryList(dataEntry) {
      if (Array.isArray(dataEntry)) {
        return dataEntry;
      }

      return null;
    } //todo: create conversion methods; if i ever decide to;
    // add new data fields
    // change labels, type of data or data content.. to what was the data previously.. 
    // give me a prompt in which i can auto update my content to the newly desired contrent
    // this is for V2!!!

  }, {
    key: "_getTypeOfValue",
    value: function _getTypeOfValue(value) {
      switch ((0, _typeof2.default)(value)) {
        case 'string':
          return 'string';

        case 'number':
          return 'number';

        case 'boolean':
          return 'boolean';

        case 'object':
          return 'object';

        default:
          return null;
      }
    }
  }, {
    key: "_isDataFieldValid",
    value: function _isDataFieldValid() {
      var isBaseTypeSet = this._isBaseTypeSet(this.dataLogic.baseType);

      var isUISettingValid = this._isUISettingValid(this.UISetting);

      return isBaseTypeSet && isUISettingValid ? true : false;
    }
  }, {
    key: "_isUISettingValid",
    value: function _isUISettingValid(UISetting) {
      // if UIrequired is none, only 'none' may be given for field type
      if (UISetting.UIrequired === UIRequired.NONE && UISetting.UIrequiredType !== null) {
        console.error("UIRequired is set to ".concat(UIRequired.NONE, " thus the required type can only be of value ", null));
        return false;
      } // if UIrequired may only be one of certain types defined in UIrequired enum


      if (!Object.values(UIRequired).includes(UISetting.UIrequired)) {
        console.error("UIRequired may only be one of the following types: ".concat(Object.values(UIRequired).toString()));
        return false;
      } // if UIrequiredType may only be one of certain types defined in UIrequiredType enum


      if (UISetting.UIrequiredType !== null && !Object.values(UIRequiredType).includes(UISetting.UIrequiredType)) {
        console.error("UIrequiredType may only be one of the following types: ".concat(Object.values(UIRequiredType).toString(), " or null if UIRequired is set to NONE"));
        return false;
      }

      return true;
    }
  }, {
    key: "_isDataEntryValidForStringList",
    value: function _isDataEntryValidForStringList(dataEntry) {
      var _this3 = this;

      var providedDataEntryList = dataEntry;

      if (!providedDataEntryList.every(function (providedDataEntry) {
        return typeof providedDataEntry === 'string';
      })) {
        console.error("Field ".concat(this.title, " is of type list, but values provided in the array are not of type string. Non-string type lists are currently not supported."));
        return false;
      }

      var providedDataEntryStringList = dataEntry;

      if (!providedDataEntryStringList.every(function (providedDataEntry) {
        return _this3.options.includes(providedDataEntry);
      })) {
        console.error("Values in field ".concat(this.title, " do not match the options provided for this list datafield. Please check and update the values provided or include it into the options for this field."));
        return false;
      }

      return true;
    }
  }, {
    key: "_isBaseTypeOfAllowedListType",
    value: function _isBaseTypeOfAllowedListType(baseType) {
      return baseType === 'specialList' || baseType === 'stringList';
    }
  }]);
  return DataField;
}();

exports.DataField = DataField;

var DataFieldSystemNo = /*#__PURE__*/function (_DataField) {
  (0, _inherits2.default)(DataFieldSystemNo, _DataField);

  var _super = _createSuper(DataFieldSystemNo);

  function DataFieldSystemNo(title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic) {
    (0, _classCallCheck2.default)(this, DataFieldSystemNo);
    return _super.call(this, title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
  }

  (0, _createClass2.default)(DataFieldSystemNo, [{
    key: "getValue",
    value: function getValue(optionalArgumentsObject) {
      var appType = (optionalArgumentsObject === null || optionalArgumentsObject === void 0 ? void 0 : optionalArgumentsObject.hasOwnProperty('appType')) ? optionalArgumentsObject.appType : null;
      var valueObject = this.dataEntry;

      if (Object.prototype.hasOwnProperty.call(valueObject, 'appType') && valueObject['appType'] === appType) {
        return this.dataEntry;
      } else {
        return null;
      }
    }
  }, {
    key: "addDataEntry",
    value: function addDataEntry(dataEntry) {
      if (!this.isDataEntryValid(dataEntry)) {
        //todo: create a notification system whereby me (the user) is notified through UI instead of console
        console.error('Incompatible dataEntry type with provided dataEntry type');
        return;
      }

      this.dataEntry = dataEntry;
    }
  }]);
  return DataFieldSystemNo;
}(DataField);

exports.DataFieldSystemNo = DataFieldSystemNo;

var DataFieldMessages = /*#__PURE__*/function (_DataField2) {
  (0, _inherits2.default)(DataFieldMessages, _DataField2);

  var _super2 = _createSuper(DataFieldMessages);

  function DataFieldMessages(title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic) {
    var _this4;

    (0, _classCallCheck2.default)(this, DataFieldMessages);
    _this4 = _super2.call(this, title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
    _this4.needsToBeUpdated = false;
    return _this4;
  }

  (0, _createClass2.default)(DataFieldMessages, [{
    key: "getValue",
    value: function getValue(optionalArgumentsObject) {
      // console.error(`getValue method called on DataFieldMessages has not yet been inplemented. Please inplement this logic first`);
      // return null;
      return (0, _get2.default)((0, _getPrototypeOf2.default)(DataFieldMessages.prototype), "getValue", this).call(this);
    }
  }, {
    key: "getLastMessage",
    value: function getLastMessage() {
      var messagesListLength = this.dataEntryList.length; //todo: figure out how to do this nicely; inheriting property from base class with a different type

      return messagesListLength > 0 ? this.dataEntryList[messagesListLength - 1] : null;
    }
  }, {
    key: "hasMessages",
    value: function hasMessages() {
      return this.dataEntryList.length > 0 ? true : false;
    }
  }, {
    key: "isNeedsToBeUpdated",
    value: function isNeedsToBeUpdated() {
      return this.needsToBeUpdated;
    }
  }, {
    key: "setNeedsToBeUpdated",
    value: function setNeedsToBeUpdated(needsToBeUpdated) {
      this.needsToBeUpdated = needsToBeUpdated;
    }
  }, {
    key: "updateMessagesList",
    value: function updateMessagesList(updatedMessagesList, forceAdd) {
      var _this5 = this;

      updatedMessagesList = this.removeDuplicateMessages(updatedMessagesList);

      if (updatedMessagesList.length > 0) {
        this.setNeedsToBeUpdated(false);

        if (forceAdd) {
          this.addDataEntry(updatedMessagesList);
        } else {
          if (this.dataEntryList.length < updatedMessagesList.length) {
            this.addDataEntry(updatedMessagesList);
            console.log("WEW, LOOKS LIKE WE GOT A RECORD WHICH CONTAINS FEWER MESSAGES THAN WE GET FROM THE NEW MESSAGES LIST. Should be pretty much everyone INITIALLY?");
            console.log("ALSO; we cannot know for sure if this datarecord will receive the latest messages or not, so let's just simply set this one to needsToBeUpdated true");
            this.setNeedsToBeUpdated(true);
          } else {
            var isAllNewMessagesPresent = updatedMessagesList.every(function (newMessage) {
              var indexNewMessage = _this5.dataEntryList.findIndex(function (dataEntry) {
                return dataEntry.datetime === newMessage.datetime;
              });

              return indexNewMessage !== -1 ? true : false;
            });

            if (!isAllNewMessagesPresent) {
              console.log("OH BOY! LOOKS LIKE WE GOT A RECORD WHICH DOES NOT CONTAIN THE LATEST MESSAGES. WE NEED A TEST SCENARIO FOR THIS");
              this.setNeedsToBeUpdated(true); //todo: 
              // WHAT IF tinder decides to throw away some or all old messages between me and match?
              // and after 5 years i chat to match..
              // thus messagesList is set to updated, and messages are overwritten?
              // (maybe) not relevant now, tinder nicely keeps data from years prior.. but it might happen thus i lose data?
            }
          }
        }
      }
    }
  }, {
    key: "getAllMessages",
    value: function getAllMessages() {
      return this.dataEntryList;
    }
  }, {
    key: "removeDuplicateMessages",
    value: function removeDuplicateMessages(messagesList) {
      var filteredMessageList = [];
      messagesList.forEach(function (message) {
        var indexCurrentMessage = filteredMessageList.findIndex(function (filteredMessage) {
          var isDateTimeEqual = filteredMessage.datetime === message.datetime ? true : false;

          if (isDateTimeEqual) {
            var isAuthorEqual = filteredMessage.author === message.author ? true : false;

            if (isAuthorEqual) {
              var isMessageContentEqual = filteredMessage.message === message.message ? true : false;

              if (isMessageContentEqual) {
                return true;
              } else {
                return false;
              }
            }

            return false;
          }

          return false;
        });

        if (indexCurrentMessage === -1) {
          filteredMessageList.push(message);
        }
      });
      return filteredMessageList;
    }
  }]);
  return DataFieldMessages;
}(DataField);

exports.DataFieldMessages = DataFieldMessages;

var DataFieldReactionSpeedList = /*#__PURE__*/function (_DataField3) {
  (0, _inherits2.default)(DataFieldReactionSpeedList, _DataField3);

  var _super3 = _createSuper(DataFieldReactionSpeedList);

  function DataFieldReactionSpeedList(title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic) {
    (0, _classCallCheck2.default)(this, DataFieldReactionSpeedList);
    return _super3.call(this, title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
  }

  (0, _createClass2.default)(DataFieldReactionSpeedList, [{
    key: "getValue",
    value: function getValue(optionalArgumentsObject) {
      // console.error(`getValue method called on DataFieldMessages has not yet been inplemented. Please inplement this logic first`);
      // return null;
      return (0, _get2.default)((0, _getPrototypeOf2.default)(DataFieldReactionSpeedList.prototype), "getValue", this).call(this);
    }
  }]);
  return DataFieldReactionSpeedList;
}(DataField);

exports.DataFieldReactionSpeedList = DataFieldReactionSpeedList;

var DataFieldReminderList = /*#__PURE__*/function (_DataField4) {
  (0, _inherits2.default)(DataFieldReminderList, _DataField4);

  var _super4 = _createSuper(DataFieldReminderList);

  function DataFieldReminderList(title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic) {
    (0, _classCallCheck2.default)(this, DataFieldReminderList);
    return _super4.call(this, title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
  }

  (0, _createClass2.default)(DataFieldReminderList, [{
    key: "getValue",
    value: function getValue(optionalArgumentsObject) {
      // console.error(`getValue method called on DataFieldMessages has not yet been inplemented. Please inplement this logic first`);
      // return null;
      return (0, _get2.default)((0, _getPrototypeOf2.default)(DataFieldReminderList.prototype), "getValue", this).call(this);
    }
  }]);
  return DataFieldReminderList;
}(DataField);

exports.DataFieldReminderList = DataFieldReminderList;

var DataFieldGhostsList = /*#__PURE__*/function (_DataField5) {
  (0, _inherits2.default)(DataFieldGhostsList, _DataField5);

  var _super5 = _createSuper(DataFieldGhostsList);

  function DataFieldGhostsList(title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic) {
    (0, _classCallCheck2.default)(this, DataFieldGhostsList);
    return _super5.call(this, title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
  }

  (0, _createClass2.default)(DataFieldGhostsList, [{
    key: "getValue",
    value: function getValue(optionalArgumentsObject) {
      // console.error(`getValue method called on DataFieldMessages has not yet been inplemented. Please inplement this logic first`);
      // return null;
      return (0, _get2.default)((0, _getPrototypeOf2.default)(DataFieldGhostsList.prototype), "getValue", this).call(this);
    }
  }, {
    key: "updateMoment",
    value: function updateMoment(updatedTime, updatedStatus) {
      if (this.dataLogic.customCheckClass === null) {
        console.error('Could not update moment; no custom check class was set to check input.');
        return;
      } // if(this.dataLogic.customCheckClass.isValidEntry(updatedTime)){
      // }
      // if(dataGhosted._isValidTimeEntry(updatedTime) && dataGhosted._isValidStatus(updatedStatus)){
      //     this._timeSinceLastMessage = updatedTime;
      //     this._status = updatedStatus;
      // }else{
      //     console.error('Could not update moment. Updated time or updated status invalid');
      // }

    }
  }]);
  return DataFieldGhostsList;
}(DataField);

exports.DataFieldGhostsList = DataFieldGhostsList;

var DataFieldDistances = /*#__PURE__*/function (_DataField6) {
  (0, _inherits2.default)(DataFieldDistances, _DataField6);

  var _super6 = _createSuper(DataFieldDistances);

  function DataFieldDistances(title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic) {
    (0, _classCallCheck2.default)(this, DataFieldDistances);
    return _super6.call(this, title, description, emptyFieldAllowed, UISetting, multipleDataEntry, mustBeUnique, autoGather, onlyGatherOnce, dataLogic);
  }

  (0, _createClass2.default)(DataFieldDistances, [{
    key: "getValue",
    value: function getValue(optionalArgumentsObject) {
      // console.error(`getValue method called on DataFieldMessages has not yet been inplemented. Please inplement this logic first`);
      // return null;
      return (0, _get2.default)((0, _getPrototypeOf2.default)(DataFieldDistances.prototype), "getValue", this).call(this);
    }
  }, {
    key: "containsRecordWithinHours",
    value: function containsRecordWithinHours(hours) {
      var milisecondsInOneHour = 3600000;
      var totalMiliseconds = hours * milisecondsInOneHour;
      var amountInstancesErrorThrown = 0;
      return this.dataEntryList.some(function (dataEntry) {
        if (amountInstancesErrorThrown >= 1) {
          return null;
        } // empty array by default returns false


        if (Object.prototype.hasOwnProperty.call(dataEntry, "dateTime") && typeof dataEntry['dateTime'] === 'string') {
          var amountMSEntryToCurrentDateTime = _dateHelper.DateHelper.getAmountMilisecondesBetweenDates(dataEntry['dateTime'], new Date().toISOString());

          return amountMSEntryToCurrentDateTime && amountMSEntryToCurrentDateTime <= totalMiliseconds ? true : false;
        }

        amountInstancesErrorThrown = amountInstancesErrorThrown + 1;
        console.error("The dateTime keyname for DataFieldDistances entries cannot be found. Please check your datafields & entries on existing records if these still contain the dateTime keyname with a valid datetime.");
      });
    }
  }]);
  return DataFieldDistances;
}(DataField);

exports.DataFieldDistances = DataFieldDistances;
},{"@babel/runtime/helpers/get":"rXSD","@babel/runtime/helpers/inherits":"PhTw","@babel/runtime/helpers/possibleConstructorReturn":"cbGp","@babel/runtime/helpers/getPrototypeOf":"XApn","@babel/runtime/helpers/typeof":"FlpK","@babel/runtime/helpers/toConsumableArray":"I9dH","@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","../util/uniqueEntryChecker":"jzT7","../util/dateHelper":"EDRb"}],"G9sB":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataCheckSimple = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataCheckSimple = /*#__PURE__*/function () {
  function dataCheckSimple() {
    (0, _classCallCheck2.default)(this, dataCheckSimple);
  }

  (0, _createClass2.default)(dataCheckSimple, [{
    key: "isValidEntry",
    value: function isValidEntry(listEntry) {
      console.warn('No validators set for ???');
      return true;
    }
  }]);
  return dataCheckSimple;
}();

exports.dataCheckSimple = dataCheckSimple;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH"}],"DIZ9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataCheckDate = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _dataCheckSimple2 = require("./dataCheckSimple");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var dataCheckDate = /*#__PURE__*/function (_dataCheckSimple) {
  (0, _inherits2.default)(dataCheckDate, _dataCheckSimple);

  var _super = _createSuper(dataCheckDate);

  function dataCheckDate() {
    (0, _classCallCheck2.default)(this, dataCheckDate);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(dataCheckDate, [{
    key: "isValidEntry",
    value: function isValidEntry(dateValue) {
      return Date.parse(dateValue) ? true : false; //todo: TEMPORARY SOLUTION, refactor to use momentjs (but typescript version instead!)
    }
  }]);
  return dataCheckDate;
}(_dataCheckSimple2.dataCheckSimple);

exports.dataCheckDate = dataCheckDate;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","@babel/runtime/helpers/inherits":"PhTw","@babel/runtime/helpers/possibleConstructorReturn":"cbGp","@babel/runtime/helpers/getPrototypeOf":"XApn","./dataCheckSimple":"G9sB"}],"ev3X":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataAttractiveness = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _dataCheckSimple2 = require("./dataCheckSimple");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var dataAttractiveness = /*#__PURE__*/function (_dataCheckSimple) {
  (0, _inherits2.default)(dataAttractiveness, _dataCheckSimple);

  var _super = _createSuper(dataAttractiveness);

  function dataAttractiveness() {
    (0, _classCallCheck2.default)(this, dataAttractiveness);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(dataAttractiveness, [{
    key: "isValidEntry",
    value: function isValidEntry(score) {
      if (!Number.isInteger(score)) {
        return false;
      }

      return score >= 1 && score <= 10 ? true : false; //todo: test if it accepts 8.5, 7.5 etc.
    }
  }]);
  return dataAttractiveness;
}(_dataCheckSimple2.dataCheckSimple);

exports.dataAttractiveness = dataAttractiveness;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","@babel/runtime/helpers/inherits":"PhTw","@babel/runtime/helpers/possibleConstructorReturn":"cbGp","@babel/runtime/helpers/getPrototypeOf":"XApn","./dataCheckSimple":"G9sB"}],"kTOs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataConversationVibe = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _dataCheckSimple2 = require("./dataCheckSimple");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var dataConversationVibe = /*#__PURE__*/function (_dataCheckSimple) {
  (0, _inherits2.default)(dataConversationVibe, _dataCheckSimple);

  var _super = _createSuper(dataConversationVibe);

  function dataConversationVibe() {
    (0, _classCallCheck2.default)(this, dataConversationVibe);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(dataConversationVibe, [{
    key: "isValidEntry",
    value: function isValidEntry(score) {
      if (!Number.isInteger(score)) {
        return false;
      }

      return score >= 1 && score <= 10 ? true : false; //todo: test if it does not accept any number with decimals, less than 1 or greater than 6.
    }
  }]);
  return dataConversationVibe;
}(_dataCheckSimple2.dataCheckSimple);

exports.dataConversationVibe = dataConversationVibe;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","@babel/runtime/helpers/inherits":"PhTw","@babel/runtime/helpers/possibleConstructorReturn":"cbGp","@babel/runtime/helpers/getPrototypeOf":"XApn","./dataCheckSimple":"G9sB"}],"Heea":[function(require,module,exports) {
var define;
var global = arguments[3];
//! moment.js locale configuration
//! locale : Dutch [nl]
//! author : Joris Röling : https://github.com/jorisroling
//! author : Jacob Middag : https://github.com/middagj

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';

    //! moment.js locale configuration

    var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split(
            '_'
        ),
        monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split(
            '_'
        ),
        monthsParse = [
            /^jan/i,
            /^feb/i,
            /^maart|mrt.?$/i,
            /^apr/i,
            /^mei$/i,
            /^jun[i.]?$/i,
            /^jul[i.]?$/i,
            /^aug/i,
            /^sep/i,
            /^okt/i,
            /^nov/i,
            /^dec/i,
        ],
        monthsRegex = /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

    var nl = moment.defineLocale('nl', {
        months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split(
            '_'
        ),
        monthsShort: function (m, format) {
            if (!m) {
                return monthsShortWithDots;
            } else if (/-MMM-/.test(format)) {
                return monthsShortWithoutDots[m.month()];
            } else {
                return monthsShortWithDots[m.month()];
            }
        },

        monthsRegex: monthsRegex,
        monthsShortRegex: monthsRegex,
        monthsStrictRegex: /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,
        monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

        monthsParse: monthsParse,
        longMonthsParse: monthsParse,
        shortMonthsParse: monthsParse,

        weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split(
            '_'
        ),
        weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
        weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
        weekdaysParseExact: true,
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD-MM-YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm',
        },
        calendar: {
            sameDay: '[vandaag om] LT',
            nextDay: '[morgen om] LT',
            nextWeek: 'dddd [om] LT',
            lastDay: '[gisteren om] LT',
            lastWeek: '[afgelopen] dddd [om] LT',
            sameElse: 'L',
        },
        relativeTime: {
            future: 'over %s',
            past: '%s geleden',
            s: 'een paar seconden',
            ss: '%d seconden',
            m: 'één minuut',
            mm: '%d minuten',
            h: 'één uur',
            hh: '%d uur',
            d: 'één dag',
            dd: '%d dagen',
            w: 'één week',
            ww: '%d weken',
            M: 'één maand',
            MM: '%d maanden',
            y: 'één jaar',
            yy: '%d jaar',
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
        ordinal: function (number) {
            return (
                number +
                (number === 1 || number === 8 || number >= 20 ? 'ste' : 'de')
            );
        },
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4, // The week that contains Jan 4th is the first week of the year.
        },
    });

    return nl;

})));

},{"../moment":"ZCrj"}],"qQWw":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Check = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var moment = _interopRequireWildcard(require("moment"));

require("moment/locale/nl");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

moment.locale('nl');

var Check = /*#__PURE__*/function () {
  function Check() {
    (0, _classCallCheck2.default)(this, Check);
  }

  (0, _createClass2.default)(Check, null, [{
    key: "isValidDate",
    value: function isValidDate(dateString) {
      return moment.default(dateString, true).isValid() ? true : false;
    }
  }, {
    key: "isPositiveNumberEntry",
    value: function isPositiveNumberEntry(numberEntry) {
      return numberEntry >= 0 ? true : false;
    }
  }]);
  return Check;
}();

exports.Check = Check;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","moment":"ZCrj","moment/locale/nl":"Heea"}],"H79e":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GhostStatus = exports.dataItemGhost = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataItemGhost = function dataItemGhost(number, timeSinceLastMessageMS, status) {
  (0, _classCallCheck2.default)(this, dataItemGhost);
  this._number = number;
  this._timeSinceLastMessageMS = timeSinceLastMessageMS;
  this._status = status;
};

exports.dataItemGhost = dataItemGhost;
var GhostStatus;
exports.GhostStatus = GhostStatus;

(function (GhostStatus) {
  GhostStatus["REPLIED"] = "answered";
  GhostStatus["NOT_REPLIED_TO_REMINDER"] = "unanswered-to-reminder";
  GhostStatus["NOT_REPLIED"] = "unanswered";
  GhostStatus["BLOCKED"] = "block";
})(GhostStatus || (exports.GhostStatus = GhostStatus = {}));
},{"@babel/runtime/helpers/classCallCheck":"kUj2"}],"rsXj":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataCheck = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataCheck = /*#__PURE__*/function () {
  function dataCheck() {
    (0, _classCallCheck2.default)(this, dataCheck);
    this.requiredPropertiesList = [];
  }

  (0, _createClass2.default)(dataCheck, [{
    key: "isValidEntry",
    value: function isValidEntry(listEntry) {
      console.warn("No validations set for ???."); //todo: provide title from dataField?

      return true;
    }
  }, {
    key: "propertyChecker",
    value: function propertyChecker(requiredPropertiesList, listEntry) {
      return requiredPropertiesList.every(function (property) {
        if (!Object.prototype.hasOwnProperty.call(listEntry, property.label)) {
          console.error("Property ".concat(property.label, " is missing from provided value ").concat(listEntry, " for ???."));
          return false;
        }

        return true;
      });
    }
  }, {
    key: "argumentTypeChecker",
    value: function argumentTypeChecker(requiredPropertiesList, listEntry) {
      return requiredPropertiesList.every(function (property) {
        if (!listEntry[property.label]) {
          return true;
        }

        if ((0, _typeof2.default)(listEntry[property.label]) === property.type) {
          return true;
        }

        console.error("Property ".concat(property.label, " value is not of the required type (").concat(property.type, ") but is of type ").concat((0, _typeof2.default)(listEntry[property.label]), ". Value given: ").concat(listEntry[property.label]));
        return false;
      });
    }
  }, {
    key: "argumentChecker",
    value: function argumentChecker(requiredPropertiesList, listEntry) {
      console.warn("No validations set for values of properties from ???");
      return true;
    }
  }, {
    key: "checkListEntryByPropertiesAndTypes",
    value: function checkListEntryByPropertiesAndTypes(requiredPropertiesList, listEntry) {
      var result = false;
      result = this.propertyChecker(requiredPropertiesList, listEntry);
      result = result ? this.argumentTypeChecker(this.requiredPropertiesList, listEntry) : false;
      return result;
    }
  }, {
    key: "getListEntryAsObjectList",
    value: function getListEntryAsObjectList(listEntry) {
      if (!Array.isArray(listEntry)) {
        console.error("The provided value for ??? is not a list");
        return null;
      }

      return listEntry;
    }
  }]);
  return dataCheck;
}();

exports.dataCheck = dataCheck;
},{"@babel/runtime/helpers/typeof":"FlpK","@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH"}],"UkfS":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataCheckGhosts = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _check = require("../../util/check");

var _dataItemGhost = require("../dataItems/dataItemGhost");

var _dataCheck2 = require("./dataCheck");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var dataCheckGhosts = /*#__PURE__*/function (_dataCheck) {
  (0, _inherits2.default)(dataCheckGhosts, _dataCheck);

  var _super = _createSuper(dataCheckGhosts);

  function dataCheckGhosts() {
    var _this;

    (0, _classCallCheck2.default)(this, dataCheckGhosts);
    _this = _super.apply(this, arguments);
    _this.requiredPropertiesList = [{
      label: 'number',
      type: 'number'
    }, {
      label: 'timeSinceLastMessageMS',
      type: 'number'
    }, {
      label: 'status',
      type: 'string'
    }];
    _this._numberOfInstancesList = [];
    return _this;
  }

  (0, _createClass2.default)(dataCheckGhosts, [{
    key: "isValidEntry",
    value: function isValidEntry(listEntry) {
      var _this2 = this;

      var objList = this.getListEntryAsObjectList(listEntry);
      var isPropertiesAndArgumentsValid = false;

      if (!objList) {
        return false;
      }

      if (objList.length === 0) {
        return true;
      }

      isPropertiesAndArgumentsValid = objList.every(function (obj) {
        if (_this2.checkListEntryByPropertiesAndTypes(_this2.requiredPropertiesList, obj)) {
          return _this2.argumentChecker(_this2.requiredPropertiesList, obj);
        }

        return false;
      });
      this.resetUniqueNumber();
      return isPropertiesAndArgumentsValid;
    }
  }, {
    key: "argumentChecker",
    value: function argumentChecker(requiredPropertiesList, listEntry) {
      var isNumberPositiveAndUnique = _check.Check.isPositiveNumberEntry(listEntry[requiredPropertiesList[0].label]) && this._isUniqueNumber(listEntry[requiredPropertiesList[0].label]);

      var isTimeSinceLastMessageMSPositive = _check.Check.isPositiveNumberEntry(listEntry[requiredPropertiesList[1].label]);

      var isStatusValid = this._isValidStatus(listEntry[requiredPropertiesList[2].label]);

      return isNumberPositiveAndUnique && isTimeSinceLastMessageMSPositive && isStatusValid;
    }
  }, {
    key: "_isValidStatus",
    value: function _isValidStatus(statusEntry) {
      return statusEntry === _dataItemGhost.GhostStatus.BLOCKED || statusEntry === _dataItemGhost.GhostStatus.NOT_REPLIED || statusEntry === _dataItemGhost.GhostStatus.REPLIED || statusEntry === _dataItemGhost.GhostStatus.NOT_REPLIED_TO_REMINDER ? true : false;
    }
  }, {
    key: "_isUniqueNumber",
    value: function _isUniqueNumber(no) {
      if (this._numberOfInstancesList.findIndex(function (numberedInstance) {
        return numberedInstance === no;
      }) === -1) {
        this._numberOfInstancesList.push(no);

        return true;
      } else {
        console.error("Number already exists");
        return false;
      }
    }
  }, {
    key: "resetUniqueNumber",
    value: function resetUniqueNumber() {
      this._numberOfInstancesList = [];
    }
  }]);
  return dataCheckGhosts;
}(_dataCheck2.dataCheck);

exports.dataCheckGhosts = dataCheckGhosts;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","@babel/runtime/helpers/inherits":"PhTw","@babel/runtime/helpers/possibleConstructorReturn":"cbGp","@babel/runtime/helpers/getPrototypeOf":"XApn","../../util/check":"qQWw","../dataItems/dataItemGhost":"H79e","./dataCheck":"rsXj"}],"Gy3n":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataCheckReactionSpeed = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _dataCheck2 = require("./dataCheck");

var _dateHelper = require("../../util/dateHelper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var dataCheckReactionSpeed = /*#__PURE__*/function (_dataCheck) {
  (0, _inherits2.default)(dataCheckReactionSpeed, _dataCheck);

  var _super = _createSuper(dataCheckReactionSpeed);

  function dataCheckReactionSpeed() {
    var _this;

    (0, _classCallCheck2.default)(this, dataCheckReactionSpeed);
    _this = _super.apply(this, arguments);
    _this.requiredPropertiesList = [{
      label: 'datetimeMyLastMessage',
      type: 'string'
    }, {
      label: 'datetimeTheirResponse',
      type: 'string'
    }, {
      label: 'differenceInMS',
      type: 'number'
    }];
    return _this;
  }

  (0, _createClass2.default)(dataCheckReactionSpeed, [{
    key: "isValidEntry",
    value: function isValidEntry(listEntry) {
      var _this2 = this;

      var objList = this.getListEntryAsObjectList(listEntry);

      if (!objList) {
        return false;
      }

      if (objList.length === 0) {
        return true;
      }

      return objList.every(function (obj) {
        if (_this2.checkListEntryByPropertiesAndTypes(_this2.requiredPropertiesList, obj)) {
          return _this2.argumentChecker(_this2.requiredPropertiesList, obj);
        }

        return false;
      });
    }
  }, {
    key: "argumentChecker",
    value: function argumentChecker(requiredPropertiesList, listEntry) {
      var hasRequiredArguments = requiredPropertiesList.every(function (requiredProperty) {
        if (requiredProperty.label === 'datetimeMyLastMessage' || requiredProperty.label === 'datetimeTheirResponse') {
          return _dateHelper.DateHelper.isValidDate(listEntry[requiredProperty.label]);
        } else {
          return typeof listEntry[requiredProperty.label] === 'number';
        }
      });

      var differenceBetweenDates = _dateHelper.DateHelper.getAmountMilisecondesBetweenDates(listEntry[requiredPropertiesList[0].label], listEntry[requiredPropertiesList[1].label]);

      var isDifferenceDatesPositiveNumber = differenceBetweenDates !== undefined && differenceBetweenDates > -1 ? true : false;
      return hasRequiredArguments && isDifferenceDatesPositiveNumber;
    }
  }]);
  return dataCheckReactionSpeed;
}(_dataCheck2.dataCheck);

exports.dataCheckReactionSpeed = dataCheckReactionSpeed;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","@babel/runtime/helpers/inherits":"PhTw","@babel/runtime/helpers/possibleConstructorReturn":"cbGp","@babel/runtime/helpers/getPrototypeOf":"XApn","./dataCheck":"rsXj","../../util/dateHelper":"EDRb"}],"fsCs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataCheckReminders = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _check = require("../../util/check");

var _dataCheck2 = require("./dataCheck");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var dataCheckReminders = /*#__PURE__*/function (_dataCheck) {
  (0, _inherits2.default)(dataCheckReminders, _dataCheck);

  var _super = _createSuper(dataCheckReminders);

  function dataCheckReminders() {
    var _this;

    (0, _classCallCheck2.default)(this, dataCheckReminders);
    _this = _super.apply(this, arguments);
    _this.requiredPropertiesList = [{
      label: 'number',
      type: 'number'
    }, {
      label: 'datetimeMyLastMessage',
      type: 'string'
    }, {
      label: 'datetimeReminderSent',
      type: 'string'
    }, {
      label: 'textContentReminder',
      type: 'string'
    }, {
      label: 'hasGottenReply',
      type: 'boolean'
    }];
    return _this;
  }

  (0, _createClass2.default)(dataCheckReminders, [{
    key: "isValidEntry",
    value: function isValidEntry(listEntry) {
      var _this2 = this;

      //const newlistEntry = typeof listEntry === 'object' ?  <Record<string, unknown>>listEntry : {};
      var objList = this.getListEntryAsObjectList(listEntry); // TODO
      // for other files;
      // refactor all listEntry inputs type to Record<string, unknown> (like done here..)
      // ALSO; first check if listEntry is of type object (which may be part of a util type check method, which can also recognize object type a.k.a. record), if so.. continue
      // refactor requiredPropertiesList into objects; key = name of property, value = type of property (string, boolean etc.)
      // make a new method on dataCheck level (propertiestype checker)
      // have the method check if the arguments of the correct type
      // if above is true; return a new (casted or created) record of the listEntry.. NO! CREATE A SEPERATE METHOD FOR THIS. CREATE THE DATAITEM INSTANCE INSTEAD
      // which can be given to argument checker.. which in turns further checks the arguments for like; if the datestring is correct, number is in the correct range etc.
      // refactor the argument checker TO NOT CHECK types.. but only what is mentioned above

      if (!objList) {
        return false;
      }

      if (objList.length === 0) {
        return true;
      }

      return objList.every(function (obj) {
        if (_this2.checkListEntryByPropertiesAndTypes(_this2.requiredPropertiesList, obj)) {
          return _this2.argumentChecker(_this2.requiredPropertiesList, obj);
        }

        return false;
      });
    }
  }, {
    key: "argumentChecker",
    value: function argumentChecker(requiredPropertiesList, listEntry) {
      var result = false;
      result = _check.Check.isValidDate(listEntry[requiredPropertiesList[0].label]);
      result = _check.Check.isValidDate(listEntry[requiredPropertiesList[1].label]);
      result = String(listEntry[requiredPropertiesList[2].label]).length > 0 ? true : false;
      return result;
    }
  }]);
  return dataCheckReminders;
}(_dataCheck2.dataCheck);

exports.dataCheckReminders = dataCheckReminders;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","@babel/runtime/helpers/inherits":"PhTw","@babel/runtime/helpers/possibleConstructorReturn":"cbGp","@babel/runtime/helpers/getPrototypeOf":"XApn","../../util/check":"qQWw","./dataCheck":"rsXj"}],"c9VG":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataCheckSystemId = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataCheckSystemId = /*#__PURE__*/function () {
  function dataCheckSystemId() {
    (0, _classCallCheck2.default)(this, dataCheckSystemId);
    this.allowedPropertiesList = ['tinder', 'happn'];
  }

  (0, _createClass2.default)(dataCheckSystemId, [{
    key: "isValidEntry",
    value: function isValidEntry(value) {
      var isAllowedObject = false;
      var hasAllowedSingleAppType = false;
      var isValueString = false;

      if ((0, _typeof2.default)(value) === 'object') {
        var allowedObject = value;
        isAllowedObject = Object.entries(allowedObject).length === 2 || Object.entries(allowedObject).length === 3 ? true : false;

        if (Object.prototype.hasOwnProperty.call(value, 'appType') && Object.prototype.hasOwnProperty.call(value, 'id') || Object.prototype.hasOwnProperty.call(value, 'tempId')) {
          if (typeof allowedObject['appType'] === 'string') {
            hasAllowedSingleAppType = this.allowedPropertiesList.some(function (allowedProperty) {
              return allowedProperty === allowedObject['appType'];
            });
          } else {
            console.error('Property appType is not set on dataField SystemId');
          }

          if (typeof allowedObject['id'] === 'string' && allowedObject['id'].length > 0 || typeof allowedObject['tempId'] === 'string' && allowedObject['tempId'].length > 0) {
            isValueString = true;
          } else {
            console.error('Property id or tempId is not set on dataField SystemId');
          }
        }
      } else {
        console.error('Provided value is not an object for dataField SystemId');
      }

      return isAllowedObject && hasAllowedSingleAppType && isValueString ? true : false;
    }
  }]);
  return dataCheckSystemId;
}();

exports.dataCheckSystemId = dataCheckSystemId;
},{"@babel/runtime/helpers/typeof":"FlpK","@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH"}],"p39B":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataCheckMessage = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _dateHelper = require("../../util/dateHelper");

var _dataCheck2 = require("./dataCheck");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var dataCheckMessage = /*#__PURE__*/function (_dataCheck) {
  (0, _inherits2.default)(dataCheckMessage, _dataCheck);

  var _super = _createSuper(dataCheckMessage);

  function dataCheckMessage() {
    var _this;

    (0, _classCallCheck2.default)(this, dataCheckMessage);
    _this = _super.apply(this, arguments);
    _this.requiredPropertiesList = [{
      label: 'message',
      type: 'string'
    }, {
      label: 'datetime',
      type: 'string'
    }, {
      label: 'author',
      type: 'string'
    }];
    return _this;
  }

  (0, _createClass2.default)(dataCheckMessage, [{
    key: "isValidEntry",
    value: function isValidEntry(listEntry) {
      var _this2 = this;

      var objList = this.getListEntryAsObjectList(listEntry);
      var isPropertiesAndArgumentsValid = false;

      if (!objList) {
        return false;
      }

      if (objList.length === 0) {
        return true;
      }

      isPropertiesAndArgumentsValid = objList.every(function (obj) {
        if (_this2.checkListEntryByPropertiesAndTypes(_this2.requiredPropertiesList, obj)) {
          return _this2.argumentChecker(_this2.requiredPropertiesList, obj);
        }

        return false;
      });
      return isPropertiesAndArgumentsValid;
    }
  }, {
    key: "argumentChecker",
    value: function argumentChecker(requiredPropertiesList, listEntry) {
      if (listEntry[requiredPropertiesList[0].label] === "" && listEntry[requiredPropertiesList[1].label] === "" && listEntry[requiredPropertiesList[2].label] === "") {
        // if all are undefined it means the message is empty/non-existant. No need to check this.
        return true;
      }

      var isMessage = typeof listEntry[requiredPropertiesList[0].label] === 'string' ? true : false;
      var hasTimestamp = typeof listEntry[requiredPropertiesList[1].label] === 'string' && _dateHelper.DateHelper.isValidDate(listEntry[requiredPropertiesList[1].label]) ? true : false;

      var hasAuthor = this._hasAuthor(listEntry[requiredPropertiesList[2].label]);

      return isMessage && hasTimestamp && hasAuthor;
    }
  }, {
    key: "_hasAuthor",
    value: function _hasAuthor(value) {
      if (value === "") {
        return true;
      }

      if (typeof value === 'string') {
        if (value === 'me' || value === 'match') {
          return true;
        }

        console.error('Author field cannot contain any other value than "me" or "match" indicating the author of this message');
        return false;
      }

      return false;
    }
  }]);
  return dataCheckMessage;
}(_dataCheck2.dataCheck);

exports.dataCheckMessage = dataCheckMessage;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","@babel/runtime/helpers/inherits":"PhTw","@babel/runtime/helpers/possibleConstructorReturn":"cbGp","@babel/runtime/helpers/getPrototypeOf":"XApn","../../util/dateHelper":"EDRb","./dataCheck":"rsXj"}],"Kjgl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataCheckDistances = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _check = require("../../util/check");

var _dataCheck2 = require("./dataCheck");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var dataCheckDistances = /*#__PURE__*/function (_dataCheck) {
  (0, _inherits2.default)(dataCheckDistances, _dataCheck);

  var _super = _createSuper(dataCheckDistances);

  function dataCheckDistances() {
    var _this;

    (0, _classCallCheck2.default)(this, dataCheckDistances);
    _this = _super.apply(this, arguments);
    _this.requiredPropertiesList = [{
      label: 'dateTime',
      type: 'string'
    }, {
      label: 'distanceInKM',
      type: 'number'
    }];
    return _this;
  }

  (0, _createClass2.default)(dataCheckDistances, [{
    key: "isValidEntry",
    value: function isValidEntry(listEntry) {
      var _this2 = this;

      var objList = this.getListEntryAsObjectList(listEntry);
      var isPropertiesAndArgumentsValid = false;

      if (!objList) {
        return false;
      }

      if (objList.length === 0) {
        return true;
      }

      isPropertiesAndArgumentsValid = objList.every(function (obj) {
        if (_this2.checkListEntryByPropertiesAndTypes(_this2.requiredPropertiesList, obj)) {
          return _this2.argumentChecker(_this2.requiredPropertiesList, obj);
        }

        return false;
      });
      return isPropertiesAndArgumentsValid;
    }
  }, {
    key: "argumentChecker",
    value: function argumentChecker(requiredPropertiesList, listEntry) {
      var isValidDate = _check.Check.isValidDate(listEntry[requiredPropertiesList[0].label]);

      var isPositiveNumber = _check.Check.isPositiveNumberEntry(listEntry[requiredPropertiesList[1].label]);

      return isValidDate && isPositiveNumber;
    }
  }]);
  return dataCheckDistances;
}(_dataCheck2.dataCheck);

exports.dataCheckDistances = dataCheckDistances;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","@babel/runtime/helpers/inherits":"PhTw","@babel/runtime/helpers/possibleConstructorReturn":"cbGp","@babel/runtime/helpers/getPrototypeOf":"XApn","../../util/check":"qQWw","./dataCheck":"rsXj"}],"mqnv":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataCheckListStrings = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _dataCheck2 = require("./dataCheck");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var dataCheckListStrings = /*#__PURE__*/function (_dataCheck) {
  (0, _inherits2.default)(dataCheckListStrings, _dataCheck);

  var _super = _createSuper(dataCheckListStrings);

  function dataCheckListStrings() {
    (0, _classCallCheck2.default)(this, dataCheckListStrings);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(dataCheckListStrings, [{
    key: "isValidEntry",
    value: function isValidEntry(listEntry) {
      if (Array.isArray(listEntry)) {
        var isEveryListItemEntryString = listEntry.every(function (listEntryItem) {
          return typeof listEntryItem === 'string';
        });

        if (isEveryListItemEntryString) {
          return true;
        }

        console.error("Every value received in ".concat(listEntry, " needs to be a string"));
        return false;
      }

      console.error("Data received: ".concat(listEntry, " is not an array whilst an array was expected."));
      return false;
    }
  }]);
  return dataCheckListStrings;
}(_dataCheck2.dataCheck);

exports.dataCheckListStrings = dataCheckListStrings;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","@babel/runtime/helpers/inherits":"PhTw","@babel/runtime/helpers/possibleConstructorReturn":"cbGp","@babel/runtime/helpers/getPrototypeOf":"XApn","./dataCheck":"rsXj"}],"Vg3b":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataRecord = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _dataField = require("./dataField");

var _dataCheckDate = require("./dataCheckLogic/dataCheckDate");

var _dataCheckAttractiveness = require("./dataCheckLogic/dataCheckAttractiveness");

var _dataCheckConversationVibe = require("./dataCheckLogic/dataCheckConversationVibe");

var _dataCheckGhosts = require("./dataCheckLogic/dataCheckGhosts");

var _dataCheckReactionSpeed = require("./dataCheckLogic/dataCheckReactionSpeed");

var _dataCheckReminders = require("./dataCheckLogic/dataCheckReminders");

var _dataCheckSystemId = require("./dataCheckLogic/dataCheckSystemId");

var _dataCheckMessage = require("./dataCheckLogic/dataCheckMessage");

var _dataCheckDistances = require("./dataCheckLogic/dataCheckDistances");

var _dataCheckListStrings = require("./dataCheckLogic/dataCheckListStrings");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataRecord = /*#__PURE__*/function () {
  function DataRecord() {
    var _this = this;

    (0, _classCallCheck2.default)(this, DataRecord);

    /*
        Output:
              System-no                   - {appType: 'xxxx', id: 'x6x'}
        No                          - int
        Datum-liket                 - string datetime
        Naam                        - string any
        Leeftijd                    - int
        Heeft-profieltekst          - boolean
        Heeft-zinnige-profieltekst  - boolean
        Geverifieerd                - boolean
        Aantrekkelijkheidsscore     - int
        Liked/disliked              - boolean
        Match                       - boolean
        Datum-match                 - string datetime
        Ander-eerste-bericht        - boolean
        Ander-gereageerd            - boolean
        Gesprek-op-gang             - boolean
        Gevoel-van-gemak-gesprek    - int
        Hoe-vaak-ghost              - [ {'datetime after time expired', 'time passed since my last message'} ]
        Nummer-verkregen            - boolean
        Reactie-snelheid            - [ {'time passed between my message to person and their first response'} ]
        Blocked-of-geen-contact     - string 'blocked' |  'said-no-contact' | 'available'
        Geinteresseerd-sex          - boolean
        Potentiele-klik             - boolean
        Notities                    - string any
        */
    //todo: to ensure proper nesting without errors; ensure the datafield labels / headers ONLY contain alphanumeric characters AND dashes.. nothing else
    //todo: maybe needs a systemNo or something? Just like No but specifically for the system
    this.usedDataFields = [//Mandatory data fields
    new _dataField.DataFieldSystemNo('System-no', 'The number the system of the datingapp assigned this person to', false, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, true, {
      baseType: 'specialList',
      customCheckClass: new _dataCheckSystemId.dataCheckSystemId()
    }), new _dataField.DataField('No', 'The number of the person for my app internaly', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, true, false, true, {
      baseType: 'number',
      customCheckClass: null
    }), new _dataField.DataFieldMessages('Messages', 'The messages sent between me and my match', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'specialList',
      customCheckClass: new _dataCheckMessage.dataCheckMessage()
    }), new _dataField.DataField('Last-updated', 'The datetime this record has been last updated (including messages)', false, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'string',
      customCheckClass: new _dataCheckDate.dataCheckDate()
    }), // need to keep track of this myself, but since I'M swiping/liking this will not be a problem 
    new _dataField.DataField('Date-liked-or-passed', 'The datetime when I gave the like/sent my first message/disliked/counsiously ignored this potential person', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, true, {
      baseType: 'string',
      customCheckClass: new _dataCheckDate.dataCheckDate()
    }), new _dataField.DataField('Name', 'The name of the person', true, {
      UIrequired: _dataField.UIRequired.SELECT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.ALPHANUMERIC_INPUT
    }, false, false, true, true, {
      baseType: 'string',
      customCheckClass: null
    }), new _dataField.DataField('Age', 'The age of the person', true, {
      UIrequired: _dataField.UIRequired.SELECT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.NUMERIC_INPUT
    }, false, false, true, true, {
      baseType: 'number',
      customCheckClass: null
    }), new _dataField.DataField('City', 'The city this person lives in claimed by themself or tinder', true, {
      UIrequired: _dataField.UIRequired.CHAT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.ALPHANUMERIC_INPUT
    }, false, false, true, false, {
      baseType: 'string',
      customCheckClass: null
    }), new _dataField.DataField('Job', 'The claimed job title this person holds', true, {
      UIrequired: _dataField.UIRequired.CHAT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.ALPHANUMERIC_INPUT
    }, false, false, true, false, {
      baseType: 'string',
      customCheckClass: null
    }), new _dataField.DataField('Has-profiletext', 'Wether or not this person has some text on the profile', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, true, true, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Has-usefull-profiletext', 'Wether or not this person has some usefull text on the profile', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Seems-fake', 'If a profile just seems too good to be true or is a pornstar quality of sorts', false, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Seems-empty', 'If a profile appear to have no identifying info whatsoever, maybe even simply a blank picture', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Seems-obese', 'If a profile seems to be very overweight to obese to worse than obese', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Seems-toppick', 'If a profile seems to be very attractive a normal person would never match with (i.e. instagram model like)', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Is-uitblinker-for-Me', 'If a match is very physically attractive and/or has a great personality to a degree that I (the creator of this app) would normally never dream of matching with such a hot & cool person', true, {
      UIrequired: _dataField.UIRequired.CHAT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Liked-me-first-is-instant-match', 'If this person liked me first thus resulting in an instant match upon me liking this person. Must set this field manually, if the match is not instant then I liked the person first', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Is-gold-match', 'If a match is thanks to Tinder gold or not', true, {
      UIrequired: _dataField.UIRequired.CHAT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Needs-profile-update', 'If a match profile details need to be updated for this record', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Needs-messages-update', 'If a match messages need to be updated for this record', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Needs-reminder', 'If a match did not respond thus needs a reminder', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataFieldDistances('Distance-in-km', 'The reported distance of this person relative to me on a given datetime', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, true, false, true, false, {
      baseType: 'specialList',
      customCheckClass: new _dataCheckDistances.dataCheckDistances()
    }), new _dataField.DataField('School', 'The claimed school this person attends/attended', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, true, true, {
      baseType: 'string',
      customCheckClass: null
    }), new _dataField.DataField('Gender', 'The gender of this person', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, true, {
      baseType: 'string',
      customCheckClass: null
    }), new _dataField.DataField('Interests', 'The interests of this person', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, true, false, true, false, {
      baseType: 'specialList',
      customCheckClass: new _dataCheckListStrings.dataCheckListStrings()
    }), new _dataField.DataField('Type-of-match-or-like', 'The type of match or like me and my match might have exchanged', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, true, false, false, false, {
      baseType: 'specialList',
      customCheckClass: new _dataCheckListStrings.dataCheckListStrings()
    }), new _dataField.DataField('Is-verified', 'Wether or not this person is verified', true, {
      UIrequired: _dataField.UIRequired.SELECT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, true, true, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Amount-of-pictures', 'The amount of pictures this person uses on their profile at the time of matching', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, true, true, {
      baseType: 'number',
      customCheckClass: null
    }), new _dataField.DataField('Attractiveness-score', 'The attractiveness-level for this person', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.SLIDER
    }, false, false, false, false, {
      baseType: 'number',
      customCheckClass: new _dataCheckAttractiveness.dataAttractiveness()
    }), new _dataField.DataField('Height', 'The (estimated) height of this person', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.MULTISELECT
    }, false, false, false, false, {
      baseType: 'stringList',
      customCheckClass: new _dataCheckListStrings.dataCheckListStrings()
    }, ['seems-short < 1.60m', 'is-short < 1.60m', 'seems-normal >= 1.60-1.70m', 'is-normal >= 1.60-1.70m', 'seems-tall > 1.70-1.80m', 'is-tall > 1.70-1.80m', 'seems-very-tall > 1.80m', 'is-very-tall > 1.80m', 'indetermineable-height']), new _dataField.DataField('Details-tags', 'Details I assume or know about this person to be true', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.MULTISELECT
    }, false, false, false, false, {
      baseType: 'stringList',
      customCheckClass: new _dataCheckListStrings.dataCheckListStrings()
    }, ['seems-mom', 'is-mom', 'seems-prettier-in-real-life', 'is-prettier-in-real-life', 'has-big-*****-not-obese', 'unclear-or-no-fullbody', 'seems-chubby', 'is-chubby', 'seems-has-humor', 'has-humor', 'seems-has-MY-humor', 'has-MY-humor', 'is-tourist', 'is-immigrant-or-expat', 'non-caucasian-but-Dutch', 'interested-in-ons', 'interested-in-fwb', 'interested-in-relationship-only', 'interested-in-friends-only', 'does-not-want-(more)-children', 'has-multiple-children', 'has-kid']), new _dataField.DataField('Vibe-tags', 'The vibe or feeling I get from this person judging from their pictures & chat', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.MULTISELECT
    }, false, false, false, false, {
      baseType: 'stringList',
      customCheckClass: new _dataCheckListStrings.dataCheckListStrings()
    }, ['seems-bitchy', 'is-bitchy', 'seems-awesome-personality', 'has-awesome-personality', 'seems-travelfreak', 'is-travelfreak', 'seems-boring', 'is-boring', 'seems-nerdy', 'is-nerdy', 'seems-sweet', 'is-sweet', 'seems-tokkie', 'is-tokkie', 'seems-airhead', 'is-airhead', 'seems-toughgirl', 'is-toughgirl', 'seems-interested-in-ons-fwb-etc']), new _dataField.DataField('Seems-to-be-active', 'Wether a match showed signs of being active/online (i.e. updating pictures, updating profileText, etc.) despite potentially not responding', true, {
      UIrequired: _dataField.UIRequired.CHAT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), //todo: track wether the like given (or received?) is a normal like, superlike etc. Since the same concept also applies to toher dating apps,.. find a universal format for this.
    new _dataField.DataField('Did-i-like', 'Wether I liked/showed interest in this person', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Is-match', 'Wether we have a match/can talk/person liked me back or not', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Date-match', 'The datetime when I and the person had a match/ability to talk', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'string',
      customCheckClass: new _dataCheckDate.dataCheckDate()
    }), new _dataField.DataField('Match-sent-first-message', 'If this person sent me a first message', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Match-responded', 'If this person responded to my first message', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Conversation-exists', 'If this person responded to each of my first 3 messages to this person', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Vibe-conversation', 'The feeling of how easy & fun it is to have a conversation with this person ranging from 1 (very responsive & fun) to 6 (hardly responsive & teeth pulling)', true, {
      UIrequired: _dataField.UIRequired.CHAT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.SLIDER
    }, false, false, false, false, {
      baseType: 'number',
      customCheckClass: new _dataCheckConversationVibe.dataConversationVibe()
    }), new _dataField.DataFieldGhostsList('How-many-ghosts', 'How many times this person did respond in a certain timeframe', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'specialList',
      customCheckClass: new _dataCheckGhosts.dataCheckGhosts()
    }), new _dataField.DataField('Acquired-number', 'Did I get further contact details (e.g. phone number) from this person?', true, {
      UIrequired: _dataField.UIRequired.CHAT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Date-of-acquired-number', 'The datetime I received contact details from this person', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'string',
      customCheckClass: new _dataCheckDate.dataCheckDate()
    }), new _dataField.DataFieldReactionSpeedList('Response-speed', 'The moments of time between each response', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'specialList',
      customCheckClass: new _dataCheckReactionSpeed.dataCheckReactionSpeed()
    }), new _dataField.DataFieldReminderList('Reminders-amount', 'The amount of reminders I sent and if they worked', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'specialList',
      customCheckClass: new _dataCheckReminders.dataCheckReminders()
    }), new _dataField.DataField('Match-wants-no-contact', 'If this person indicated they did not wish further contact', true, {
      UIrequired: _dataField.UIRequired.CHAT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Blocked-or-removed', 'If this person certainly blocked my profile/removed us as match', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Date-of-unmatch', 'The datetime the match was removed', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'string',
      customCheckClass: new _dataCheckDate.dataCheckDate()
    }), new _dataField.DataField('Seemingly-deleted-profile', 'If this person seemingly (i.e. request to match profile returns a 404) deleted their profile', true, {
      UIrequired: _dataField.UIRequired.NONE,
      UIrequiredType: null
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Interested-in-sex', 'Wether this person has indicated to be interested in a hookup or not', true, {
      UIrequired: _dataField.UIRequired.CHAT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Potential-click', 'Wether the vibe of the conversation was good enough to say "we clicked"', true, {
      UIrequired: _dataField.UIRequired.CHAT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Why-i-removed', 'The reason why I removed or cancelled the (match) connection with this person', true, {
      UIrequired: _dataField.UIRequired.CHAT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.MULTISELECT
    }, false, false, false, false, {
      baseType: 'stringList',
      customCheckClass: new _dataCheckListStrings.dataCheckListStrings()
    }, ['got-number', 'match-never-responded', 'too-far-away', 'nasty-person', 'recognized-or-dated-previously', 'matched-previously-on-datingapp-same-number', 'is-scammer', 'is-catfish', 'accidental-like', 'not-attracted-anymore', 'old-match-before-app-no-longer-attracted', 'old-match-before-app-match-never-responded', 'is-empty', 'has-(multiple)-children', 'does-not-want-(more)-children']), new _dataField.DataField('Did-i-unmatch', 'If i am going to/have unmatched an existing match', true, {
      UIrequired: _dataField.UIRequired.CHAT_ONLY,
      UIrequiredType: _dataField.UIRequiredType.SWITCH
    }, false, false, false, false, {
      baseType: 'boolean',
      customCheckClass: null
    }), new _dataField.DataField('Notes', 'Any interesting notes on this person', true, {
      UIrequired: _dataField.UIRequired.ALL,
      UIrequiredType: _dataField.UIRequiredType.TEXTAREA
    }, false, false, false, false, {
      baseType: 'string',
      customCheckClass: null
    })];
    var mandatoryFieldsTitleList = ['System-no', 'No', 'Messages', 'Last-updated'];
    var isAllMandatoryFieldsPresent = mandatoryFieldsTitleList.every(function (mandatoryFieldTitle) {
      return _this.getIndexOfDataFieldByTitle(mandatoryFieldTitle) !== -1;
    });

    if (!isAllMandatoryFieldsPresent) {
      console.error("Some data fields are missing or their title do not match the mandatory data fields title list. Please check the mandatory data fields list & the data fields which are present in dataRecord class.");
    }
  } // why do this instead of simply creating object instances?

  /*
  1. I can check if all data is present simply by using a method before i even need to create a class (or it creates an empty data class because the params did not pass the check)
  2. This is very usefull for checking the fields before i parse the entire thing in popup! I do not need instances of everything right away! (only one instance needed from dataRecord)
  3. Much like the usedDataFields; I can have a list of those without being tightly coupled with their respective classes; otherwise this class would need to know
  */


  (0, _createClass2.default)(DataRecord, [{
    key: "addDataToDataFields",
    value: function addDataToDataFields(dataRecordValues) {
      var _this2 = this;

      // check if all values in array match dataField names
      if (this.isAllDataFieldsPresent(dataRecordValues)) {
        //if so, add data by label, value pairs, value can be entered by using the add method on the corresponding dataField
        dataRecordValues.forEach(function (dataRecordValue) {
          _this2.usedDataFields[_this2.getIndexOfDataFieldByTitle(dataRecordValue.label)].addDataEntry(dataRecordValue.value);
        });
        return true;
      } else {
        console.error('Missing some required data fields. Cannot add dataRecord');
        return false;
      }
    } // public getRecordPersonSystemId(appType: string, onlyTempId?: boolean): string | null {

  }, {
    key: "getRecordPersonSystemId",
    value: function getRecordPersonSystemId(appType, onlyTempId) {
      var labelPersonSystemid = 'System-no';
      var valueDataField = this.getValueOfDataFieldByTitle(labelPersonSystemid, {
        'appType': appType.toString()
      });

      if (valueDataField !== null && (0, _typeof2.default)(valueDataField) === 'object') {
        for (var _i = 0, _Object$entries = Object.entries(valueDataField); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
              key = _Object$entries$_i[0],
              value = _Object$entries$_i[1];

          if (key === 'id' && value && !onlyTempId) {
            return value;
          }

          if (key === 'tempId' && value) {
            return value;
          }
        }

        return null;
      }

      return null;
    }
  }, {
    key: "getNoDataRecord",
    value: function getNoDataRecord() {
      var currentRecordNumberValue = this.getValueOfDataFieldByTitle('No');

      if (typeof currentRecordNumberValue === 'number') {
        return currentRecordNumberValue;
      } else {
        return null;
      }
    }
  }, {
    key: "setNoDataRecord",
    value: function setNoDataRecord(no) {
      if (no && typeof no === 'number') {
        if (no <= 0) {
          console.error("Provided numbner cannot be 0 or less");
          return;
        }

        this.usedDataFields[this.getIndexOfDataFieldByTitle('No')].addDataEntry(no);
        return;
      } else {
        console.error("No (valid) number provided to set No for this data record: ".concat(this));
        return;
      }
    }
  }, {
    key: "getDataRecordDataFields",
    value: function getDataRecordDataFields() {
      return this.usedDataFields.length > 0 ? this.usedDataFields : null;
    }
  }, {
    key: "setUpdateMessages",
    value: function setUpdateMessages(isToBeUpdated) {
      var dataMessagesField = this.usedDataFields[this.getIndexOfDataFieldByTitle('Messages')];
      dataMessagesField.setNeedsToBeUpdated(isToBeUpdated);
    }
  }, {
    key: "isNeedFieldMessagesBeUpdated",
    value: function isNeedFieldMessagesBeUpdated() {
      var dataMessagesField = this.usedDataFields[this.getIndexOfDataFieldByTitle('Messages')];
      return dataMessagesField.isNeedsToBeUpdated();
    }
  }, {
    key: "getLatestMessage",
    value: function getLatestMessage() {
      var dataFieldMessages = this.usedDataFields[this.getIndexOfDataFieldByTitle('Messages')];
      var lastMessage = dataFieldMessages.getLastMessage();
      return lastMessage && lastMessage ? lastMessage : null;
    }
  }, {
    key: "hasMessages",
    value: function hasMessages() {
      var dataFieldMessages = this.usedDataFields[this.getIndexOfDataFieldByTitle('Messages')];
      return dataFieldMessages.hasMessages();
    }
  }, {
    key: "getIfProfileDetailsNeedsUpdate",
    value: function getIfProfileDetailsNeedsUpdate() {
      // Created due to the need to be able to determine on record (match)-level if the profile details need to be updated or not
      // Which in turn can be:
      // - Not set due to a (single accidental) HTTP failure, in which case it would be preferable to try getting the details again in the future
      // - Need to be reset according to the wishes of the user by setting it in the screenhelper panel (slider to true)
      return this.usedDataFields[this.getIndexOfDataFieldByTitle('Needs-profile-update')].getValue();
    }
  }, {
    key: "getIfMessagesNeedsUpdate",
    value: function getIfMessagesNeedsUpdate() {
      // Created due to the need to be able to determine on record (match)-level if the profile details need to be updated or not
      // Which in turn can be:
      // - Not set due to a (single accidental) HTTP failure, in which case it would be preferable to try getting the details again in the future
      // - Need to be reset according to the wishes of the user by setting it in the screenhelper panel (slider to true)
      return this.usedDataFields[this.getIndexOfDataFieldByTitle('Needs-messages-update')].getValue();
    }
    /**
     * Checks wether all data record values array provided in the param exist in the data record
     * @param {DataRecordValues[]} dataRecordValueList
     * @returns {boolean}
     */

  }, {
    key: "isAllDataFieldsPresent",
    value: function isAllDataFieldsPresent(dataRecordValueList) {
      var _this3 = this;

      return dataRecordValueList.every(function (dataRecordValue) {
        var indexDataFieldTitleInDataRecord = _this3.usedDataFields.findIndex(function (usedDataField) {
          return usedDataField.title === dataRecordValue.label;
        });

        if (indexDataFieldTitleInDataRecord !== -1) {
          return true;
        } else {
          console.error("Cannot find data record value: ".concat(dataRecordValue.label, ". Please ensure the app is up to date and all fields from imported profile exist in dataRecord usedDataFields list"));
          return false;
        }
      });
    }
  }, {
    key: "getIndexOfDataFieldByTitle",
    value: function getIndexOfDataFieldByTitle(title) {
      return this.usedDataFields.findIndex(function (usedDataField) {
        return usedDataField.title === title;
      });
    }
  }, {
    key: "getValueOfDataFieldByTitle",
    value: function getValueOfDataFieldByTitle(title, optionalArgumentsObject) {
      // check if 'system-no' exists
      var indexDataField = this.getIndexOfDataFieldByTitle(title);

      if (indexDataField >= 0) {
        return this.usedDataFields[indexDataField].getValue(optionalArgumentsObject);
      } else {
        console.error("Data field with title: \"".concat(title, "\" not found"));
      }
    }
  }, {
    key: "getRecordValueObject",
    value: function getRecordValueObject(appType) {
      var result = {};
      this.usedDataFields.forEach(function (usedDataField) {
        if (usedDataField instanceof _dataField.DataFieldSystemNo) {
          // result[usedDataField.title] = usedDataField.getValue({appType: 'tinder'});
          result[usedDataField.title] = usedDataField.getValue({
            appType: appType
          });
        } else {
          // since JSON.stringify() removes any object key-value which contains undefined, it's better to set these values as null
          result[usedDataField.title] = usedDataField.getValue() === undefined ? null : usedDataField.getValue();
        }
      });
      return result;
    }
  }, {
    key: "getValueLastUpdated",
    value: function getValueLastUpdated() {
      var indexLastUpdatedDataField = this.getIndexOfDataFieldByTitle('Last-updated');

      if (indexLastUpdatedDataField !== -1) {
        return this.usedDataFields[indexLastUpdatedDataField].getValue();
      } else {
        console.error("Last updated field does not exist.");
        return '';
      }
    }
    /*  ZET HIER WELKE TAGS IK MOMENTEEL WEL GA ONDERSTEUNEN EN WELKE NIET! BEGIN KLEIN!
      'show-average-number-matches-to-go' // maybe handy tool, not for logging data, but for comparing how many potential matches i can get with 1 profile (as done by my own research) and thus how many 'to-go' for my region etc. This 'visual indicator' might just help me get more of a grasp on how large/small my 'potential datingpool' really is.. which is exactly what i need (cause; abundance mindset)
      'how-many-times-i-ghosted' // because i get slacky and dont redspond?
    'gaf-mij-compliment', // because maybe I want to keep track of how many compliments (physical? or about the personality?) this profile gets..
    'vibe-tags', // because I want to keep track of the characteristics // vibe i get from this person; religious, professional, posh, trashy, into-sports, outdoorsy, nerdy, dominant, submissive, sexual, etc.
        ZET HIER WELKE TAGS IK MOMENTEEL WEL GA ONDERSTEUNEN EN WELKE NIET! BEGIN KLEIN! */
    //todo: maybe it would be better to put all the check logic inside the DataField classes and subclasses anyway?

  }, {
    key: "getDataFields",
    value: function getDataFields(allowedFieldsOnly, requiredUIFieldsOnly, requiredUiScreen) {
      return this.usedDataFields.filter(function (dataField) {
        if (allowedFieldsOnly) {
          if (dataField.updateValueAllowed()) {
            return true;
          }

          return false;
        } //todo: logic below is a huge mess, fix!


        if (requiredUIFieldsOnly) {
          if (dataField.UISetting.UIrequired !== _dataField.UIRequired.NONE) {
            if (dataField.UISetting.UIrequired === _dataField.UIRequired.ALL) {
              return true;
            }

            if (requiredUiScreen !== undefined) {
              return dataField.UISetting.UIrequired === requiredUiScreen ? true : false;
            }

            return true;
          }

          return false;
        } // default returns all data fields


        return true;
      });
    }
  }, {
    key: "getAllAutoGatherDataFields",
    value: function getAllAutoGatherDataFields() {
      return this.usedDataFields.filter(function (dataField) {
        return dataField.autoGather;
      });
    }
  }]);
  return DataRecord;
}();

exports.DataRecord = DataRecord;
},{"@babel/runtime/helpers/slicedToArray":"xkYc","@babel/runtime/helpers/typeof":"FlpK","@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","./dataField":"xYao","./dataCheckLogic/dataCheckDate":"DIZ9","./dataCheckLogic/dataCheckAttractiveness":"ev3X","./dataCheckLogic/dataCheckConversationVibe":"kTOs","./dataCheckLogic/dataCheckGhosts":"UkfS","./dataCheckLogic/dataCheckReactionSpeed":"Gy3n","./dataCheckLogic/dataCheckReminders":"fsCs","./dataCheckLogic/dataCheckSystemId":"c9VG","./dataCheckLogic/dataCheckMessage":"p39B","./dataCheckLogic/dataCheckDistances":"Kjgl","./dataCheckLogic/dataCheckListStrings":"mqnv"}],"iqSx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropertiesChecker = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PropertiesChecker = /*#__PURE__*/function () {
  function PropertiesChecker() {
    (0, _classCallCheck2.default)(this, PropertiesChecker);
    this._propertiesList = [];
  }

  (0, _createClass2.default)(PropertiesChecker, [{
    key: "setPropertiesList",
    value: function setPropertiesList(list) {
      if (this._propertiesList.length > 0) {
        console.error('Properties list cannot be set untill current list is cleared');
        return false;
      }

      this._propertiesList = list;
      return true;
    }
  }, {
    key: "clearPropertiesList",
    value: function clearPropertiesList() {
      // this._propertiesList.length = 0;
      this._propertiesList = [];
    }
  }, {
    key: "checkPropertyOnce",
    value: function checkPropertyOnce(property) {
      var indexPropertyInList = this._propertiesList.findIndex(function (propertyListItem) {
        return propertyListItem === property;
      });

      if (indexPropertyInList !== -1) {
        //property exists in list, remove it, return true
        this._propertiesList.splice(indexPropertyInList, 1);

        return true;
      } else {
        //property does not exist in list, parent should throw error and return false
        return false;
      }
    }
  }, {
    key: "getPropertiesList",
    value: function getPropertiesList() {
      return this._propertiesList;
    }
  }]);
  return PropertiesChecker;
}();

exports.PropertiesChecker = PropertiesChecker;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH"}],"gInK":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileHelper = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var moment = _interopRequireWildcard(require("moment"));

require("moment/locale/nl");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

moment.locale('nl');

var FileHelper = /*#__PURE__*/function () {
  function FileHelper(file) {
    (0, _classCallCheck2.default)(this, FileHelper);
    this.fileName = '';
    this.allowedFileTypes = ['.csv', '.json']; // Disabled .csv as supported file format because it turns out nesting (compplex) objects in .csv is hard to read/maintain. .json is much easier to read for some quick excel editing.
    // private allowedFileTypes: string[] = ['.json'];

    this.fileErrorsList = [];
    this.fileType = '';
    var fileName;

    if (file instanceof File) {
      if (file.size === 0) {
        this.addFileErrorToList("File contents cannot be empty. New profiles must at least contain an empty array \"[]\"");
        return;
      }

      fileName = file.name;
    } else {
      fileName = file;
    }

    if (fileName.length === 0) {
      this.addFileErrorToList("Filename cannot be empty. Please update your filename");
      console.error("Filename cannot be empty. Please check the filename of the imported file.");
      return;
    }

    this.clearFileErrorList();
    this.setFileType(fileName);

    if (this.isValidFileType() && this.isValidFileName(fileName)) {
      console.log('uploaded file: ');
      console.dir(file);
      this.fileName = fileName;
    }
  }

  (0, _createClass2.default)(FileHelper, [{
    key: "setFileType",
    value: function setFileType(fileName) {
      var extension = fileName && fileName.split('.').length ? fileName.split('.').pop() : '';

      if (extension && extension.length > 0) {
        this.fileType = extension === null || extension === void 0 ? void 0 : extension.padStart(extension.length + 1, '.');
      } else {
        this.addFileErrorToList("Could not get extension from uploaded file. Please check the file name & file extension.");
        console.error("Could not get extension from uploaded file. Please check the file name & file extension.");
      }
    }
  }, {
    key: "getFileName",
    value: function getFileName() {
      return this.fileName;
    }
  }, {
    key: "isValidFileType",
    value: function isValidFileType() {
      var _this = this;

      if (this.fileType.length === 0) {
        return false;
      }

      var isValidExtension = this.allowedFileTypes.some(function (allowedFileType) {
        return allowedFileType === _this.fileType;
      });

      if (isValidExtension) {
        return true;
      }

      this.addFileErrorToList("Unrecognized or unallowed file type, try again with a different file. Allowed file types: ".concat(this.allowedFileTypes.toString()));
      return false;
    }
  }, {
    key: "isValidFileName",
    value: function isValidFileName(uploadedFileName) {
      if (!uploadedFileName.includes('_')) {
        this.addFileErrorToList("Invalid filename. Please make sure that the uploaded filename is of the following structure: \"Profile_profilename_datetime\" e.g: \"Profile_Jack_15-03-2022--23-59-59.json\"");
        return false;
      }

      var splitFileName = uploadedFileName.split('_');
      var hasProfilePrefix = false;
      var hasName = false;
      var datetime = false;

      if (splitFileName.length === 3) {
        var extensionDotPosition = splitFileName[2].lastIndexOf('.');
        splitFileName[2] = splitFileName[2].slice(0, extensionDotPosition);
        hasProfilePrefix = splitFileName[0] === 'Profile' ? true : false;
        hasName = splitFileName[1].length > 0 ? true : false;
        datetime = this.checkFileDateTimeIsValid(splitFileName[2]);
      }

      if (!hasProfilePrefix) {
        this.addFileErrorToList("Incorrect profile prefix. The profile prefix must be \"Profile\"");
      }

      if (!hasName) {
        this.addFileErrorToList("Incorrect profile name. Please provide a name");
      }

      if (!datetime) {
        this.addFileErrorToList("Incorrect profile datetime. Please provide the datetime in the following format: \"'DD-MM-YYY--HH-mm-ss'\", e.g: \"15-03-2022--23-59-59\" and ensure the datetime is valid");
      }

      return hasProfilePrefix && hasName && datetime;
    }
  }, {
    key: "checkFileDateTimeIsValid",
    value: function checkFileDateTimeIsValid(datetimeFromFileName) {
      var date = datetimeFromFileName.split('--');
      date[1] = date[1].replaceAll('-', ':');
      return moment.default(date.join(' '), 'DD-MM-YYYY HH:mm:ss', true).isValid();
    }
  }, {
    key: "getUpdateFileName",
    value: function getUpdateFileName() {
      var splitFileName = this.fileName.split('_');
      var datetimeWithExtension = splitFileName.pop();
      var currentDateTimeForFileName = moment.default().format('DD-MM-YYYY--HH-mm-ss');
      var extension;

      if (datetimeWithExtension) {
        var extensionDotPosition = datetimeWithExtension.lastIndexOf('.');
        extension = datetimeWithExtension.slice(extensionDotPosition);
        splitFileName.push(currentDateTimeForFileName);
        return splitFileName.join('_') + extension;
      } else {
        console.error("Filename is incorrect. Please update the filename. Returning a generic filename!");
        return "Profile_Testname_".concat(currentDateTimeForFileName, ".json");
      }
    }
  }, {
    key: "hasFileErrors",
    value: function hasFileErrors() {
      return this.fileErrorsList.length > 0 ? true : false;
    }
  }, {
    key: "getFileErrors",
    value: function getFileErrors() {
      return this.fileErrorsList;
    }
  }, {
    key: "addFileErrorToList",
    value: function addFileErrorToList(fileErrorMessage) {
      this.fileErrorsList.push(fileErrorMessage);
    }
  }, {
    key: "clearFileErrorList",
    value: function clearFileErrorList() {
      this.fileErrorsList.length = 0;
    }
  }]);
  return FileHelper;
}();

exports.FileHelper = FileHelper;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","moment":"ZCrj","moment/locale/nl":"Heea"}],"HH1H":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PortAction = void 0;
var PortAction;
exports.PortAction = PortAction;

(function (PortAction) {
  PortAction["INIT"] = "INIT";
  PortAction["SWIPED_PERSON_ACTION_START"] = "SWIPED-PERSON-ACTION-START";
  PortAction["SWIPED_PERSON_ACTION_PROCESS"] = "SWIPED-PERSON-ACTION-PROCESS";
  PortAction["SWIPED_PERSON_ACTION_END"] = "SWIPED-PERSON-ACTION-END";
  PortAction["SUBMIT_ACTION"] = "SUBMIT-ACTION";
  PortAction["GET_NETWORK_LOGS"] = "GET-NETWORK-LOGS";
  PortAction["FILENAME"] = "FILENAME";
  PortAction["KEEP_ALIVE"] = "KEEP-ALIVE";
})(PortAction || (exports.PortAction = PortAction = {}));
},{}],"GW8s":[function(require,module,exports) {
"use strict";

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _jquery = _interopRequireDefault(require("jquery"));

var _csvtojson = _interopRequireDefault(require("csvtojson"));

var _dataRecord = require("../content/classes/data/dataRecord");

var _PropertiesChecker = require("../content/classes/util/PropertiesChecker");

var _fileHelper = require("../fileHelper");

var _PortAction = require("../PortAction.enum");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  var reader = new FileReader();
  var propertiesChecker = new _PropertiesChecker.PropertiesChecker(); // eslint-disable-next-line @typescript-eslint/ban-types

  var dataFields = new _dataRecord.DataRecord().getDataFields();
  var requiredHeadersList = dataFields.map(function (header) {
    return header.title;
  });
  var uploadedFile;
  var inputDataList = null;

  function onFileInputChange(evt) {
    (0, _jquery.default)('#warnText').hide();
    (0, _jquery.default)('#succesText').hide();
    (0, _jquery.default)('#activate').prop('disabled', true);
    inputDataList = null;
    var file = getTargetFile(evt);

    if (!file) {
      console.error("Error while importing uploaded file. Please check your file for any technical errors");
      return;
    }

    uploadedFile = new _fileHelper.FileHelper(file);

    if (!uploadedFile.hasFileErrors()) {
      (0, _jquery.default)('#warnText').removeClass('d-none');
      (0, _jquery.default)('#succesText').show();
      reader.readAsText(file);
    } else {
      (0, _jquery.default)('#warnText').removeClass('d-none');
      (0, _jquery.default)('#warnText').show();
      uploadedFile.getFileErrors().forEach(function (fileErrorMessage) {
        (0, _jquery.default)('#warnText').text(fileErrorMessage + '</br>');
      });
    }
  }

  reader.onload = function () {
    var _reader$result;

    var fileContents = (_reader$result = reader.result) === null || _reader$result === void 0 ? void 0 : _reader$result.toString();

    if (!fileContents) {
      (0, _jquery.default)('#warnText').text('No empty files allowed, try again');
      (0, _jquery.default)('#warnText').removeClass('d-none');
      (0, _jquery.default)('#warnText').show();
      return;
    } //todo: get file type (extension), choose correct method below to handle said file


    if (uploadedFile.fileType === '.json') {
      convertFileContentToArrayJSON(fileContents);
    } else if (uploadedFile.fileType === '.csv') {
      convertFileContentToArrayCSV(fileContents);
    } else {
      console.error("Unsupported file type loaded. Please make sure the uploaded file is supported by the file reader.");
      (0, _jquery.default)('#warnText').text('Unsupported file type loaded. Please make sure the uploaded file is supported by the file reader.');
      (0, _jquery.default)('#warnText').removeClass('d-none');
      (0, _jquery.default)('#warnText').show();
    }
  };

  reader.onerror = function () {
    (0, _jquery.default)('#warnText').text('Reading file error, check console log. Try again or with a different file');
    (0, _jquery.default)('#warnText').removeClass('d-none');
    (0, _jquery.default)('#warnText').show();
    console.error("Render error: ".concat(reader.error));
  };

  function getTargetFile(evt) {
    var fileUpload = null;

    if (evt && evt.currentTarget) {
      // cast currentTarget as a HTMLInputElement instead of EventTarget as files is a property of input element
      fileUpload = evt.currentTarget;

      if (fileUpload.files) {
        if (fileUpload.files.length > 1) {
          (0, _jquery.default)('#warnText').text('No more than 1 file upload allowed, try again' + '</br>');
          (0, _jquery.default)('#warnText').removeClass('d-none');
          (0, _jquery.default)('#warnText').show();
          return;
        }

        console.log('fileUpload file: ');
        console.dir(fileUpload.files[0]);
        return fileUpload.files[0];
      }
    }
  }

  function sendFileDataToContent() {
    if (!inputDataList) {
      console.error('inputData is not set');
      return;
    }

    console.log('Processing click'); // eslint-disable-next-line @typescript-eslint/ban-types

    function getCurrentTabId(cb) {
      var query = {
        active: true,
        currentWindow: true
      };
      chrome.tabs.query(query, function (tabArray) {
        console.log("Tab id is: " + tabArray[0].id);
        cb(tabArray[0].id); //todo: temporarily solution: this should be refactored to something like a promise in the future
        //todo: the reason I set up like this is because chrome.tabs.query returns asynchronously! https://stackoverflow.com/questions/48089389/invocation-of-form-tabs-connectundefined-object-doesnt-match-definition
        //todo: also get tabid before even loading the .json/.csv
        //todo: show error in popup html is tab is not tinder/happn/opther recognized datingapp
        //todo: show error in popup html if port is disconnected (e.g. when navigating away from the tinder tab)
        //todo: what if there are multiple tinder tabs open? 
        //todo: what if i immediatly close the tinder tab once this processing is still ongoing?
      });
    }

    function connectToCurrentTab() {
      getCurrentTabId(function (currentTabId) {
        try {
          var port = chrome.tabs.connect(currentTabId, {
            name: "knockknock"
          });
          port.postMessage({
            messageSender: 'POPUP',
            action: _PortAction.PortAction.FILENAME,
            payload: uploadedFile.getFileName()
          });
          port.postMessage({
            messageSender: 'POPUP',
            action: _PortAction.PortAction.INIT,
            payload: inputDataList
          });
          port.disconnect();
        } catch (err) {
          (0, _jquery.default)('#errorText').text("An error occured when attempting to send imported data to content script:".concat(err));
          (0, _jquery.default)('#errorText').removeClass('d-none');
          (0, _jquery.default)('#errorText').show();
        }
      });
    }

    connectToCurrentTab();
  }

  function convertFileContentToArrayCSV(fileContent) {
    var hasCompatibleHeaders = false;
    var hasCompatibleValues = false;
    (0, _csvtojson.default)({
      output: 'json',
      delimiter: ',',
      checkType: true // required to get actual numbers/booleans instead of string representations of numbers/booleans (e.g. '8'/'false')

    }).on('header', function (headers) {
      console.log('headers are: ');
      console.dir(headers);
      var filteredHeaders = filterNestedHeadersCSV(headers);
      hasCompatibleHeaders = ifCompatibleHeaders(filteredHeaders, requiredHeadersList);
      console.log("has compatible headers: ".concat(hasCompatibleHeaders));
      var excessHeaders = getExcessHeaders(filteredHeaders, requiredHeadersList);

      if (excessHeaders.length > 0) {
        console.warn("File has more headers than expected: ".concat(excessHeaders));
      }
    }).on('data', function (dataRecord) {
      //data is a buffer object
      var parsedRecord = JSON.parse(dataRecord.toString());
      console.log('parsedRecord: ');
      console.dir(parsedRecord);
      hasCompatibleValues = ifCompatibleValues(parsedRecord);
      console.log("has compatible label & values: ".concat(hasCompatibleValues));
    }).on('error', function (err) {
      (0, _jquery.default)('#warnText').text("Error in CSVTOJSON Module. Check console log and try again (with a different file).");
      (0, _jquery.default)('#warnText').removeClass('d-none');
      console.error("CSVTOJSON error: ".concat(err.name, " - ").concat(err.message));
      console.error(err);
    }).fromString(fileContent).then(function (result) {
      if (hasCompatibleHeaders && hasCompatibleValues) {
        console.log("Result succes: ");
        console.dir(result);
        inputDataList = mapResultsArrayToresultDataRecordValues(result);
        (0, _jquery.default)('#succesText').text('Headers, labels and values are valid.').removeClass('d-none');
        (0, _jquery.default)('#activate').attr('disabled', null);
      } else {
        (0, _jquery.default)('#warnText').text("Headers in file do not match required headers. Required headers are: ".concat(requiredHeadersList.toString));
        (0, _jquery.default)('#warnText').removeClass('d-none');
      } //todo: EXTRA prettify code for setting the inputData
      //todo: EXTRA Create loader overlay? (progress bar of sorts)
      //todo: EXTRA prettify html & css
      //todo: EXTRA create general error message method, if has error turn activate button red (alert-red), on every new file upload turn button original color (but disabled) on succes turn button green AND enabled
      //todo: EXTRA add feature to generate new empty .csv file for new profile
      //todo: EXTRA SECURITY; titles dataField should not contain dots!

    });
  }

  function convertFileContentToArrayJSON(fileContent) {
    var hasCompatibleHeaders = false;
    var hasCompatibleValues = false;
    var parsedFileContent = JSON.parse(fileContent);

    if (Array.isArray(parsedFileContent)) {
      var parsedFileContentList = parsedFileContent;
      var filteredHeaders = filterNestedHeadersJSON(parsedFileContentList); // check if all present headers are compatible (exist in data Record)

      hasCompatibleHeaders = ifCompatibleHeaders(filteredHeaders, requiredHeadersList);
      console.log("has compatible headers: ".concat(hasCompatibleHeaders));
      var excessHeaders = getExcessHeaders(filteredHeaders, requiredHeadersList);

      if (excessHeaders.length > 0) {
        console.warn("File has more headers than expected: ".concat(excessHeaders));
      } // check if all present labels & values are compatible (exist in data record)


      hasCompatibleValues = parsedFileContentList.every(function (parsedFileContent, index) {
        var currentRecordHasCompatibleValues = ifCompatibleValues(parsedFileContent);

        if (!currentRecordHasCompatibleValues) {
          (0, _jquery.default)('#warnText').text("Some values for data record with index ".concat(index, " are incompatible. Please check the values of the data record at the specified index."));
          (0, _jquery.default)('#warnText').removeClass('d-none');
          (0, _jquery.default)('#warnText').show();
          console.error("Some values for data record with index ".concat(index, " are incompatible. Please check the values of the data record at the specified index."));
          return;
        }

        return currentRecordHasCompatibleValues;
      }); // if empty array (new file)

      if (parsedFileContent.length === 0) {
        inputDataList = mapResultsArrayToresultDataRecordValues(parsedFileContentList);
        hideAllCurrentNotifications();
        (0, _jquery.default)('#succesText').text('New file').removeClass('d-none');
        (0, _jquery.default)('#activate').attr('disabled', null);
        return;
      } // if not empty array (existing file)


      if (hasCompatibleHeaders && hasCompatibleValues) {
        console.log("Result succes: ");
        console.dir(parsedFileContentList);
        inputDataList = mapResultsArrayToresultDataRecordValues(parsedFileContentList);
        (0, _jquery.default)('#succesText').text('Headers, labels and values are valid.').removeClass('d-none');
        (0, _jquery.default)('#activate').attr('disabled', null);
      } else {
        (0, _jquery.default)('#warnText').text("Does not have compatible headers or values. Please check your uploaded file.");
        (0, _jquery.default)('#warnText').removeClass('d-none');
        (0, _jquery.default)('#warnText').show();
        console.error("Does not have compatible headers or values. Please check your uploaded file.");
        return;
      }
    } else {
      console.error("Uploaded file contents does not contain an array as it's first element. Please check & update your file contents.");
    }
  }

  function hideAllCurrentNotifications() {
    (0, _jquery.default)('.alert').addClass('d-none');
  }

  function filterNestedHeadersJSON(parsedFileContent) {
    var listOfKeys = [];

    var arrayContainsOnlyObjects = function (array) {
      return array.every(function (contentItem) {
        return (0, _typeof2.default)(contentItem) === 'object';
      });
    }(parsedFileContent);

    if (arrayContainsOnlyObjects) {
      var assumedDataRecords = parsedFileContent;
      assumedDataRecords.forEach(function (assumedDataRecord) {
        Object.keys(assumedDataRecord).forEach(function (dataField) {
          if (listOfKeys.findIndex(function (key) {
            return key === dataField;
          }) === -1) {
            listOfKeys.push(dataField);
          }
        });
      });
      return listOfKeys;
    }

    console.error("Uploaded file contents does not contain exclusively objects as first elements inside of the array. Please check & update your file contents.");
    return [];
  }

  function filterNestedHeadersCSV(headers) {
    var nestedHeaders = [];
    var filteredHeaders = headers.filter(function (header) {
      // does this header have a dot in the text?
      var indexDotInHeader = header.indexOf('.');

      if (indexDotInHeader !== -1) {
        var baseHeader = header.substr(0, indexDotInHeader); // is this header already present in the array of nestedHeaders?

        if (nestedHeaders.findIndex(function (header) {
          return header === baseHeader;
        }) === -1) {
          // if not; add and return false (since we do not want to include this header in filtered headers just yet)
          nestedHeaders.push(baseHeader);
          return false;
        } else {
          // if yes, skip this and return false
          return false;
        }
      }

      return true; //it does not? return true.. this is a filtered header
    }, headers);
    filteredHeaders = filteredHeaders.concat(nestedHeaders);
    return filteredHeaders;
  }

  function getExcessHeaders(headers, requiredHeadersList) {
    propertiesChecker.setPropertiesList(headers);
    requiredHeadersList.forEach(function (requiredHeader) {
      propertiesChecker.checkPropertyOnce(requiredHeader);
    });
    var remainingProperties = propertiesChecker.getPropertiesList();
    propertiesChecker.clearPropertiesList();
    return remainingProperties;
  }

  function ifCompatibleHeaders(headers, requiredHeadersList) {
    return requiredHeadersList.every(function (requiredHeader) {
      if (headers.find(function (header) {
        return header === requiredHeader;
      })) {
        return true;
      }

      return false;
    });
  }

  function ifCompatibleValues(record) {
    var hasValidLabels = false;
    var hasValidValues = false;
    console.log("My recordEntries are: ");
    console.dir(record);
    hasValidLabels = _hasValidLabels(record);

    if (!hasValidLabels) {
      return false;
    } //todo: if not provide a message detailing the difference and expectation


    hasValidValues = _hasValidValues(record);
    console.log("thus.. hasValidLabels is: ".concat(hasValidLabels, " and hasValidValues is: ").concat(hasValidValues));
    return hasValidLabels && hasValidValues ? true : false;
  }

  function _hasValidLabels(record) {
    return dataFields.every(function (dataField) {
      if (!Object.keys(record).includes(dataField.title)) {
        console.error("A record is missing one or more labels. Missing label: ".concat(dataField.title, ", record: ").concat(record.toString().substr(0, 25)));
        console.log(record);
        return false;
      }

      return true;
    });
  }

  function _hasValidValues(record) {
    return dataFields.every(function (dataField) {
      var recordWithPropertyDescriptors = Object.getOwnPropertyDescriptors(record); // const uncheckedListKeys = Object.keys(recordWithPropertyDescriptors);

      var result = false;
      result = dataField.isDataEntryValid(recordWithPropertyDescriptors[dataField.title].value); // if (result) {
      //     uncheckedListKeys.filter((value) => value !== dataField.title);
      // }

      return result;
    });
  } // todo: should probably want to refactor this since popup shouldn't be concerned with interal app data such as DataRecordValues


  function mapResultsArrayToresultDataRecordValues(resultsArray) {
    return resultsArray.map(function (result) {
      var newArray = [];

      for (var property in result) {
        newArray.push({
          'label': String(property),
          'value': result[property]
        });
      }

      return newArray;
    });
  }

  (0, _jquery.default)('#activate').on('click', function () {
    sendFileDataToContent();
  });
  (0, _jquery.default)('#inputGroupFile02').on('change', function (evt) {
    onFileInputChange(evt);
  });
});
},{"@babel/runtime/helpers/typeof":"FlpK","jquery":"eeO1","csvtojson":"yQ1z","../content/classes/data/dataRecord":"Vg3b","../content/classes/util/PropertiesChecker":"iqSx","../fileHelper":"gInK","../PortAction.enum":"HH1H"}]},{},["GW8s"], null)
//# sourceMappingURL=popup.a0ec2f71.js.map