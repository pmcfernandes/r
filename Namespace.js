// Namespace.js

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
 * Namepace javascript framework functions with support for:
 *  ns()
 */

/**
 * Namespace object
 */
var Namespace = function() {
	/** Namepace API 1.1 */

	R.util.extend(Namespace.prototype, {

		/**
 		* Create a namespace name
 		*
 		* @param {string} name
 		*/
		create: function(name) {
			eval("window." + name + " = new Object();");
		},
		/**
 		* Check if namespace already exists
 		*
 		* @param {string} name
 		*/
		exists: function(name) {
			return eval("var NE = false; try { " +
			"  if(" + name + ") { " +
			"     NE = true; " +
			"  } else { " +
			"     NE = false; " +
			"  }" +
			"} catch (err) { NE = false; }");
		},
		/**
 		* Register namespace names
 		*
 		* @param {string} name
 		*/
		register: function(name) {
			var chk = false;
			var cob = "";
			var spc = name.split(".");

			for(var i = 0; i < spc.length; i++) {
				if(cob != "") {
					cob += ".";
				}
				cob += spc[i];
				chk = this.exists(cob);
				if(!chk) {
					this.create(cob);
				}
			}

			if(chk) {
				throw "Namespace: " + name + " is already defined.";
			}
		}
	});

};

