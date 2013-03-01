// Css.js

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
 * CSS javascript framework functions with support for:
 *  item()
 *  contains()
 *  add()
 *  remove()
 *  toggle()
 *  addStyle()
 */

/**
 * R.css namespace
 */
R.ns('R.css');

/**
 * Expand R.css object
 */
R.util.extend(R.css, {
	/**
 	* Get class instance IE / other
 	*
 	* @param {object} el
 	*/
	_getClass: function(el) {
		if (!R.isIE()) {
			return el.className;
		} else {
			return el.attributes['class'].value.toString();
		}
	},
	/**
 	* Set class instance IE / other
 	*
 	* @param {object} el
 	* @param {string} name
 	*/
	_setClass: function(el, name) {
		if (!R.isIE()) {
			el.className = name;
		} else {
			el.setAttribute('class', name);
		}
	},
	/**
 	* Get item at position
 	*
 	* @param {object}	el	element
 	* @param {integer} idx	index
 	*/
	item: function(el, ix) {
		return this._getClass(el).trim().split(/\s+/)[ix];
	},
	/**
 	* Verify if element contains css
 	*
 	* @param {object} el	element
 	* @param {string} name
 	*/
	contains: function(el, name) {
		var classes = this._getClass(el).trim().split(/\s+/);
		return classes.indexOf(name) !== -1;
	},
	/**
 	* Add css to element
 	*
 	* @param {object} el	element
 	* @param {string} name
 	*/
	add: function(el, name) {
		var classes = this._getClass(el).trim().split(/\s+/);
		if (classes.indexOf(name) === -1) {
			classes.push(name);
			this._setClass(el, classes.join(' '));
		}
	},
	/**
 	* Remove css in element
 	*
 	* @param {object} el	element
 	* @param {string} name
 	*/
	remove: function(el, name) {
		var classes = this._getClass(el).trim().split(/\s+/);
		var ix = classes.indexOf(name);
		if (ix !== -1) {
			classes.splice(ix, 1);
			this._setClass(el, classes.join(' '));
		}
	},
	/**
 	* Toogle css in element
 	*
 	* @param {object} el	element
 	* @param {string} name
 	*/
	toggle: function(el, name) {
		var classes = this._getClass(el).trim().split(/\s+/);
		var ix = classes.indexOf(name);

		if (ix === -1) {
			classes.push(name);
		} else {
			classes.splice(ix, 1);
		}
		this._setClass(el, classes.join(' '));
	},
	/**
 	* Add style to element
 	*
 	* @param {object} el		element
 	* @param {string} cssText
 	*/
	addStyle: function(el, cssText) {
		var styles = cssText.split(';');
		for (var i = 0; i < styles.length; i++) {
			var style = styles[i];
			if (style != '' && (j = style.indexOf(':')) > 0)
				el.style[style.substr(0, j).mapStyle()] = style.substr(j + 1).trim();
		}
	}
});

