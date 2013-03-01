// Numerics.js

// Copyright (C) 2011 Pedro Fernandes

// This program is free software; you can redistribute it and/or modify it under the terms of the GNU 
// General Public License as published by the Free Software Foundation; either version 2 of the 
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without 
// even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See 
// the GNU General Public License for more details. You should have received a copy of the GNU 
// General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 
// Temple Place, Suite 330, Boston, MA 02111-1307 USA

R.util.extend(Number.prototype, {

	/**
 	* Get random number
 	*
 	* @param {integer} high
 	*
 	* <code>
 	* 	var value = Number().random(8);
 	* </code>
 	*/
	random: function(high) {
		return Math.round(Math.random() * high);
	},
	/**
 	* Extend month to portuguese dialect
 	*
 	* <code>
 	* 	alert (Number(8).extendMonth());
 	* </code>
 	*/
	extendMonth: function(isMinimized) {
		var i = Number(this);		
		
		var months = new Array(
			'Janeiro', 
			'Fevereiro', 
			'Março', 
			'Abril', 
			'Maio', 
			'Junho', 
			'Julho', 
			'Agosto', 
			'Setembro', 
			'Outubro',
			'Novembro',
			'Dezembro');

		if (isMinimized !== true) {
			return months[i];
		} else {
			return months[i].substring(0, 3);
		}

	}
});

