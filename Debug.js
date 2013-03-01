// Debug.js

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
 * Debug javascript framework functions with support for:
 *  error()
 *  warn()
 *  info()
 *  debug()
 */

R.ns ("R.debug");

if(typeof console != 'undefined') {

	R.util.extend(R.debug, {
		/**
		* Write a error message to console
		*
		* @param {string} msg
		*/
		error: function(msg) {
			var d = new Date().toString();
			console.error(new String("{0} - {1}").format(d, msg));
		},
		/**
		* Write a information message to console
		*
		* @param {string} msg
		*/
		info: function(msg) {
			var d = new Date().toString();
			console.info(new String("{0} - {1}").format(d, msg));
		},
		/**
		* Write a warning message to console
		*
		* @param {string} msg
		*/
		warn: function(msg) {
			var d = new Date().toString();
			console.warn(new String("{0} - {1}").format(d, msg));
		},
		/**
		* Write a debug message to console
		*
		* @param {string} msg
		*/
		debug: function(msg) {
			var d = new Date().toString();
			console.log(new String("{0} - {1}").format(d, msg));
		}
	});	
		
	// Mark debug info with framework version
	R.debug.info(String('Running framework R with version {0}').format(R.version));
	
	// Associate error window with console
	R.bind(window, 'error', function(message, url, line) {
		R.debug.error('Error message: ' + message + '\nURL: ' + url + '\nLine Number: ' + line);
		return true;
	});
		
}




