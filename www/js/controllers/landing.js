angular.module('starter.controllers', [])
    .controller('LandingCtrl', ['$scope', '$rootScope', '$state', '$ionicHistory', '$window',
        function($scope, $rootScope, $state, $ionicHistory, $window) {

            $scope.login = function() {
                $state.go('app.login');
            };
            $scope.register = function() {
                $state.go('app.register');
            };
            $scope.customBackground = function(a) {
                return {height: ($window.innerHeight - document.getElementById(a).getBoundingClientRect().top) + 'px'};
            };
        }
    ]);