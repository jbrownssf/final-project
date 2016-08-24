angular.module('starter.controllers', [])
    .controller('LandingCtrl', ['$scope', '$rootScope', '$state', '$ionicHistory', '$window',
        function($scope, $rootScope, $state, $ionicHistory, $window) {
            $scope.customBackground = function(a) {
                return {height: ($window.innerHeight - document.getElementById(a).getBoundingClientRect().top) + 'px'};
            };
            $scope.whichOption = '1';
            $scope.setView = function(a) {
                $scope.whichOption = a;
            };
        }
    ]);