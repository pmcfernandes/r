// Cookie.js

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
 * Cookie javascript framework functions with support for:
 *  add()
 *  read()
 *  remove()
 */

/**
 * R.cookie namespace
 */
R.ns("R.cookie");

/**
 * Expand R.cookie object
 */
R.util.extend(R.cookie, {
	/**
 	*  Remove cookie
 	*
 	* @param {string} name
 	*/
	remove: function(name) {
		add(name, "", -1);
	},
	/**
 	* Add cookie
 	*
 	* @param {string} name
 	* @param {string} value
 	* @param {integer} days
 	*/
	add: function(name, value, days) {
		if (!days) {
			var expires = "";
		} else {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		}
		D.cookie = name + "=" + value + expires + "; path=/";
	},
	/**
 	* Read cookie
 	*
 	* @param {string} name
 	*/
	read: function(name) {
		var nameEQ = name + "=";
		var ca = D.cookie.split(';');

		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];

			while (c.charAt(0) == ' ') {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) == 0) {
				return c.substring(nameEQ.length,c.length);
			}
		}
		return null;
	}
});

