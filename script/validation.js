/*
  Title:      validation scripts
  Version:    0.1
  History:    2013-08-06: TWUY : Initial creation
              2013-08-13: TWUY : Archiving in git
			                     Placeholder support added
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

/* placeholder support
     - for each input element with placeholder attribute
	 - if value is empty: add class placeholder and fill value with placeholder attribute value
	 - on focus: add class focus + if value is placeholder value, clear value and remove placeholder class
	 - on blur: remove class focus + if value is empty, set value to placeholder value again
*/
if(!attributeSupported('placeholder')) {
	$(':input[placeholder]').each(function() {
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

/* Pattern attribute support
     - on each input element with a pattern attribute
     - attach an onChange event
     - call our regex validator with the elements value (replacing possible placeholder text with blanks on the fly) and the regex from the pattern attribute
*/
if(!attributeSupported('pattern') || ($.browser.safari)) {  // Safari thinks that it has this attribute, but it does not work
	$(':input[pattern]').each(function() {
		var $pat = $(this);
		$pat.change(function() {
			var is_valid = validateRegExp($pat.val().replace($pat.attr('placeholder'), ''), $pat.attr('pattern'));
			setValidState($pat, is_valid);
		});
	});
}





// Add required class to inputs
$(':input[required]').addClass('required');



// Run on page load
$(function(){
	//Required attribute fallback (mostly for IE 9)
	$('form').submit(function() {
		if (!attributeSupported("required") || ($.browser.safari)) {
			//If required attribute is not supported or browser is Safari (Safari thinks that it has this attribute, but it does not work)
			$("form [required]").each(function(index) {
				if (!$(this).val()) {
					//If at least one required value is empty, then ask to fill all required fields.
					alert("Please fill all required fields.");
					return false;
				}
			});
		}
		return false; //This is a test form and I'm not going to submit it
	});
});
