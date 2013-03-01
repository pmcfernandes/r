// Dates.js

// Copyright (C) 2011 Pedro Fernandes

// This program is free software; you can redistribute it and/or modify it under the terms of the GNU 
// General Public License as published by the Free Software Foundation; either version 2 of the 
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without 
// even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See 
// the GNU General Public License for more details. You should have received a copy of the GNU 
// General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 
// Temple Place, Suite 330, Boston, MA 02111-1307 USA

R.util.extend(Date.prototype, {

	/**
	 * Convert date to String
	 */
	toString: function() {
		return this.formatDate('dd mmm yyyy hh:nn:ss');
	},
	/**
	 * Format Date 
	 * 
	 * @param {string} formatString
	 * 
	 * <code>
	 * 	var d = new Date();
	 * 	d = d.formatDate('dd mm yyyy hh:nn:ss');
	 * </code>
	 */
	formatDate: function (formatString) {

		var yyyy = this.getFullYear();
		var yy = yyyy.toString().substring(2);
		var m = this.getMonth();
		var mm = m < 10 ? "0" + m : m;
		var mmm = m.extendMonth(true);
		var d = this.getDate();
		var dd = d < 10 ? "0" + d : d;

		var h = this.getHours();
		var hh = h < 10 ? "0" + h : h;
		var n = this.getMinutes();
		var nn = n < 10 ? "0" + n : n;
		var s = this.getSeconds();
		var ss = s < 10 ? "0" + s : s;
		
		var value = formatString
			.replace(/yyyy/i, yyyy)
			.replace(/yy/i, yy)
			.replace(/mmm/i, mmm)
			.replace(/mm/i, mm)
			.replace(/m/i, m)
			.replace(/dd/i, dd)
			.replace(/d/i, d)
			.replace(/hh/i, hh)
			.replace(/h/i, h)
			.replace(/nn/i, nn)
			.replace(/n/i, n)
			.replace(/ss/i, ss)
			.replace(/s/i, s);
		
		return value;
	}
});