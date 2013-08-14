validation
==========

A little demo implementation for missing HTML5 form validation attributes in older browsers.

I created this specifically for IE9 on Win7, and have therefore only tested it there too.
All modern browsers should be able to handle this functionality natively and ignore the javascript.

Currently supported attribute fallbacks are:
    - required : supported on input, textarea and select elements
    - placeholder : supported on input and textarea elements
    - pattern : supported on input elements only
