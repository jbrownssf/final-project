angular.module('starter.controllers', [])
    .controller('LandingCtrl', ['$scope', '$rootScope', '$state', '$ionicHistory', '$window',
    'ExamplesServ', '$ionicSlideBoxDelegate', 'SSFConfigConstants',
        function($scope, $rootScope, $state, $ionicHistory, $window, ExamplesServ, 
        $ionicSlideBoxDelegate, SSFConfigConstants) {
            $scope.customBackground = function(a) {
                return {height: ($window.innerHeight - document.getElementById(a).getBoundingClientRect().top) + 'px'};
            };
            $scope.whichOption = '1';
            $scope.setView = function(a) {
                $scope.whichOption = a;
            };
            $scope.viewExamples = function() {
                if($scope.modal) {
                    $ionicSlideBoxDelegate.slide(0);
                    $scope.modal.show();
                } else {
                    ExamplesServ.show({scope: $scope});
                }
            };
            
            if(!$window.localStorage.seenExample) {
                $window.localStorage.seenExample = true;
                $scope.viewExamples();
            }
            
          $scope.ssfInputModal =function() {
            if($window.innerWidth < SSFConfigConstants.SSFDirectives.contentWidth) {
              return {
                width: $window.innerWidth + 'px',
                margin: 'auto',
                height: '100%',
                top: '0%',
                right: '0%',
                bottom: '0%',
                left: '0%'
              };
            } else {
              return {
                width: SSFConfigConstants.SSFDirectives.contentWidth + 'px',
                margin: 'auto',
                height: '100%',
                top: '0%',
                right: '0%',
                bottom: '0%',
                left: '0%'
              };
            }
          };
        }
    ]);