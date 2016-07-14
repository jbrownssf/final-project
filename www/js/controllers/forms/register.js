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
            return $state.go('lobby');
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
}]);