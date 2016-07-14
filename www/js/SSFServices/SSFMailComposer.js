/*  Opens the native mail sender based on the device the app is on.
Instructions:
1.  Inject 'SSFMailComposer' into the app.js file.
2.  Place '<script src="js/SSFServices/SSFMailComposer.js"></script>' into the index.html
            file above the app.js.
3.  Place the following config code into the SSFConfig.js file you are using:
.config(['SSFConfigConstants', function(SSFConfigConstants) {
    //forceAllegience will make every SSFMailService.sendMail(); call use these config inputs
    SSFConfigConstants['SSFMailService'] = {
        'toEmail': 'jpbrown@softstackfactory.org',
        'subjectLine': 'Sample Text',
        'bodyContent': 'Just checking out this SSFService.',
        'forceAllegience': false
    };
}])
*/

angular.module('SSFMailComposer', [])
.service('SSFMailService', ['$q', 'SSFConfigConstants',
        function ($q, SSFConfigConstants) {
    
    var service = this;
    
    service.sendMail = function(subject, body, toEmail) {
        //when calling this service, put null or undefined for fields intended to be set to default config data
        if(subject === undefined || subject === null || SSFConfigConstants.SSFMailService.forceAllegience) {
            subject = SSFConfigConstants.SSFMailService.subjectLine;
        }
        if(body === undefined || body === null || SSFConfigConstants.SSFMailService.forceAllegience) {
            body = SSFConfigConstants.SSFMailService.bodyContent;
        }
        if(toEmail === undefined || toEmail === null || SSFConfigConstants.SSFMailService.forceAllegience) {
            toEmail = SSFConfigConstants.SSFMailService.toEmail;
        }
        
        var defer = $q.defer();
        if (window.plugins && window.plugins.emailComposer) { //check if plugin exists
            window.plugins.emailComposer.showEmailComposerWithCallback(function (result) {
                //callback
                defer.resolve(result); 
            },
            subject,        // Subject
            body,        // Body
            [toEmail],     // To (Email to send)
            null,        // CC
            null,        // BCC
            false,       // isHTML
            null,        // Attachments
            null);       // Attachment Data
        }
        else {
            window.location.href = "mailto:"+toEmail+"?subject="+subject+"&body="+body;
            defer.resolve(true);
        }
        return defer.promise;
    };
}]);