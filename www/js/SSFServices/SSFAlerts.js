/*  SSFAlerts Services
Instructions:
1.  Inject 'SSFAlerts' into the app.js file.
2.  Place '<script src="js/SSFServices/SSFAlerts.js"></script>' into the index.html
            file above the app.js
3.  If you do not have the SSFConfig.js file, include it then you are finished including SSFAlerts.
4.  If you turn translation on, include SSFTranslate.js file and finish its steps before returning here.
            Otherwise you are done.
5.  Include the following within the 'SSF_CONFIG_CONSTANTS' ojbect:
"SSF_ALERTS_SERVICE": {
    "OKAY": "OK",
    "CANCEL": "Cancel"
}
6.  Include the following within the SSFTranslate.js file:
.run(['SSFTranslateService', 'SSFAlertsService',
        function(SSFTranslateService, SSFAlertsService) {
    var service = SSFTranslateService;
    service.showAlert = function(title, body) {
        return service.translate([title, body])
        .then(function(res) {
            return SSFAlertsService.showAlert(res[0], res[1]);
        });
    };
    service.showConfirm = function(title, body, okText, cancelText) {
        return service.translate([title, body, okText, cancelText])
        .then(function(res) {
            return SSFAlertsService.showConfirm(res[0], res[1], res[2], res[3]);
        });
    };
    service.showPopup = function($scope, $event, body) {
        return service.translate([body])
        .then(function(res) {
            return SSFAlertsService.showPopup($scope, $event, res[0]);
        });
    };
}])

Example Use with Translate:
SSFTranslate.showAlert('ERROR.TITLE', 'ERROR.CONTENT');
*/
    
angular.module('SSFAlerts', [])
.config(['SSFConfigConstants', function(SSFConfigConstants) {
    SSFConfigConstants['SSFAlertsService'] = {
    	//SSFTranslate should create a 'textTranslated' object whenever it translates
        'languageFileReference': [
            'SSF_CONFIG_CONSTANTS.SSF_ALERTS_SERVICE.OKAY',
            'SSF_CONFIG_CONSTANTS.SSF_ALERTS_SERVICE.CANCEL'
        ],
        'notTranslated': [
            'OK',
            'Cancel'
        ]
    };
}])
.service('SSFAlertsService', ['$ionicPopup', '$q', '$ionicPopover', 'SSFConfigConstants',
        '$ionicModal',
        function ($ionicPopup, $q, $ionicPopover, SSFConfigConstants, $ionicModal) {
    var service = this;
    
    //switches between the text to be used and translated text.
    var serviceText = undefined;
    if(SSFConfigConstants.shouldTranslate) {
        serviceText = SSFConfigConstants.SSFAlertsService.textTranslated;
    } else {
        serviceText = SSFConfigConstants.SSFAlertsService.notTranslated;
    }
    service.updateServiceText = function(array) {
        serviceText = array;
    };
    
    service.showAlert = function(title, body, okText) {
        // service.updateServiceText();
        if(navigator.notification === undefined) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: body,
                okText: (okText == undefined || okText == null) ? serviceText[0] : okText
            });
            return alertPopup;
        } else {
            var defer = $q.defer();
            var confirmCallback = function(buttonIndex) {
                defer.resolve(true);
            };
            navigator.notification.alert(body, confirmCallback, title, okText);
        }
    };
    
    service.showConfirm = function(title, body, okText, cancelText) {
        // service.updateServiceText();
        if(navigator.notification == undefined) {
            var confirmPopup = $ionicPopup.confirm({
                title: title,
                template: body,
                okText: (okText == undefined || okText == null) ? serviceText[0] : okText, 
                cancelText: (cancelText == undefined || cancelText == null) ? serviceText[1] : cancelText
            });
            return confirmPopup;
        } else {
            var defer = $q.defer();
            var confirmCallback = function(buttonIndex) {
                if(buttonIndex===1) {
                    defer.resolve(true);
                } else {
                    defer.resolve(false);
                }
            };
            var buttons = serviceText;
            if(okText != undefined)
                buttons[0] = okText;
            if(cancelText != undefined)
                buttons[1] = cancelText;
            navigator.notification.confirm(body, confirmCallback, title, buttons);
            return defer.promise;
        }
    };
    
    service.showPopup = function($scope, $event, body){
        // service.updateServiceText();
        var template = 
            '<ion-popover-view style="height:auto">' +
                '<ion-content class="center text-center padding-horizontal" scroll="false" style="position:relative;">' +
                    body +
                '</ion-content>' +
            '</ion-popover-view>';
        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });
        $scope.popover.show($event);
    };
    
    service.showModal = function(parameters, callback) {
        // {
        //     body: '',
        //     scope: $scope,
        //     title: ''
        // }
        var template = 
            '<ion-modal-view scroll="false">'+
                '<ion-header-bar>'+
                    '<h1 class="title">' + parameters.title + '</h1>'+
                    '<div class="button button-icon button-clear" ng-click="closeModal()"><button class="button-icon icon ion-close-round"></button></div>' +
                '</ion-header-bar>'+
                '<ion-content>';
        template += parameters.dragClose ? 
                    '<ion-refresher on-refresh="closeModal()" pulling-text="Pull to hide...">' +
                    '</ion-refresher>' : '';
        template +=
                    parameters.body +
                '</ion-content>'+
            '</ion-modal-view>';
        
        parameters.scope.chooseEmployer = $ionicModal.fromTemplate(template, {
            scope: parameters.scope,
            animation: 'slide-in-up',
            backdropClickToClose: false
        });
        parameters.scope.chooseEmployer.show();
        
        
        parameters.scope.closeEmployerPopover = function(a) {
            parameters.scope.chooseEmployer.remove();
            callback(0, a);
        };
        
        parameters.scope.closeModal = function() {
            parameters.scope.chooseEmployer.remove();
            callback('User closed modal');
        };
    };
    
    service.showPrompt = function(title, body, okText, cancelText)
    {
        if(navigator.notification == undefined)
        {
            var confirmPopup = $ionicPopup.prompt({
                title: title,
                template: body,
                cancelText: cancelText || 'Cancel',
                okText: okText || 'Okay'
                
            });
            return confirmPopup;
        }else {
            var defer = $q.defer();
            var confirmCallback = function(buttonIndex)
            {
                if(buttonIndex===1) {
                    defer.resolve(true);
                }else {
                    defer.resolve(false);
                }
            };
            navigator.notification.prompt(body, confirmCallback, title);
            return defer.promise;
        }
    };
}]);