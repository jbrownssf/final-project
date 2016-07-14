/* A single place to configure all of the SSFServices
Instructions:
1.  Inject 'SSFConfig' into the app.js file before any of the other SSFServices.
2.  Place '<script src="js/SSFConfig.js"></script>' into the index.html
            file above the app.js.
3.  Check all existing SSFServices for .config blocks of code, comment those out and include
    them in this file (with the exception of language related .config(...)s). If those files
            have a ".constant('SSFConfigConstants'...)" be sure to comment it out.
4.  If you change 'shouldTranslate' to true, be sure to include SSFTranslate.js
*/


angular.module('SSFConfig', [])
.constant('SSFConfigConstants', {
    //  if translation is a feature of the app, switch 'shouldTranslate' from false to true and review step 4.
    'shouldTranslate': false,
    'eulaUrl': 'http://www.softstackfactory.com/eula-content/'
})
.config(['SSFConfigConstants', function(SSFConfigConstants) {
    SSFConfigConstants['SSFDirectives'] = {
        'contentWidth': 900
    };
}])
.config(['SSFConfigConstants', function(SSFConfigConstants) {
    //forceAllegience will make every SSFMailService.sendMail(); call use these config inputs
    SSFConfigConstants['SSFMailService'] = {
        'toEmail': 'jpbrown@softstackfactory.org',
        'subjectLine': 'Sample Text',
        'bodyContent': 'Just checking out this SSFService.',
        'forceAllegience': false
    };
}])
.config(['SSFConfigConstants', function(SSFConfigConstants) {
    SSFConfigConstants['EndpointUrl'] = {
        'url': 'https://scheduling-app-jbrownssf-1.c9users.io/api/'
    };
}])
.config(['SSFConfigConstants', function(SSFConfigConstants) {
  	//SSF Color Theme
	SSFConfigConstants['SSFCssService'] = {
		'buttonPrimary': '#A34D24',
		'buttonSecondary': '#808285',
		'header': '#EB7C23'
	};
}])


;