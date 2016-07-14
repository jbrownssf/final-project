/* Spinner while waiting for a call to return from a backend
Instructions:
1.  Inject 'SSFCss' into the app.js file before any of the other SSFServices.
2.  Place '<script src="js/SSFServices/SSFCss.js"></script>' into the index.html
            file above the app.js.
3.  If you have not already, include SSFConfig.js and place the following .config
            block of code inside of it.
.config(['SSFConfigConstants', function(SSFConfigConstants) {
  	//SSF Color Theme
	SSFConfigConstants['SSFCssService'] = {
		'buttonPrimary': '#A34D24',
		'buttonSecondary': '#808285',
		'header': '#EB7C23'
	};
}])
4.  Add the following classes to the class="" to your html:
            buttonPrimary: ssf-button
            buttonSecondary: ssf-button-inverted
            header: ssf-header
*/

angular.module('SSFCss', [])

.service('SSFCssService', ['$window', 'SSFConfigConstants',
		function($window, SSFConfigConstants) {
	
	var service = this;
	var defaultCss = SSFConfigConstants.SSFCssService;
	
	service.setCss = function(buttonPrimary, buttonSecondary, header) {
		//if values passed are undefined, then this service will use the default colors established in the SSFConfigConstants
		var cssObject = {};
		cssObject.buttonPrimary = buttonPrimary !== undefined ? buttonPrimary : defaultCss.buttonPrimary;
		cssObject.buttonSecondary = buttonSecondary !== undefined ? buttonSecondary : defaultCss.buttonSecondary;
		cssObject.header = header !== undefined ? header : defaultCss.header;
		var sheet = window.document.styleSheets[0];
		for(var i = sheet.rules.length - 1; i > 0; i--) {
			if(sheet.rules[i].cssText.slice(0, 5) === '.ssf-') {
				sheet.deleteRule(i); //does not delete css loaded via file
			}
		}
		$window.localStorage['ssfCss'] = JSON.stringify(cssObject);
		sheet.insertRule(
			'.ssf-button {' +
				'font-weight: bold !important;' + 
				'background-color: ' + cssObject.buttonPrimary + ' !important;' + 
			'}', sheet.cssRules.length);
		sheet.insertRule(
			'.ssf-button-inverted {' + 
				'font-weight: bold !important;' + 
				'background-color: ' + cssObject.buttonSecondary + ' !important;' + 
			'}', sheet.cssRules.length);
		sheet.insertRule(
			'.ssf-bar-header {' + 
				'background-color: ' + cssObject.header + ' !important;' + 
			'}', sheet.cssRules.length);
		sheet.insertRule(
			'.ssf-tabs {' + 
				'font-weight: bold !important;' + 
				'background-color: ' + cssObject.buttonPrimary + ' !important;' + 
			'}', sheet.cssRules.length);
		sheet.insertRule(
			'.checkbox-calm .checkbox-icon:before {' +
    			'border-color: ' + cssObject.buttonPrimary + ' !important;' +
    		'}', sheet.cssRules.length);
	};
}])

.run(['SSFConfigConstants', '$window',
		function(SSFConfigConstants, $window) {
	var cssObject = $window.localStorage['ssfCss'] === undefined ? SSFConfigConstants.SSFCssService : JSON.parse($window.localStorage['ssfCss']);
	var sheet = window.document.styleSheets[0];
	sheet.insertRule(
	    '.ssf-button {' +
				'font-weight: bold !important;' +
				'background-color: ' + cssObject.buttonPrimary + ' !important;' +
	    '}', sheet.cssRules.length);
	sheet.insertRule(
	    '.ssf-button-inverted {' +
				'font-weight: bold !important;' +
				'background-color: ' + cssObject.buttonSecondary + ' !important;' +
	    '}', sheet.cssRules.length);
	sheet.insertRule(
	    '.ssf-bar-header {' +
				'background-color: ' + cssObject.header + ' !important;' +
	    '}', sheet.cssRules.length);
		sheet.insertRule(
	    '.ssf-tabs {' +
				'font-weight: bold !important;' +
				'background-color: ' + cssObject.buttonPrimary + ' !important;' +
	    '}', sheet.cssRules.length);
	sheet.insertRule(
	    '.checkbox input:checked:before, .checkbox input:checked + .checkbox-icon:before {' +
				'background: ' + cssObject.buttonPrimary + ' !important;' +
				'border-color: ' + cssObject.buttonPrimary + ' !important;' +
	    '}', sheet.cssRules.length);
	sheet.insertRule(
		'.checkbox-calm .checkbox-icon:before {' +
			'border-color: ' + cssObject.buttonPrimary + ' !important;' +
		'}', sheet.cssRules.length);
}]);