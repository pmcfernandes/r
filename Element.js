// Element.js

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
 * Object helper for javascript framework
 *  init()
 *  html()
 *  append()
 *  addClass()
 *  removeClass()
 *  addStyle()
 *  on()
 *  off()
 */

R.ns('R.dom');

R.dom = function(selector) {
	var elem = (typeof selector != 'string' ? selector : R.query(selector));	
	return R.dom.init(elem);
};

R.util.extend(R.dom, {
	innerList: new Array(),
	/**
 	* Constructor
 	*
 	* @param {object} el element
 	*/
	init: function(el) {
		if (R.empty(el)) {
			throw "Element object was not founded.";
		}
		this.innerList = [];
		for (var i = 0; i < el.length; i++) {
			this.innerList.push(el[i]);
		};

		return this;
	},
	/**
 	* Get or set html text
 	*
 	* @param {string} data
 	*
 	* <code>
 	*   R.get("#div1").html("Hello");
 	* </code>
 	*/
	html: function(data) {
		var el = this.innerList;

		// If is Set
		if (R.empty(data)) {
			return el[0].innerHTML;
		} else {
			for (var i = 0; i < el.length; i++) {
				el[i].innerHTML = data;
			};
		}
	},
	/**
 	* Append to an existent text in element
 	*
 	* @param {string} name
 	*/
	append: function(data) {
		var el = this.innerList;

		for (var i = 0; i < el.length; i++) {
			if (R.empty(el[i])) {
				continue;
			}
			
			if (typeof data == 'object') {
				el[i].appendChild(data);
			}
			if (typeof data == 'string') {
				el[i].innerHTML += data;
			}
		};
	},
	/**
 	* Add class to element
 	*
 	* @param {string} name
 	*/
	addClass: function(name) {
		var el = this.innerList;

		for (var i = 0; i < el.length; i++) {
			R.css.add(el[i], name);
		};
	},
	/**
 	* Remove class to element
 	*
 	* @param {string} name
 	*/
	removeClass: function(name) {
		var el = this.innerList;

		for (var i = 0; i < el.length; i++) {
			R.css.remove(el[i], name);
		};
	},
	/**
 	* Add style to element
 	*
 	* @param {json} jsonCss
 	*/
	addStyle: function(jsonCss) {
		var el = this.innerList;

		for (var i = 0; i < el.length; i++) {
			var str = '';
			for (var name in jsonCss) {
				str += new String().format('{0}: {1};', name, jsonCss[name]);
			}		
			R.css.addStyle(el[i], str);
		};
	},
	/**
 	* Associate a event to element
 	*
 	* @param {string} 	  event
 	* @param {function}  fn
 	*/
	on: function(evt, fn) {
		var el = this.innerList;

		for (var i = 0; i < el.length; i++) {
			R.bind(el[i], evt, fn);
		};
	},
	/**
 	* Desassociate a event to element
 	*
 	* @param {string} 	  event
 	* @param {function}  fn
 	*/
	off: function(evt, fn) {
		var el = this.innerList;

		for (var i = 0; i < el.length; i++) {
			R.unbind(el[i], evt, fn);
		};
	}
});
