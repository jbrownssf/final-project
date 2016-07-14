angular.module('starter.controllers')
.controller('SchedListCtrl', ['$scope', 'schedules', 'SchedulesService', '$state', '$ionicListDelegate', '$window', 'SchedulesREST',
        function($scope, schedules, SchedulesService, $state, $ionicListDelegate, $window, SchedulesREST) {
    
    $scope.schedules = schedules;
    
    //switch between published/unpublished options
    $scope.edit = [];
    $scope.editSection = function(a) {
        if(a !== undefined)
            $scope.edit[a] ^= true;
        return $scope.edit[a];
    };
    
    $scope.gotoSched = function(selectedSched) {
        SchedulesService.singleSched(selectedSched);
        $state.go('sched-view');
    };
    
    $scope.listCanSwipe = true;
    
    $scope.newSchedule = function() {
        var tempObj = {
            note: '',
            // createDate: new Date(),
            state: '',
            groupId: '',
            schedule: [
                [
                    '',
                    []
                ]
            ]
        };
        SchedulesService.template(tempObj);
        $state.go('sched-create');
    };
    $scope.clone = function(schedule) {
        var tempSchedule = {};
        for(var i in schedule) {
            if(i !== 'id' && i !== 'state')
                tempSchedule[i] = JSON.parse(JSON.stringify(schedule[i]));
        }
        for(var j in tempSchedule.schedule) {
            for(var k in tempSchedule.schedule[j][1]) {
                tempSchedule.schedule[j][1][k][1] = new Date(tempSchedule.schedule[j][1][k][1]);
                tempSchedule.schedule[j][1][k][2] = new Date(tempSchedule.schedule[j][1][k][2]);
            }
        }
        SchedulesService.template(tempSchedule);
        $ionicListDelegate.closeOptionButtons();
        $state.go('sched-create');
    };
    $scope.delete = function(schedule) {
        schedule.state = 'deleted';
        SchedulesREST.upsert($window.localStorage.token, schedule);
        $ionicListDelegate.closeOptionButtons();
        //update
    };
    $scope.publish = function(schedule) {
        schedule.state = schedule.state === 'published' ? 'saved' : 'published';
        SchedulesREST.upsert($window.localStorage.token, schedule);
        $ionicListDelegate.closeOptionButtons();
    };
}]);