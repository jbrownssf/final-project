angular.module('starter.controllers', [])
.controller('LandingCtrl', ['$scope', '$rootScope', '$state', '$ionicHistory',
        function($scope, $rootScope, $state, $ionicHistory) {
    
    $scope.login = function() {
        $state.go('login');
    };
    $scope.register = function() {
        $state.go('register');
    };
}]);