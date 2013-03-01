// Draggable.js

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
 * Drag and drop helper for javascript framework
 *  initDragDrop()
 *  dragDown()
 * 	dragMove()
 */
 
var dragObj = new Object();
dragObj.zIndex = 0;

R.util.extend(window, {
	
	/**
	 * Helper function for Start Drag event
	 * 
	 * @param {event} e
	 * @param {object} id
	 */
	dragStart: function(e, id) {
		e = e || window.event;
		target = D.all ? e.srcElement : e.target;
		
		if (id) {
			dragObj.elNode = _$(id);
		} else {
			dragObj.elNode = target;
		}
		if (dragObj.elNode.nodeType == 3) {
			dragObj.elNode = dragObj.elNode.parentNode;
		}
	      
		if (R.isIE()) {
			x = e.clientX + D.documentElement.scrollLeft + document.body.scrollLeft;
	  		y = e.clientY + D.documentElement.scrollTop  + document.body.scrollTop;
		} else {
			 x = e.clientX + window.scrollX;
			 y = e.clientY + window.scrollY;
		}
		
		// Save starting positions of cursor and element.
		dragObj.cursorStartX = x;
		dragObj.cursorStartY = y;
		dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
		dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);
	
		if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0; 
		if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
	  	
		// Update element's z-index.
		dragObj.elNode.style.zIndex = ++dragObj.zIndex;
	
		// Capture mousemove and mouseup events on the page.
		R.bind(D, 'mousemove', dragMove);
		R.bind(D, 'mouseup',   dragStop);
		
		if (R.isIE()) {
			e.cancelBubble = true;
		    e.returnValue = false;		
		} else {
			e.preventDefault();
		}
	},
	/**
	 * Helper function for Move Drag event
	 * 
	 * @param {event} e
	 */
	dragMove: function(e) {
		e = e || window.event;
		var x, y;
	
		// Get cursor position with respect to the page.
		if (R.isIE()) {
			x = e.clientX + D.documentElement.scrollLeft + document.body.scrollLeft;
			y = e.clientY + D.documentElement.scrollTop  + document.body.scrollTop;			
		} else {
			 x = e.clientX + window.scrollX;
			 y = e.clientY + window.scrollY;
		}
		// Move drag element by the same amount the cursor has moved.
		dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
		dragObj.elNode.style.top  = (dragObj.elStartTop  + y - dragObj.cursorStartY) + "px";
		
		if (R.isIE()) {
			e.cancelBubble = true;
		    e.returnValue = false;
		} else {
			e.preventDefault();
		}
	},
	/**
	 * Helper function for Stop Drag event
	 * 
	 * @param {event} e
	 */
	dragStop: function(e) {
		// Stop capturing mousemove and mouseup events.
		R.unbind(D, 'mousemove', dragMove);
		R.unbind(D, 'mouseup',   dragStop);
	}		
	
});

R.ns('R.dnd');

R.util.extend(R.dnd, {
	
	initDragAndDrop: function(id) {
		R.bind(_$(id), 'mousedown', function(e) {
			window.dragStart(e, id);
		});
	}
	
});



