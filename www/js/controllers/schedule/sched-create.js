angular.module('starter.controllers')
.controller('SchedCreateCtrl', ['$scope', 'FillSpotService', 'members', 'template', '$state',
        'SchedulesREST', '$window', 'SSFAlertsService', 'SchedulesService',
        function($scope, FillSpotService, members, template, $state, SchedulesREST, $window,
        SSFAlertsService, SchedulesService) {
    
    $scope.consoleLog = function(a) {
        console.log(a);
    };
        
    $scope.addSection = function() {
        $scope.schedule.schedule.push([
            '',
            []
        ]);
    };
    $scope.addSpot = function($event, array) {
        $scope.schedule.schedule[array[0]][1].push(['New Position']);
        // console.log($scope.schedule[array[0]][1].length);
        array.push($scope.schedule.schedule[array[0]][1].length - 1);
        FillSpotService.set($event, $scope, 'schedule', array);
    };
    
    $scope.assignPosition = function($event, array) {
        FillSpotService.set($event, $scope, 'schedule', array);
    };
    
    $scope.schedule = template;
    
    $scope.users = {};
    for(var i in members) {
        $scope.users[members[i].userId] = members[i];
    }
    $scope.who = function(a) {
        return $scope.users[a];
    };
    var action;
    $scope.submitType = function(form, value) {
        action = value;
        $scope.handleForm(form);
    };
    
    $scope.handleForm = function(form) {
        if(form.$invalid)
            return SSFAlertsService('Error', 'Please make sure all fields are filled in.');
        
        // var tempObj = {
        //     schedule: $scope.schedule,
        //     // id: '123'
        // };
        var hadId = $scope.schedule.id !== undefined;
        if(action === 'saved') {
            console.log(1);
            $scope.schedule.state = $scope.schedule.state === 'published' ? 'published' : 'saved';
        } else if(action === 'published') {
            console.log(2);
            $scope.schedule.state = 'published';
        } else if(action === 'deleted') {
            console.log(3);
            $scope.schedule.state = 'deleted';
        }
        $scope.schedule.createDate = new Date().toUTCString();
        $scope.schedule.groupId = 'abc';
        SchedulesREST.upsert($window.localStorage.token, $scope.schedule)
        .then(function(res) {
            if(res.status === 200 || (res.status === 404 && $scope.submitType === 'deleted')) {
                if(hadId) {
                    SchedulesService.template(res.data);
                    $state.go('sched-view');
                } else {
                    $state.go('sched-list'); //go to list of schedules page
                }
            } else {
                SSFAlertsService.showAlert('Error', 'Something went wrong with updating your schedule.');
            }
        });
    };
}]);