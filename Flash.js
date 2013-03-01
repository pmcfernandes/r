// Flash.js

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
 * Flash javascript framework functions with support for:
 *  getFlashMimeType()
 *  getActiveX()
 *  parseVersion()
 *  getFlashVersion()
 *  checkInstall()
 *  load()
 *  createParamObj()
 */

R.ns('R.flash');

R.util.extend(R.flash, {
	/**
 	* Get mime type related with shockwave-flash
 	*/
	getFlashMimeType: function() {
		return 'application/x-shockwave-flash';
	},
	/**
	 * Get a class id of flash
	 */
	getClassId: function() {
		return 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
	},
	/**
 	* Get ActiveX object instance of Flash
 	*/
	getActiveX: function() {
		if (!window.ActiveXObject) {
			flashInstance = R.createEl('object', {
				type: R.flash.getFlashMimeType(),
				width: '100%',
				height: '100%'
			});
		} else {
			flashInstance = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
		}

		return flashInstance || {};
	},
	/**
 	* Parse version to a array of integers
 	*
 	* @param {string} version
 	*/
	parseVersion: function(version) {
		if (R.empty(version)) {
			version = '10.1.0.0';
		}

		var sp = version.split(' ');

		var version = (sp.length == 1 ? sp[0] : sp[1]);
		version = version.replace(/,/g, '.').split('.');

		// convert parts to numbers
		for (var i = 0; i < version.length; i++) {
			version[i] = parseInt(version[i]);
		};

		return version || {};
	},
	/**
 	* Get Flash version details
 	*/
	getFlashVersion: function() {
		var ax = R.flash.getActiveX();
		var version;

		if (ax) {
			if (R.isIE()) {
				version = ax.GetVariable('$version');
			} else {
				if (plugin = window.navigator.plugins['Shockwave Flash'])
					version = plugin.version;
			}
		}
		return R.flash.parseVersion(version) || {};
	},
	/**
 	* Check if Flash is installed and minimal version is garantted
 	*
 	* @param {string} minVersion
 	*/
	checkInstall: function(minVersion) {
		var _minVersion = R.flash.parseVersion(minVersion);
		var _version = R.flash.getFlashVersion();

		// Compare versions
		for (var i = 0; i < _version.length; i++) {
			if (_version[i] != _minVersion[i]) {
				return _version[i] > _minVersion[i];
			}
		};
		return true;
	},
	/**
 	* Create flash parameter
 	*
 	* @param {string} key
 	* @param {string} value
 	*/
	createParamObj: function(key, value) {
		var html = '<param name="{0}" value="{1}"></param>';
		return html.format(key, value);
	},
	/**
 	* Load flash in a element
 	*
 	* @param {selector} nodes
 	* @param {string} 	flashFile
 	*/
	load: function(nodes, flashFile, opts) {
		if (R.empty(R.flash.getFlashVersion()) == true) {
			throw "Flash object can't be founded or is null.";
		}

		// Check options
		if (R.empty(opts.width) || R.empty(opts.height)) {
			throw "Size option is needed.";
		}
					
		R.each(nodes.innerList, function (i, element) {
			var flash = '<object classid="{0}" data="{1}" width="{2}" height="{3}">';
			flash = flash.format(R.flash.getClassId(), flashFile, opts.width, opts.height);
			
			flash += R.flash.createParamObj('allowScriptAccess', 'always');
			flash += R.flash.createParamObj('movie', flashFile);
			flash += R.flash.createParamObj('quality', 'high');
			flash += R.flash.createParamObj('wmode', 'transparent');		
			
			var flashVars = '';
			if (typeof opts.flashvars == 'string') {
				flashVars = opts.flashvars;
			} 
			
			if (typeof opts.flashvars == 'object') {
				for (param in opts.flashvars) {
					flashVars += param + '=' + opts.flashvars[param] + '&';
				}
			}
							
			if (!R.empty(flashVars)) {
				flash += R.flash.createParamObj('flashvars', flashVars.substr(0, flashVars.length - 1));	
			}
						
			var embed = '<embed type="{0}" src="{1}" width="{2}" height="{3}"></embed>';
			embed = embed.format(R.flash.getFlashMimeType(), flashFile, opts.width, opts.height);
			flash += embed;
			flash += "</object>";
			element.innerHTML = flash;					
		});
	}
});

R.bind(window, "beforeunload", function() {
	 __flash__addCallback = function() {};
	 __flash__removeCallback = function() {};
});
