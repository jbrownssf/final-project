angular.module('starter.controllers')
.controller('LobbyCtrl', ['$scope', '$rootScope', '$translate', 'FillSpotService',
        function($scope, $rootScope, $translate, FillSpotService) {
    
    // $scope.consoleLog = function(a) {
    //     console.log(a);
    // };
    
    $scope.logout = function() {
        $rootScope.$broadcast('request:auth');
    };
    // $scope.loginData = {};
    
    // //switch between edit/close edit options    
    // $scope.edit = [];
    // $scope.editSection = function(a) {
    //     if(a !== undefined)
    //         $scope.edit[a] ^= true;
    //     return $scope.edit[a];
    // };
    
    // $scope.addSection = function() {
    //     $scope.schedule.push([
    //         '',
    //         [
    //         ]
    //     ]);
    // };
    // $scope.addSpot = function($event, array) {
    //     $scope.schedule[array[0]][1].push([]);
    //     // console.log($scope.schedule[array[0]][1].length);
    //     array.push($scope.schedule[array[0]][1].length - 1);
    //     FillSpotService.set($event, $scope, 'schedule', array);
    // };
    
    // $scope.assignPosition = function($event, array) {
    //     FillSpotService.set($event, $scope, 'schedule', array);
    // };
    
    // $scope.who = function(a) {
    //     return $scope.users[a];
    // };
    
    // $scope.schedule = [ //TODO: move the fake data
    //     [
    //         'Maze-Maze',
    //         [
    //             [
    //                 'Maze',
    //                 new Date('Thu, 01 Jan 1970 20:59:00 GMT'),
    //                 new Date('Thu, 02 Jan 1970 20:59:00 GMT'),
    //                 '1'
    //             ]
    //         ]
    //     ]
    // ];
    
    
    // $scope.tempUsers = [
    //     {
    //         firstName: 'John',
    //         lastName: 'Brown',
    //         userId: '1'
    //     },
    //     {
    //         firstName: 'Zach',
    //         lastName: 'Smith',
    //         userId: '2'
    //     },
    //     {
    //         firstName: 'Teresa',
    //         lastName: 'Gonzolez',
    //         userId: '3'
    //     },
    //     {
    //         firstName: 'Josh',
    //         lastName: 'Jacobs',
    //         userId: '4'
    //     },
    //     {
    //         firstName: 'Jane',
    //         lastName: 'Doe',
    //         userId: '5'
    //     },
    //     {
    //         firstName: 'John',
    //         lastName: 'Doe',
    //         userId: '6'
    //     },
    //     {
    //         firstName: 'Jean',
    //         lastName: 'Mitchel',
    //         userId: '7'
    //     },
    //     {
    //         firstName: 'Ann',
    //         lastName: 'Marie',
    //         userId: '8'
    //     },
    //     {
    //         firstName: 'Stephanie',
    //         lastName: 'Charles',
    //         userId: '9'
    //     },
    //     {
    //         firstName: 'Chuck',
    //         lastName: 'Brown',
    //         userId: '10'
    //     },
    //     {
    //         firstName: 'Leann',
    //         lastName: 'Harley',
    //         userId: '11'
    //     }
    // ];
    // $scope.users = {};
    // for(var i in $scope.tempUsers) {
    //     $scope.users[$scope.tempUsers[i].userId] = $scope.tempUsers[i];
    // }
}])

.directive('lobbySelect', [ function() {
    return {
        restrict: "E",
        template:
            '<div class="padding text-center subheader">' +
                'Select an Organization' +
            '</div>' +
            '<div class="list">' +
                '<ion-item class="item" ng-show="reqMemRequests.statuses.length == 0">' +
                    'Click to add Organization' +
                '</ion-item>' +
                '<ion-item ng-click="nextPage(item)" class="item" ng-repeat="item in lobbySelect.data">' +
                    '{{item.orgName}}<span class="item-note">{{item.status}}</span>' +
                '</ion-item>' +
            '</div>',
        controller: ['$scope', '$rootScope', 'MembersRest', '$window', 'SSFAlertsService', '$state',
                function($scope, $rootScope, MembersRest, $window, SSFAlertsService, $state) {
            
            $scope.lobbySelect = {};
            $scope.lobbySelect.data = [];
            $rootScope.stopSpinner = true;
            function makeCall() {
                MembersRest.getCurrentOrgs($window.localStorage.token, $window.localStorage.userId)
                .then(function(res) {
                    if(res.status !== 200) return SSFAlertsService.showConfirm("Error", "There was a problem loading your page, would you like to try again?")
                    .then(function(res) {
                        if(res) makeCall();
                    });
                    $scope.lobbySelect.data = res.data;
                }, function(err) {
                    SSFAlertsService.showAlert("Error", "Some unknown error occured, please try again.");
                });
            }
            makeCall();
            $scope.nextPage = function(member) {
                $state.go('org.detail.lobby', {orgId: member.orgId, org: member});
            };
        }]
    };
    
}]);