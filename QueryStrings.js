// QueryStrings.js

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
 * Querystring javascript framework functions with support for:
 *  qs()
 */

/**
 * Class for parsing querystrings
 *
 * @param {string} qs
 */
var QueryString = function(qs) {
	this.keyValuePairs = new Array();

	if (qs.length == 0) {
		qs = null;
	} else {
		qs = qs.substring(1, qs.length);
	}

	if (qs) {
		for (var i = 0; i < qs.split('&').length; i++) {
			this.keyValuePairs[i] = qs.split('&')[i];
		}
	}

	R.util.extend(this, {
		/**
 		* Get a pair of Key/Value
 		*/
		getPairOfKeyAndValue: function() {
			return this.keyValuePairs;
		},
		/**
 		* Get length of pair
 		*/
		getLength: function() {
			return this.keyValuePairs.length;
		},
		/**
 		* Get a list of parameters names
 		*/
		getParameters: function() {
			var a = new Array(this.getLength());
			for (var j = 0; j < this.keyValuePairs.length; j++) {
				a[j] = this.keyValuePairs[j].split('=')[0];
			}
			return a;
		},
		/**
 		* Get a value of parameter
 		*
 		* @param {string} name
 		*/
		getValue: function(name) {
			for (var j = 0; j < this.keyValuePairs.length; j++) {
				if (this.keyValuePairs[j].split('=')[0] == name)
					return this.keyValuePairs[j].split('=')[1];
			}
			return false;
		}
	});

};
