/*
  Title:      validation scripts
  Version:    0.1
  History:    2013-08-06: TWUY : Initial creation
              2013-08-13: TWUY : Archiving in git
			                     Placeholder support added
								 Required and pattern support added
*/
"use strict";

// This checks if a specific attribute is supported
function attributeSupported(attribute) {
	return (attribute in document.createElement("input"));
}

// This check if a value matches a given regexp
function validateRegExp(inputValue, validationRule) {
	if(inputValue) {
		var regExpObj = new RegExp(validationRule);
		return regExpObj.test(inputValue);
	}
	return false;
}

// set classes for validation state
function setValidState(inputElement, isValid) {
	if (isValid) {
		inputElement.removeClass('invalid');
		inputElement.addClass('valid');
	}
	else {
		inputElement.removeClass('valid');
		inputElement.addClass('invalid');
	}
}

// validate an element
function validate(element) {
	var $obj = $(element);
	var isValid = false;
	var required = element.getAttribute('required') == null ? false : true;
	var pattern = element.getAttribute('pattern') == null ? false : true;
	
	if(required) {
		isValid = ($obj.val().replace($obj.attr('placeholder'), '') != '');
	}	
	if(pattern) {
		isValid = validateRegExp($obj.val().replace($obj.attr('placeholder'), ''), $obj.attr('pattern'));
	}
	if(!required && !pattern) {
		isValid = true;
	}		
	
	setValidState($obj, isValid);
	return isValid;
}

/* placeholder support (text, textarea)
     - for each input element with placeholder attribute
	 - if value is empty: add class placeholder and fill value with placeholder attribute value
	 - on focus: add class focus + if value is placeholder value, clear value and remove placeholder class
	 - on blur: remove class focus + if value is empty, set value to placeholder value again
*/
if(!attributeSupported('placeholder')) {
	$('input[placeholder],textarea[placeholder]').each(function() {
		var $obj = $(this);
		if($obj.val() === '') {
			$obj.addClass('placeholder');
			$obj.val($obj.attr('placeholder'));
		}
		$obj.focus(function() {
			$obj.addClass('focus');
			if($obj.val() === $obj.attr('placeholder')) {
				$obj.val('');
				$obj.removeClass('placeholder');
			}
		}).blur(function() {
			$obj.removeClass('focus');
			if($obj.val() === '') {
				$obj.addClass('placeholder');
				$obj.val($obj.attr('placeholder'));
			}
		});
	});
}

/* Pattern attribute support (only type text)
     - on each input element with a pattern attribute
     - attach an onChange event
     - call our regex validator with the elements value (replacing possible placeholder text with blanks on the fly) and the regex from the pattern attribute
*/
if(!attributeSupported('pattern') || ($.browser.safari)) {  // Safari thinks it has this attribute, but it does not work
	$('input[pattern]').each(function() {
		var $pat = $(this);
		$pat.change(function() {
			var is_match = validateRegExp($pat.val().replace($pat.attr('placeholder'), ''), $pat.attr('pattern'));
			setValidState($pat, is_match);
		});
	});
}

/*  Required attribute support (text, select, textarea)
	  - add class to element
	  - add keyup handler for all
	  - add change handler for select
*/
if(!attributeSupported('required')) {
	// Add required class to inputs
	$('input[required],textarea[required],select[required]').addClass('required');
	// validate text inputs on keystroke
	$('input[required],textarea[required],select[required]').keyup(function() {
		validate(this);
	});
	$('select[required]').change(function() {
		validate(this);
	});
}

// Block submit if any invalid classes found
$('form').submit(function() {
	$('input[required],textarea[required],select[required]').each(function() {
		validate(this);
	});
	if(($(this).find(".invalid").length) == 0) {
		// Delete any existing placeholder text
		$('input,textarea').each(function() {
			if($(this).val() == $(this).attr('placeholder')) $(this).val('');
		});
		return true;
	} else {
		return false;
	}	
});

