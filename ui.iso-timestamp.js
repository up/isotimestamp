/*
 * jQuery UI ISO-Timestamp
 * see: http://ulipreuss.eu/projects/jquery-ui-iso-timestamp
 *
 * Copyright (c) 2009 Uli Preuss
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Depends:
 *	jquery.js
 */
(function($) { // hide the namespace

$.extend($.ui, { timestamp: { version: "@VERSION" } });

var PROP_NAME = 'timestamp';

/* Timestamp manager.
   Use the singleton instance of this class, $.timestamp, to interact with the timestamp picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */
var Timestamp = function(){
	
	var _self = this;
	this.oyears, this.omonths, this.odays, this.ohours, this.omins, this.osecs;
	
	this.options = { 
		
		// default options
		'set_current_time' : true,
		'show_select_hours' : true,
		'show_select_minutes' : true,
		'show_select_seconds' : true, 
		'show_btn_cancel' : true,
		'text_header' : 'Please select time:', 
		'text_year' : 'Year:',
		'text_month' : 'Month:',
		'text_day' : 'Day:',
		'text_hour' : 'Hour:',
		'text_minutes' : 'Minute:',
		'text_seconds' : 'Second:',
		'text_btn_ok' : 'ok', 
		'text_btn_cancel' : 'cancel'
	
	};
	
	this.add = function(id){
		
		var pos = $(id).position();
		$("BODY").append(
			'<div id="iso-timestamp" style="position: absolute; top:' + 
			pos.top + 'px; left:' + pos.left + 'px; display: none; "></div>'
		);
		
		// create options for year, month, day, hour, minute and second select boxes
		this.oyears = this.omonths = this.odays = this.ohours = this.omins = this.osecs = '';
		this.createSelectFieldOptions();
	
		this.createContent(id);
		
		this.setCssRules();
		
		// overwrite element content (e.g. for I18N)
		this.setUserOptions();

		this.selectOptions(id);
				
	}
	
	this.createSelectFieldOptions = function(id){
		for(i=0; i<60; i++) {
			item = i;
			if(i<10) this.oyears+= '<'+'option value="' + this.leadingZero(i+8) + '">' + this.leadingZero(i+8) + '<'+'/option>';
			if(i<12) this.omonths+= '<'+'option value="' + this.leadingZero(i+1) + '">' + this.leadingZero(i+1) + '<'+'/option>';
			if(i<31) this.odays+= '<'+'option value="' + this.leadingZero(i+1) + '">' + this.leadingZero(i+1) + '<'+'/option>';
			if(i<24) this.ohours+= '<'+'option value="' + this.leadingZero(i) + '">' + this.leadingZero(i) + '<'+'/option>';
			this.omins+= '<'+'option value="' + this.leadingZero(i) + '">' + this.leadingZero(i) + '<'+'/option>';
			this.osecs+= '<'+'option value="' + this.leadingZero(i) + '">' + this.leadingZero(i) + '<'+'/option>';
		}
	}
	
	this.createContent = function(id){
		var THISID = id;
		$('#iso-timestamp').html(
			'<h4 id="iso-timestamp-header"></h4>' +
			'<form id="iso-timestamp-form">' +
			'<div>' +
			'	<fieldset id="ui-iso-timestamp-years-fs">' +
			'		<legend></legend>' +
			'		<select id="ui-iso-timestamp-years">' + this.oyears + '</select>' +
			'	</fieldset>' +
			'	<fieldset id="ui-iso-timestamp-months-fs">' +
			'		<legend></legend>' +
			'		<select id="ui-iso-timestamp-months">' + this.omonths + '</select>' +
			'	</fieldset>' +
			'	<fieldset id="ui-iso-timestamp-days-fs">' +
			'		<legend></legend>' +
			'		<select id="ui-iso-timestamp-days">' + this.odays + '</select>' +
			'	</fieldset>' +
			'	<br style="clear:both" />' +
			'</div>' +
			'<div>' +
			'	<fieldset id="ui-iso-timestamp-hours-fs">' +
			'		<legend></legend>' +
			'		<select id="ui-iso-timestamp-hours">' + this.ohours + '</select>' +
			'	</fieldset>' +
			'	<fieldset id="ui-iso-timestamp-minutes-fs">' +
			'		<legend></legend>' +
			'		<select id="ui-iso-timestamp-minutes">' + this.omins + '</select>' +
			'	</fieldset>' +
			'	<fieldset id="ui-iso-timestamp-seconds-fs">' +
			'		<legend></legend>' +
			'		<select id="ui-iso-timestamp-seconds">' + this.osecs + '</select>' +
			'	</fieldset>' +
			'	<br style="clear:both" />' +
			'</div>' +
			'</form>' +
			'<div id="iso-timestamp-button-area">' +
			'	<input type="button" id="iso-timestamp-btn-ok" value="ok" onclick="$.timestamp.addSelectedTime(\'' + THISID + '\')" /> ' +
			'	<input type="button" id="iso-timestamp-btn-cancel" value="cancel" onclick="$.timestamp.hide()" />' +
			'</div>'
		);
	}
	this.setCssRules = function(){
		$('#iso-timestamp form').css({
			'border' : '1px solid #ccc',
			'margin' : '0',
			'padding' : '0 4px 8px 4px'
		});
		$('#iso-timestamp div').css({
			'marginTop' : '3px'
		});
		$('#iso-timestamp select').css({
			'margin' : '0'
		});
		$('#iso-timestamp div#iso-timestamp-button-area').css({
			'textAlign' : 'right',
			'marginTop' : '5px'
		});	
		$('#iso-timestamp h4#iso-timestamp-header').css({
			'margin' : '0'
		});
		$('#iso-timestamp fieldset').css({
			'padding' : '0px',
			'float' : 'left'		
		});
		$('#iso-timestamp legend').css({
			'padding' : '0 1px'		
		});
		$('#iso-timestamp').addClass('autowidth');
		
		$('#iso-timestamp').show('slow');
	}

	this.setUserOptions = function(){
		$('#iso-timestamp-header').html(_self.options.text_header);
		$('#ui-iso-timestamp-years-fs legend').html(_self.options.text_year);
		$('#ui-iso-timestamp-months-fs legend').html(_self.options.text_month);
		$('#ui-iso-timestamp-days-fs legend').html(_self.options.text_day);
		$('#ui-iso-timestamp-hours-fs legend').html(_self.options.text_hour);
		$('#ui-iso-timestamp-minutes-fs legend').html(_self.options.text_minutes);
		$('#ui-iso-timestamp-seconds-fs legend').html(_self.options.text_seconds);
		$('#iso-timestamp-btn-ok').val(_self.options.text_btn_ok);
		$('#iso-timestamp-btn-cancel').val(_self.options.text_btn_cancel);
		// hide elements
		if(_self.options.show_select_hours == false) $('#ui-iso-timestamp-hours-fs').hide();
		if(_self.options.show_select_minutes == false) $('#ui-iso-timestamp-minuntes-fs').hide();
		if(_self.options.show_select_seconds == false) $('#ui-iso-timestamp-seconds-fs').hide();
		if(_self.options.show_btn_cancel == false) $('#iso-timestamp-btn-cancel').hide();
	}		

	this.selectOptions = function(id){
		// if input not empty
		if($(id).val() != '') {
			var isoarray = iso2array($(id).val());
			$('select#ui-iso-timestamp-years option').each(function(i) {  
				if (isoarray[0] - 2000 == $(this).val()) {
					$('select#ui-iso-timestamp-years')[0].selectedIndex = i;
				} 
			});  	
			$('select#ui-iso-timestamp-months')[0].selectedIndex = isoarray[1];	
			$('select#ui-iso-timestamp-days')[0].selectedIndex = isoarray[2]-1;
			$('select#ui-iso-timestamp-hours')[0].selectedIndex = isoarray[3];
			$('select#ui-iso-timestamp-minutes')[0].selectedIndex = isoarray[4];	
			$('select#ui-iso-timestamp-seconds')[0].selectedIndex = isoarray[5];
		}	
		// select current year, month, day, hour, minute and second option
		else if(_self.options.set_current_time == true) {
			var now = new Date();
			$('select#ui-iso-timestamp-years option').each(function(i) {  
				if (now.getFullYear() - 2000 == $(this).val()) {
					$('select#ui-iso-timestamp-years')[0].selectedIndex = i; 
				}
			});  	
			$('select#ui-iso-timestamp-months')[0].selectedIndex = now.getMonth();	
			$('select#ui-iso-timestamp-days')[0].selectedIndex = now.getDate()-1;	
			$('select#ui-iso-timestamp-hours')[0].selectedIndex = now.getHours();	
			$('select#ui-iso-timestamp-minutes')[0].selectedIndex = now.getMinutes();	
			$('select#ui-iso-timestamp-seconds')[0].selectedIndex = now.getSeconds();	
		}	

	}
	
	this.addSelectedTime = function(id){
		// get selected values
		var sel_year = '20' + $('#ui-iso-timestamp-years :selected').text();
		var sel_month = $('#ui-iso-timestamp-months :selected').text();
		var sel_day = $('#ui-iso-timestamp-days :selected').text();
		var sel_hour = $('#ui-iso-timestamp-hours :selected').text();
		var sel_minute = $('#ui-iso-timestamp-minutes :selected').text();
		var sel_second = $('#ui-iso-timestamp-seconds :selected').text();
		
		// add time part of ISO 8601
		$(id).val(sel_year + '-' + sel_month + '-' + sel_day + 'T' + sel_hour + ':' + sel_minute + ':' + sel_second);
		
		this.hide();
		
	}
	
	this.hide = function(){
		
		$('#iso-timestamp').hide('slow', function(){
			$('#iso-timestamp').remove();
		});

	
	}
	
	this.leadingZero = function(num){
		
		if(num<10) item = '0' + num;
		else item = num;
		return item;
	
	}
	iso2array = function(isoStr){
		var dateTime_parts = isoStr.split('T');
		var iso_date_parts = dateTime_parts[0].split('-');
		var iso_time_parts = dateTime_parts[1].split(':');
	   	return [
	   		iso_date_parts[0], iso_date_parts[1]-1, iso_date_parts[2],
	   		iso_time_parts[0], iso_time_parts[1], iso_time_parts[2]
		];
	}
	
};

$.timestamp = new Timestamp(); // singleton instance
$.timestamp.version = "@VERSION";

// Add another global to avoid noConflict issues with inline event handlers
window.TS_jQuery = $;

})(jQuery);
