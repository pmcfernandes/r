// Strings.js

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
 * Strings helper for javascript framework with support for:
 *  unique()
 *  trim()
 *  format()
 *  startsWith()
 *  endsWith()
 *  mapStyle()
 *  truncate()
 */

R.util.extend(String.prototype, {

	/**
 	* String generator
 	*
 	* @param {integer} charNumber
 	*
 	* <code>
 	*   var x = String().unique(8);
 	* </code>
 	*/
	unique: function(charNumber) {
		var lst = '1|2|3|4|5|6|7|8|9|0|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|#|$|%|&|(|)|?';

		var str = '';
		var strSplited = lst.split('|');

		for (var i = 0; i < charNumber; i++) {
			var number = Math.round(Math.random() * strSplited.length);
			str += strSplited[number];
		};

		return str;
	},
	/**
 	* Check if string start with another string
 	*
 	* <code>
 	* 	var x = "Hello World";
 	*  if (String(x).startsWith('Hello') == true) {
 	*
 	*  }
 	* </code>
 	*/
	startsWith: function(str) {
		return this.substr(0, str.length) == str;
	},
	/**
 	* Check if string ends with another string
 	*
 	* <code>
 	* 	var x = "Hello World";
 	*  if (String(x).endsWith('World') == true) {
 	*
 	*  }
 	* </code>
 	*/
	endsWith: function(str) {
		return this.substr(this.length - str.length, this.length) == str;
	},
	/**
 	* Create format like .net function
 	*
 	* <code>
 	* 	var x = String('Hello {0}').format('World');
 	* </code>
 	*/
	format: function() {
		var args = arguments;
		var pattern = new RegExp("{([0-" + arguments.length + "])}", "g");
		return this.replace(pattern, function(match, index) {
			return args[index];
		});
	},
	/**
 	* Trim string
 	*
 	* <code>
 	* 	var x = String(str).trim();
 	* </code>
 	*/
	trim: function() {
		return this.replace(/^\s+|\s+$/g, '');
	},
	/**
 	* Map styles
 	*/
	mapStyle: function() {
		return this.replace(/\-(\w)/g, function(m, c) {
			return c.toUpperCase();
		});
	},
	/**
 	* Get truncated value of string
 	*
 	* @param {integer} length
 	*
 	* <code>
 	*   var x = "Hello World".truncate(4);
 	* </code>
 	*/
	truncate: function(length) {
		return this.substring(0, length);
	},
	/**
	 * Remove all < > tags (and everything in between), 
	 * ensuring that the string contains no HTML
	 */
	removeTags: function () {
		return this.replace(/<([^>]+)>/g,'');
	}

});

