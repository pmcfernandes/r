// Validation.js

// Copyright (C) 2011 Pedro Fernandes

// This program is free software; you can redistribute it and/or modify it under the terms of the GNU 
// General Public License as published by the Free Software Foundation; either version 2 of the 
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without 
// even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See 
// the GNU General Public License for more details. You should have received a copy of the GNU 
// General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 
// Temple Place, Suite 330, Boston, MA 02111-1307 USA

R.ns ('R.val');

R.util.extend(R.val, {
	_getValue: function(element) {
		if (element.getAttribute("type") == 'text' || 
		    element.getAttribute("type") == 'textarea') {
			return element.value;
		}			
	},
	/**
	 * Internal function to validate texts
	 * 
	 * @param {string} str
	 * @param {string} type
	 * @param {string} typeValue
	 */
	_checkValidator: function(str, type, typeValue) {

		// Check if string is empty or
		//  if is a number is equal 0
		if (type == 'required') {
			return R.empty(str)
		}
		// Check if str is a integer
		if (type == 'integer') {
			return !isNaN(str);
		}
		if (type == 'integer_min') {
			return Number(str) < Number(typeValue);
		}
		if (type == 'integer_max') {
			return Number(str) > Number(typeValue);
		}
		if (type == 'length_min') {
			return str.length < Number(typeValue);
		}
		if (type == 'length_max') {
			return str.length > Number(typeValue);
		}
		if (type == 'email') {
			var regexp_email = /^(.+)@(.+)$/;
			return regexp_email.test(str);
		}
		if (type == 'weburl') {
			var regexp_domain = /^[\w-\.]*\.[A-Za-z]{2,4}$/;
			return regexp_email.test(str);
		}
		if (type == 'ftpurl') {
			var regexp_domain = /^[ftp.]*\.[A-Za-z]{2,4}$/;
			return regexp_email.test(str);
		}
		if (type == 'ip') {
			var regexp_ip = /^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/;
			return regexp_email.test(str);
		}
		
		if (type == 'creditcard' && typeValue == 'american') {
			var regexp_american = /^3[47][0-9]{13}$/;
			return regexp_american.test(str);
		}
		if (type == 'creditcard' && typeValue == 'visa') {
			var regexp_visa = /^4[0-9]{12}(?:[0-9]{3})?$/;
			return regexp_visa.test(str);
		}
		if (type == 'creditcard' && typeValue == 'mastercard') {
			var regexp_mastercard = /^5[1-5][0-9]{14}$/;
			return regexp_mastercard.test(str);
		}
		
		return true;
	},
	/**
 	* Contains list of validations
 	*/
	validator: [],
	/**
 	* Add validation to validator list
 	*
 	* @param {json} jsa
 	*/
	add: function(jsa) {
		if (R.empty(jsa.id)) {
			throw 'Element id can\'t be null or empty.';
		}
		if (R.empty(jsa.checkList)) {
			throw 'Element checkList can\'t be null or empty.';
		}

		validator.push(jsa);
	},
	/**
	 * Validate form
	 */
	validateForm: function() {
		var msg = '';
		
		R.each (this.validator, function(i, obj) {
			var x = R.get('#' + obj.id);
			
			if (x.length > 0) {
				
				var str = this._getValue(x[0]);
				R.each(obj.checkList, function(j, lst) {		
								
					var type = String(lst.type).split(':');										
					if (!this._checkValidator(str, type[0], type[1])) {
						msg += lst.message + '\n';
					}
															
				});							
			
			}
		});
		
		if (!R.empty(msg)) {
			alert('Verifique os seguintes erros antes de continuar: \n\n' + msg);
		}
	}
});
