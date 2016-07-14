angular.module('starter.controllers')
.controller('SchedViewCtrl', ['$scope', '$rootScope', 'schedule', 'members', 'SchedulesService', '$state',
        function($scope, $rootScope, schedule, members, SchedulesService, $state) {
    
    $scope.schedule = schedule;
    $scope.edit = function() {
        // for(var j in $scope.schedule.schedule) {
        //     for(var k in $scope.schedule.schedule[j][1]) {
        //         $scope.schedule.schedule[j][1][k][1] = new Date($scope.schedule.schedule[j][1][k][1]);
        //         $scope.schedule.schedule[j][1][k][2] = new Date($scope.schedule.schedule[j][1][k][2]);
        //     }
        // }
        // $scope.schedule.assignedDate = new Date($scope.schedule.assignedDate);
        SchedulesService.template($scope.schedule);
        $state.go('sched-create');
    };
    
    
    $scope.users = {};
    for(var i in members) {
        $scope.users[members[i].userId] = members[i];
    }
    $scope.who = function(a) {
        return $scope.users[a];
    };
    
}]);