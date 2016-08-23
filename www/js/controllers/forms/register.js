angular.module('starter.controllers')
.controller('RegisterCtrl', ['$scope', '$http', '$state', '$window', '$ionicHistory',
        '$translate', '$rootScope', '$q', 'SSFUsersREST', 'SSFAlertsService', 'SSFConfigConstants',
        function($scope, $http, $state, $window, $ionicHistory,$translate, $rootScope,
        $q, SSFUsersREST, SSFAlertsService, SSFConfigConstants) {
    
    function prepData() {
        $scope.registerData.language = $translate.use();
        var dateToSend = new Date();
        $scope.registerData.created = dateToSend.toUTCString();
        $scope.registerData.lastLog = dateToSend.toUTCString();
    }
    
    //sets current user's information **make sure this function mirrors the LoginCtrl function**
    function setLocalStorage(data) {
        $window.localStorage['rememberMe'] = $scope.checkbox.rememberMe;
        $window.localStorage['userId'] = data.id;
        $window.localStorage['token'] = data.token;
        if($scope.checkbox.rememberMe) {
            $window.localStorage["email"] = $scope.registerData.email;
        } else {
            delete $window.localStorage["email"];
        }
        $scope.registerData = {'hasAcceptedEULA': false};
        setProgress();
    }
    
    function setProgress() {
        // return SSFUsersREST.updateUser($window.localStorage.token, $window.localStorage.userId, {})
        // .then(function(response){
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true
            });
            return $state.go('app.lobby');
        // });
    }
    
    function retryRegister(form) {
        return SSFAlertsService.showConfirm("Error", "Something went wrong, do you want to try again?")
        .then(function(res) {
            if(res)
                $scope.submitRegisterForm(form);
        });
    }
    
    
    $scope.registerData = {'hasAcceptedEULA': false};
    
    $scope.checkbox = {};
    $scope.$on('$ionicView.enter', function() {
        // Code you want executed every time view is opened
        if($window.localStorage.rememberMe === undefined || $window.localStorage.rememberMe === 'true') {
            $scope.checkbox.rememberMe = true;
        } else {
            $scope.checkbox.rememberMe = false;
        }
        $rootScope.stopSpinner = true;
        SSFUsersREST.getIP()
        .then(function(response) {
            $scope.registerData.regIP = response.data;
            $scope.registerData.logIP = response.data;
        });
    });
    $scope.repeatPassword = {};
    
    $scope.submitRegisterForm = function(form) {
        if(form.password.$invalid)
            return SSFAlertsService.showAlert("Error", "Your password must be at least 8 characters long and contain one of each of the following: An upper and lower case letter, a number, and a special character which include, but are not limited to: ! @ # $");
        if(!$scope.registerData.hasAcceptedEULA)
            return SSFAlertsService.showAlert("Error", "You must first accept our End User License Agreement in order to register with us.");
        if($scope.repeatPassword.password !== $scope.registerData.password)
            return SSFAlertsService.showAlert("Error", "Your passwords do not match.");
        if($scope.registerData.cellphone)
            if($scope.registerData.cellphone.length !== 10 && $scope.registerData.cellphone.length !== 0)
                return SSFAlertsService.showAlert("Error", "Your cellphone number has to be 10 numbers long or not at all.");
        if(form.$invalid)
            return SSFAlertsService.showAlert("Error", "Check to make sure all required fields are filled in.");
        prepData();
        SSFUsersREST.create($scope.registerData)
        .then(function(response) {
            if(response.status === 204)
                return SSFAlertsService.showAlert('Error', 'That email has already been used.');
            if(response.status !== 200)
                return SSFAlertsService.showAlert('Error', 'There was a problem with authenticating your session. Please sign in.');
            // $ionicAnalytics.setGlobalProperties({
            //     ZibID: response.data.userId
            // });
            $scope.repeatPassword = {};
            setLocalStorage(response.data);
        }, function(err) {
            if(err.status === 204)
                return SSFAlertsService.showAlert('Error', 'That email has already been used.');
            retryRegister(form);
        });
    };
    
    $scope.showPopup = function($event, body){
        return SSFAlertsService.showPopup($scope, $event, body);
    };
    
    $scope.clickedRememberMe = function() {
        $window.localStorage['rememberMe'] = $scope.checkbox.rememberMe;
    };
    
    $scope.navEula = function() {
        if($window.cordova && cordova.InAppBrowser){
            cordova.InAppBrowser.open(SSFConfigConstants.eulaUrl, '_blank', 'location=no,hardwareback=no');
        } else {
            $window.open(SSFConfigConstants.eulaUrl);
        }
    };
    $scope.customBackground = function(a) {
        return {height: ($window.innerHeight - document.getElementById(a).getBoundingClientRect().top) + 'px'};
    };
}])
.directive('phoneInput', function($filter, $browser) {
    //directive from: https://codepen.io/rpdasilva/pen/DpbFf?editors=1000
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
})
.filter('tel', function () {
    //filter from: https://codepen.io/rpdasilva/pen/DpbFf?editors=1000
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else{
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else{
            return "(" + city;
        }

    };
});