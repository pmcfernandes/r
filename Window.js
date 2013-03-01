// Window.js

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
 * Window helper for javascript framework
 *  norightclick()
 *  addFacebook()
 * 	redirect()
 */

R.util.extend(window, {

	/**
 	* Add no right click in event
 	*
 	* @param {function} fn
 	*/
	norightclick: function(msg) {
		if (R.empty(msg)) {
			msg = 'O botão direito do rato foi desabilitado.';
		}

		R.bind(D, 'mousedown', function(e) {
			e = e || window.event;
			if (R.isIE()) {
				if (e.button == 2) {
					alert(msg);
				}
			} else {
				if (e.which == 2 || e.which == 3) {
					alert(msg);
				}
			}
		});
	},
	/**
 	* Add item to facebook
 	*
 	* @param {string} title
 	* @param {string} description
 	*/
	addFacebook: function(title, url) {
		window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url) + '&t=' + encodeURIComponent(title), 'sharer', 'toolbar=0,status=0,width=626,height=436');
		return false;
	},
	/**
 	* Redirect to another page
 	*
 	* @param {string} url
 	*/
	redirect: function(url) {
		window.location.href = url;
	},
	/**
 	* Get browser name
 	*/
	browserName: function() {
		var ua = navigator.userAgent.toLowerCase();

		if (ua.indexOf('msie') != -1) {
			return 'msie';
		} else {
			if (ua.indexOf('opera') != -1) {
				return 'opera';
			} else {
				if (ua.indexOf('chrome') != -1) {
					return 'chrome';
				} else {
					if (ua.indexOf('firefox') != -1) {
						return 'firefox';
					} else {
						return 'unknown';
					}
				}
			}
		}
	}
});
