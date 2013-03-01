// Array.js

// Copyright (C) 2011 Pedro Fernandes

// This program is free software; you can redistribute it and/or modify it under the terms of the GNU 
// General Public License as published by the Free Software Foundation; either version 2 of the 
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without 
// even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See 
// the GNU General Public License for more details. You should have received a copy of the GNU 
// General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 
// Temple Place, Suite 330, Boston, MA 02111-1307 USA

R.util.extend(Array.prototype, {
	/**
	 * Filter array by condition
	 * 
	 * <code>
	 * 	 var a = { 1, 2, 3, 12, 44, 42, 32};
	 * 	 var x = a.filter(function(element, index, array) {
	 * 		return (element >= 10);
	 * 	 })	
	 * </code>
	 */
	filter: function(fn) {		
		if (typeof fn != "function") {
			throw new TypeError();
		}
		
		var res = new Array();
		var len = this.length;
		var thisp = arguments[1];
		
		for (var i = 0; i < len; i++) {
			if (i in this) {
				// in case fun mutates this
				var val = this[i];
				if (fn.call(thisp, val, i, this)){
					res.push(val);
				}					
			}
		}

		return res;
	}
});
