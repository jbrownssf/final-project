angular.module('starter.controllers')
    .controller('SchedViewCtrl', ['$scope', '$rootScope', 'schedule', 'members', 'SchedulesService', '$state',
        function($scope, $rootScope, schedule, members, SchedulesService, $state) {

            $scope.$on('$ionicView.enter', function() {
                $rootScope.stopSpinner = true;

            });

            $scope.schedule = schedule;
            $scope.edit = function() {
                for(var j in $scope.schedule.schedule) {
                    for(var k in $scope.schedule.schedule[j][1]) {
                        $scope.schedule.schedule[j][1][k][1] = new Date($scope.schedule.schedule[j][1][k][1]);
                        $scope.schedule.schedule[j][1][k][2] = new Date($scope.schedule.schedule[j][1][k][2]);
                    }
                }
                SchedulesService.template($scope.schedule);
                $scope.schedule.assignedDate = new Date($scope.schedule.assignedDate);
                $state.go('org.detail.sched-create');
            };


            $scope.users = {};
            for (var i in members) {
                $scope.users[members[i].userId] = members[i];
            }
            $scope.who = function(a) {
                return $scope.users[a];
            };

        }
    ]);