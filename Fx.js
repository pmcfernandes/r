// Fx.js

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
 * Effects and transactions javascript framework functions with support for:
 *  init()
 *  add()
 *  start()
 *  cancel()
 *  increase()
 */

R.ns ('R.fx');
R.ns ('R.fx.mov')

R.util.extend(R.fx.mov, {
	/**
 	* Move By position
 	*
 	* @param {object} obj
 	* @param {int}    x
 	* @param {int}    y
 	*/
	moveBy: function(obj, x, y) {
		obj.style.left = parseInt(obj.style.left) + x + "px";
		obj.style.top = parseInt(obj.style.top) + y + "px";
	},
	/**
 	* Move To position
 	*
 	* @param {object} obj
 	* @param {int}    x
 	* @param {int}    y
 	*/
	moveTo: function (obj, x, y) {
		obj.style.left = x + "px";
		obj.style.top = y + "px";
	}
});

R.util.extend (R.fx, {
	/**
 	* Internal variables
 	*/
	_isRunning: false,
	_timer: null,
	_currentState: 0,
	_element: null,
	/**
 	* Options property
 	*/
	options: null,
	/**
 	* Constructor
 	*
 	* @param {object} options
 	*/
	init: function(options) {
		this.options = options;

		if (R.empty(this.options)) {
			this.options = {
				type: 'left',
				from: 0,
				to: 100,
				delay: 50
			}
		}

		return this;
	},
	/**
 	* Add options
 	*
 	* @param {object} options
 	*/
	add: function(options) {
		return this.init(options);
	},
	/**
 	* Start animation
 	*
 	* @param {object} element
 	*/
	start: function(element, processingFn, completedFn) {
		this._currentState = 0;
		this._isRunning = true;
		this._element = element;

		this._timer = setInterval(R.util.applyFn(this.increase, this, new Array(processingFn, completedFn)), this.options.delay);
	},
	/**
 	* Cancel transaction
 	*/
	cancel: function() {
		_isRunning = false;
		this._timer = clearInterval(this._timer);
	},
	/**
 	* Increase function
 	*/
	increase: function(processingFn, completedFn) {
		if (parseInt(this._currentState) >= parseInt(this.options.to)) {
			if (!R.empty(completedFn)) {
				completedFn(this.options.to);
			}

			this.cancel();
		} else {
			if (!R.empty(processingFn)) {
				processingFn(this._currentState);
			}

			this._currentState = parseInt(this._currentState) + 1;
		}
	}
});
