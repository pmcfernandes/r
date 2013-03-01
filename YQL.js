// YQL.js

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
 * Yahoo Query Language helper javascript framework functions with support for:
 *  init()
 *  get()
 *  each()
 *  isArray()
 */

R.ns ("R.yql");

R.util.extend(R.yql, {
	/**
 	* Constructor
 	*
 	* @param {object} options
 	*/
	init: function(options) {
		this.options = options;

		if (R.empty(this.options)) {
			this.options = {
				URLTemplate: 'http://query.yahooapis.com/v1/public/yql?format=json&env=store://datatables.org/alltableswithkeys&q={0}'
			}
		}

		return this;
	},
	/**
 	* Get data from web
 	*
 	* @param {string} 	 url
 	* @param {function} onSucedded
 	* @param {optional function} onError
 	*
 	* <code>
 	*  R.yql.get("select * from rss where url='feeds2.feedburner.com/ajaxian'", function(i, obj) {
 	*		alert (i + " " + obj.link)
 	*  })
 	* </code>
 	*/
	get: function(query, onSucedded, onError) {
		if (R.empty(this.options)) {
			this.init(null);
		}
		
		R.linq(String(this.options.URLTemplate).format(query), function (responseText) {
			
			var json = R.json(responseText);			
			// Get Json	
			if (json.query.count > 0 && json.query.results != null) {
				onSucedded(json.query.count, json.query.results);
			} else {
				onError(500, 'No data founded.');
			}					
						
		}, function(status, statusText) {
			if (!R.empty(onError)) {
				onError(status, statusText);
			} else {
				alert("Erro ao obter os dados XML:\n" + statusText);
			}
		});
	},	
	/**
	 * Foreach element
	 */
	each: function(results, fn) {		
		if (!R.yql.isArray(results)) {			
			fn(0, results);		
		} else {			
			R.each(results, function(i, obj) {
				fn(i, obj);
			});				
		}			
	},
	/**
	 * Check if function contains array
	 */
	isArray: function(results) {
		return ((results instanceof Array) ? true : false);
	}
});

