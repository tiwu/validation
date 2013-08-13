/*
  Title:      validation scripts
  Version:    0.1
  History:    2013-08-06: TWUY : Initial creation
              2013-08-13: TWUY : Archiving in git
*/
"use strict";

// This checks if a specific attribute is supported
function attributeSupported(attribute) {
	return (attribute in document.createElement("input"));
}

// Run on page load
$(function(){
	//Required attribute fallback (mostly for IE 9)
	$('#reservation_form').submit(function() {
		if (!attributeSupported("required") || ($.browser.safari)) {
			//If required attribute is not supported or browser is Safari (Safari thinks that it has this attribute, but it does not work), then check all fields that has required attribute
			$("#reservation_form [required]").each(function(index) {
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
