// Linq.js

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
 * AJAX javascript framework functions with support for:
 *  getXHR()
 *  linq()
 *  linp()
 *  xml()
 *  json()
 */


/**
 * Extend R object with ajax functionality
 */
R.util.extend(R, {
	/**
	 * Internal function to validate response of XHR object
	 *
	 * @param {object} 	req			XmlHttpRequest object
	 * @param {function} onSuccedded	Succedded
	 * @param {function} onError		Error
	 */
	validateXHR: function(req, onSuccedded, onError) {
		// Se o estado do request for 4 (complete)
		if (req.readyState == 4) {
			// Se for OK
			if (req.status == 200 || req.status == 304) {
				onSuccedded (req.responseText);
			} else {
				if (R.empty(onError) == false) {
					onError(req.status, req.statusText);
				} else {
					alert("Existe um problema a obter os dados XML:\n" + req.statusText);
				}
			}
		}
	},
	/**
 	* Get XmlHttpRequest object instance
 	*/
	getXHR: function() {
		var req = false;
		// Utiliza o objecto native do XMLHttpRequest para os browsers nÃ£o IE
		if(window.XMLHttpRequest && !(window.ActiveXObject)) {
			try {
				req = new XMLHttpRequest();
			} catch(e) {
				req = false;
			}
		} else if(window.ActiveXObject) { // Se for IE usa o control ActiveX
			try {
				req = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				try {
					req = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {
					req = false;
				}
			}
		}
		return req;
	},
	/**
 	* Get response from AJAX server call
 	*
 	* @param {string} 	url
 	* @param {function} onSuccedded	Succedded
 	* @param {function} onError		Error
 	*
 	* <code>
 	* 	R.linq ('./videos.xml', function (responseText) {
 	* 		R.get('#div1').html(responseText);
 	* 	}, function (status, statusText) {
 	* 		alert (status + ': ' + statusText);
 	* 	})
 	* </code>
 	*/
	linq: function(url, onSuccedded, onError) {
		var req = R.getXHR();

		if(req) {
			req.onreadystatechange = function () {
				R.validateXHR(req, onSuccedded, onError);
			};
			req.open("GET", url, true);
			req.send(null);
		}
	},
	/**
 	* Post data to server using AJAX
 	*
 	* @param {string} 	url
 	* @param {string} 	params
 	* @param {function} onSuccedded	Succedded
 	* @param {function} onError		Error
 	*
 	* <code>
 	* 	R.linp ('./videos.xml', null, function (responseText) {
 	* 		R.get('#div1').html(responseText);
 	* 	}, function (status, statusText) {
 	* 		alert (status + ': ' + statusText);
 	* 	})
 	* </code>
 	*/
	linp: function(url, params, onSuccedded, onError) {
		var req = R.getXHR();
		var post = new String();

		params = params || {};
		R.each(params, function(i, param) {
			post += param + '=' + params[param] + '&';
		});
		post = post.substring(0, post.length - 1);

		if(req) {
			req.onreadystatechange = function () {
				R.validateXHR(req, onSuccedded, onError);
			};
			req.open("POST", url, true);
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			req.send(post);
		}
	},
	/**
 	* Get XML parser instance for selected xml text
 	*
 	* @param {string} data
 	*
 	* <code>
 	*    var xml = R.xml(responseText);
 	* </code>
 	*/
	xml: function(data) {
		var parser, xml;

		if(window.DOMParser && !(window.DOMParser)) {
			parser = new DOMParser();
			xml = parser.parseFromString(data, "text/xml");
		} else {
			xml = new ActiveXObject("Microsoft.XMLDOM");
			xml.async = "false";
			xml.loadXML(data);
		}

		if (!xml || xml.nodeName === "parsererror") {
			alert ("Ocorreu um erro ao processar o pedido do servidor.");
		}

		return xml;
	},
	/**
 	* Get json instance for selected json text
 	*
 	* @param {string} data
 	*
 	* <code>
 	*    var json = R.json(responseText);
 	* </code>
 	*/
	json: function(data) {
		if (typeof data !== 'string' || R.empty(data)) {
			return null;
		}
		
		// Make sure leading/trailing whitespace is removed 
		// (IE can't handle it)
		data = data.trim();
		
		// Attempt to parse using the native JSON parser first
		if (window.JSON && window.JSON.parse) {
			return window.JSON.parse( data );
		}
				
		// JSON RegExp
		rvalidchars = /^[\],:{}\s]*$/;
		rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
		rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
		rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
		
		// Make sure the incoming data is actual JSON
		if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {
			return (new Function( "return " + data ))();
		}	
	}
});
