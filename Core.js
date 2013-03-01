// Core.js

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
 * Main javascript framework functions with support for:
 *  isIE()
 *  domready()
 *  loadScript()
 *  bind()
 *  unbind()
 *  get()
 *  applyFn()
 *  each()
 *  tmpl()
 *  jq()
 *  fireEvent()
 *  empty()
 *  createEl()
 *  cdn()
 */
 
R.util.extend(R, {
	/**
 	* Register namespace names
 	*
 	* @param {string} name
 	* <code>
 	*    R.ns("System.Data");
 	* </code>
 	*/
	ns: function (name) {
		new Namespace().register(name);
	},
	/**
 	* Get a value of parameter in query strings
 	*
 	* @param {string} queryString
 	* @param {string} parameterName
 	*
 	* <code>
 	*    var value = R.qs ('id=1', 'id');
 	* </code>
 	*/
	qs: function (queryString, parameterName) {
		return (new QueryString(queryString)).getValue(parameterName);
	}
});

/**
 * Extend R object with core functionality
 *
 */
R.util.extend(R, {	
	/**
 	* Check if is Internet Explorer / Opera
 	*
 	* <code>
 	*  if (R.isIE() == true) {
 	*  }
 	* </code>
 	*/
	isIE: function() {
		return window.browserName() == 'msie' || 
			   window.browserName() == 'opera';
	},	
	/**
 	* Function to check DOM is ready to use
 	*
 	* @param {function} fn
 	*/
	domready: function(fn) {
		if(R.isIE()) {
			R.bind(D, 'readystatechange', function() {
				if(D.readyState == 'complete') {
					fn();
				}
			});
		} else {
			R.bind(D, 'DOMContentLoaded', fn);
		}
	},
	/**
 	* Load script or css file remotely or local
 	*
 	* @param {string} script
 	* @param {function} loadedFn
 	*
 	* <code>
 	* 	R.loadScript("http://www.google.com/g.js", function() {
 	* 		alert ('Loaded');
 	*   });
 	* </code>
 	*/
	loadScript: function(script, loadedFn) {
		var fileref;

		// Try get extension of script
		var ext = script.substr(script.length - 4, script.length);
		if (ext == '.css') {
			fileref = R.createEl('link', {
				href: script,
				type: 'text/css',
				rel: 'stylesheet'
			});
		} else {
			fileref = R.createEl('script', {
				src: script,
				defer: true,
				language: 'javascript',
				type: 'text/javascript'
			});
		}

		if (typeof fileref != undefined) {
			/* Call a event when script is loaded or completed */
			if (!R.empty(loadedFn)) {
				R.bind(fileref, 'load', loadedFn);
				R.bind(fileref, 'readystatechange', function() {
					if (fileref.readyState == 'loaded' || fileref.readyState == 'complete')
						loadedFn();
				});				
			}
			
			_$$('head', D)[0].appendChild(fileref);			
		}
	},
	/**
 	* Add Event handler associated with a function
 	*
 	* @param {object} object
 	* @param {string} event
 	* @param {object} function
 	*
 	* <code>
 	* 	R.bind(document.body, 'load', function() {});
 	* </code>
 	*/
	bind: function(obj, evt, fn) {
		if (obj.addEventListener)
			obj.addEventListener(evt, fn, false);
		else if (obj.attachEvent)
			obj.attachEvent('on' + evt, fn);
	},
	/**
 	* Remove Event handler associated with a function
 	*
 	* @param {object} object
 	* @param {string} event
 	* @param {object} function
 	*
 	* <code>
 	* 	R.unbind(document.body, 'load', function() {});
 	* </code>
 	*/
	unbind: function(obj, evt, fn) {
		if (obj.removeEventListener)
			obj.removeEventListener(evt, fn, false);
		else if (obj.detachEvent)
			obj.detachEvent('on' + evt, fn);
	},
	/**
 	* Executes event handler on the element. Works with event handlers attached by Prototype,
 	* in a browser-agnostic fashion.
 	*
 	* @param {object} 	element
 	* @param {event} 	event
 	*/
	fireEvent: function(obj, e) {
		// dispatch for IE
		if (R.isIE()) {
			var evt = D.createEventObject();
			return obj.fireEvent('on' + e, evt)
			// dispatch for firefox + others
		} else {
			var evt = D.createEvent("HTMLEvents");
			evt.initEvent(e, true, true );

			// event type, bubbling, cancelable
			return !obj.dispatchEvent(evt);
		}
	},
	/**
 	* Get Element by name
 	*
 	* @params {string} node name
 	*
 	* <code>
 	* 	  var el = R.get('div1');
 	* </code>
 	*/
	get: function(node) {
		return _$(node);
	},
	/**
 	* Foreach element
 	*
 	* @param {array} 	a 	array of elements
 	* @param {function} fn
 	*
 	* <code>
 	*   R.each(R.get('div'), function(i, obj) {
 	* 		alert (i);
 	* 		alert(obj);
 	* 	});
 	* </code>
 	*/
	each: function(a, fn) {
		for (var i = 0; i < a.length; i++) {
			fn.call (a[i], i, a[i]);
		};
	},
	/**
 	* Template processor
 	*
 	* @param {string} template
 	* @param {json}   data
 	*
 	* <code>
 	* 	var x = R.tmpl('Hello ${name}! (not ${name}?)', { name: 'Gandalf' })
 	* </code>
 	*/
	tmpl: function (template, data) {
		var result = template;

		for (var field in data) {
			var re = new RegExp( '\\$\\{' + field + '\\}', 'gi' );
			result = result.replace(re, data[field]);
		}

		return result;
	},
	/**
 	* Get a instance of jQuery object
 	*
 	* @param {string} selector
 	*
 	* <code>
 	*   R.jq('#div').html();
 	* </code>
 	*/
	jq: function(selector) {
		if(typeof $ == 'function') {
			return $(selector);
		} else {
			throw "Not founded jQuery or equivalent framework function ($).";
		}
	},
	/**
 	* Check if value is undefined or null
 	*
 	* @param {object} value
 	*
 	* <code>
 	* 	if (R.empty (x) == true) {
 	* 		alert ('Error');
 	*  }
 	* </code>
 	*/
	empty: function(value) {
		if (typeof value == 'undefined') {
			return true;
		}
		if (typeof value == 'string') {
			return (String(value).trim() == '');
		}
		if (typeof value == 'number') {
			return (value == 0);
		}
		if (typeof value == 'array') {
			return (value.length == 0);
		}

		return (value == undefined || value == null);
	},
	/**
 	* Create element with attributes
 	*
 	* @param {element} el
 	* @param {json}    attr
 	*/
	createEl: function(name, attr) {
		var el = D.createElement(name);
		for (param in attr) {
			el.setAttribute(param, attr[param]);
		}
		return el;
	},
	/**
 	* Load other frameworks script from Google CDN
 	*
 	* @param {string} name
 	* @param {optional string} key
 	*
 	* <code>
 	*   var key_cdn = '';
 	* 	R.cdn({ name: 'jquery', version: '1.4.2' }, key_cdn);
 	* 	R.cdn({ name: 'dojo'  , version: '1.6.0' }, key_cdn);
 	* </code>
 	*/
	cdn: function(script, key) {
		if (R.empty(key)) {
			key = 'put here your api code';
		}

		R.loadScript ('https://www.google.com/jsapi?key=' + key, function() {
			if (!R.empty(google)) {
				google.load (script.name, script.version);
			}
		});
	}
});

