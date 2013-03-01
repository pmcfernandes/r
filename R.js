// R.js

// Copyright (C) 2011 Pedro Fernandes

// This program is free software; you can redistribute it and/or modify it under the terms of the GNU 
// General Public License as published by the Free Software Foundation; either version 2 of the 
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without 
// even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See 
// the GNU General Public License for more details. You should have received a copy of the GNU 
// General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 
// Temple Place, Suite 330, Boston, MA 02111-1307 USA
 
 /**
 * R framework Library
 *
 * @author Pedro Fernandes
 * @since 1.0
 * @version 1.1
 * @copyright
 * @date 22-02-2011
 */

(function(R) {
	
});

// Create Minification of DOM
var D = window.document;

/**
 * Shortcut function for Element id
 *
 * @param {string} id
 */
var _$ = function(id) {
	return D.getElementById(id);
}
/**
 * Shortcut function for Element tag
 *
 * @param {string} e element
 * @param {object} p object
 */
var _$$ = function(e, p) {
	return p.getElementsByTagName(e);
}

/**
 * Extend object
 *
 * @param {object} target
 * @param {array}  options
 */
var $extend = function() {
	var shift = Array.prototype.shift;
	var target = shift.call(arguments);

	if (!target) {
		return {};
	}

	while (obj = shift.call(arguments)) {
		for (var name in obj) {
			target[name] = obj[name];
		}
	}

	return target;
}

/**
 * Create a class with inheritance support
 *
 * @param {object} target
 * @param {array}  options
 */
var $define = function() {
	var parent = undefined, 
		methods = [],
		shift = Array.prototype.shift;

	if (arguments.length == 1) {
		methods.push(shift.call(arguments));
	} else {
		parent = shift.call(arguments);

		if (!parent) {
			return {};
		}

		while(obj = shift.call(arguments)) {
			methods.push(obj);
		}
	}

	/**
	 * Get inherited class
	 */
	var K = function() {
		this.$super = function(method, args) {
			return R.util.base(this.parent, this, method, args);
		};
		this.initialize.apply(this, arguments);
	};
	
	// Get prototype
	var kp = K.prototype;
	kp.constructor = K;
	kp.initialize = (!kp.initialize ? function() { } : kp.initialize);
			
	if (typeof parent !== 'undefined') {
		var pp = parent.prototype;		
		R.util.extend(kp, pp); kp.parent = pp;
	}

	// Extend prototype with methods
	for (var i = 0; i < methods.length; i++) {
		R.util.extend(kp, methods[i]);
	};

	return K;
}

/**
 * Shorthand object
 */
var R = {
	/**
	 * Get Version of framework
	 */
	version: '1.1.0',
	/**
	 * Empty function
	 */
	emptyFn: function() {
	},
	/**
	 * Util namespace
	 */
	util: {
		/**
		 * Extend object defined
		 */
		extend: $extend, 
		define: $define
	}
};

R.util.extend(Object.prototype, {
	/**
	 * Create a object with json
	 *
	 * @param {json} obj
	 *
	 * <code>
	 *  var x = Object.create({
	 * 		a: 1,
	 * 		b: true,
	 * 		c: 'Hello'
	 *  })
	 *  alert (x.c);
	 * </code>
	 */
	create: function(obj) {
		// Create a empty function
		var F = function() {
		};
		// Fill prototype with json array
		F.prototype = obj;
		return new F();
	}
});

R.util.extend(R.util, {
	/**
	 * Apply parameters to function
	 *
	 * @param {object} fn
	 * @param {object} bind this
	 * @param {arguments} args
	 */
	applyFn: function(fn, bind, args) {
		return function() {
			fn.apply(bind, args || []);
		};
	},
	/**
	 * Get super class functionality
	 * 
	 * @param {class} parentClass
	 * @param {object} instance
	 * @param {string} method
	 * @param {args} args arguments
	 */
	base: function(parentClass, instance, method, args) {
		return parentClass[method].apply(instance, args || []);
	},
	/**
	 * Copies all the properties of config
	 * to the specified object.
	 */
	apply: function(destination, source, defaults) {
		if (defaults) {
			R.util.apply(destination, defaults);
		}
		if (destination && source && typeof source === 'object') {
			for (var i in source) {
				if (source.hasOwnProperty(i)) {
					destination[i] = source[i];
				}
			}
		}
		return destination;
	},
	/**
	 * Simulate a import tool
	 *
	 * @param {string} path
	 */
	require: function(path) {
		var base, src = 'R.js';
		var scripts = _$$('script', D);

		for (var i = 0; i < scripts.length; i++) {
			if (scripts[i].src.match(src)) {
				base = scripts[i].src.replace(src, '');
				break;
			}
		}

		var url = base + path + '.js';
		D.write('<script type="text/javascript" src="' + url + '"></script>');
	}
});

/* Import dom extender */
R.util.require('Object');
R.util.require('Window');
R.util.require('Array');
R.util.require('Numerics');
R.util.require('Strings');
R.util.require('Dates');

/* Import required helpers */
R.util.require('Selector');
R.util.require('Namespace');
R.util.require('QueryStrings');

/* Import all namespaces */
R.util.require('Core');
R.util.require('Debug');
R.util.require('Linq');
R.util.require('Element');
R.util.require('Css');
R.util.require('Fx');
R.util.require('Flash');
R.util.require('YQL');
R.util.require('Cookie');
R.util.require('Draggable');
R.util.require('Validation');
R.util.require('Chart');