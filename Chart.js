// Chart.js

// Copyright (C) 2011 Pedro Fernandes

// This program is free software; you can redistribute it and/or modify it under the terms of the GNU 
// General Public License as published by the Free Software Foundation; either version 2 of the 
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without 
// even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See 
// the GNU General Public License for more details. You should have received a copy of the GNU 
// General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 
// Temple Place, Suite 330, Boston, MA 02111-1307 USA

R.ns('R.chart');

R.util.extend(R.chart, {	
	/**
 	* Render chart
 	*/
	render: function(container, options) {		
		R.flash.load(container, 'open-flash-chart.swf', {
			width: options.width,
			height: options.height,
			flashvars: 'loading=Loading...&data-file=' + options.dataurl + '&'
		})
	}
});
