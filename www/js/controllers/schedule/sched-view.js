angular.module('starter.controllers')
    .controller('SchedViewCtrl', ['$scope', '$rootScope', 'SSFUsersREST',
        'SchedulesService', '$state', 'SSFAlertsService', 'MembersRest',
        'SchedulesREST', '$window', '$stateParams', '$ionicActionSheet',
        'SSFMailService', '$filter', '$ionicHistory', '$timeout', 'HistoryRest',
        function($scope, $rootScope, SSFUsersREST, SchedulesService, $state,
            SSFAlertsService, MembersRest, SchedulesREST, $window, $stateParams,
            $ionicActionSheet, SSFMailService, $filter, $ionicHistory, $timeout,
            HistoryRest) {
        
            $scope.showHome = false;
            $scope.schedule = [];
            $scope.users = {};
            $scope.canEdit = false;
            $scope.historyItems = [];
            $scope.currentUser = $window.localStorage.userId;
            $scope.$on('$ionicView.enter', function() {
                $scope.doRefresh();
            });
            $scope.doRefresh = function(a) {
                $scope.currentUser = $window.localStorage.userId;
                $scope.showHome = !$ionicHistory.backTitle() ? true : false;
                $rootScope.stopSpinner = true;
                SchedulesREST.getById($window.localStorage.token, $stateParams.orgId, $stateParams.schedId)
                    .then(function(res) {
                        if (res.status !== 200) {
                            $scope.canEdit = false;
                            SSFAlertsService.showAlert('Warning', 'This service is currently unavailable.');
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('app.lobby');
                            return;
                        }
                        if (res.data.state === 'deleted') $state.go('app.org.detail.lobby');
                        $scope.schedule = res.data;
                        setSeen();
                    }, function(err) {
                        return SSFAlertsService.showAlert('Error', 'The schedules could not load.');
                    });

                MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, "accepted")
                    .then(function(res) {
                        if (res.status !== 200)
                            return SSFAlertsService.showAlert('Error', 'The members could not be loaded.');
                        var members = res.data;
                        for (var i in members) {
                            $scope.users[members[i].memberId] = members[i];
                        }
                    });
                MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, '', $window.localStorage.userId)
                    .then(function(res) {
                        if (res.status !== 200) return;
                        if (!res.data[0]) res.data[0] = {
                            status: 'pending'
                        };
                        $scope.canEdit = res.data[0].status === 'admin' || res.data[0].status === 'owner';
                    }, function(err) {

                    });
                HistoryRest.getBySchedId($window.localStorage.token, $stateParams.schedId, new Date().getTimezoneOffset())
                    .then(function(res) {
                        if (res.status !== 200) return;
                        $scope.historyItems = res.data;
                    }, function(err) {

                    });
                
                if(a) {
                    $timeout(function() {
                        $scope.$broadcast('scroll.refreshComplete');
                    }, '1500');
                }
                
            };

            function setSeen() {
                if($scope.schedule.state === "saved") return;
                for (var i in $scope.schedule.schedule) {
                    for (var j = 1; j < $scope.schedule.schedule[i].length; j++) {
                        for (var k in $scope.schedule.schedule[i][j]) {
                            if ($scope.schedule.schedule[i][j][k][3] === $window.localStorage.userId) {
                                SSFAlertsService.showAlert('Heads Up!',
                                    'On <b>' +
                                    $filter('date')($scope.schedule.assignedDate, 'EEEE, MMMM d, y') +
                                    // new Date($scope.schedule.assignedDate).toString('EEEE, MMMM d, y') +
                                    '</b> you will be working in the section <b>' +
                                    $scope.schedule.schedule[i][0] +
                                    '</b> in <b>' +
                                    $scope.schedule.schedule[i][j][k][0] +
                                    '</b> from <b>' +
                                    $filter('date')($scope.schedule.schedule[i][j][k][1], 'h:mm a') +
                                    // new Date($scope.schedule.schedule[i][j][k][1]).toString('h:mm a') +
                                    '</b> until <b>' +
                                    $filter('date')($scope.schedule.schedule[i][j][k][2], 'h:mm a') +
                                    // new Date($scope.schedule.schedule[i][j][k][2]).toString('h:mm a') +
                                    '</b>.');
                            }
                        }
                    }
                }
            }

            $scope.edit = function() {
                var tempSched = JSON.parse(JSON.stringify($scope.schedule));
                for (var j in tempSched.schedule) {
                    for (var k in tempSched.schedule[j][1]) {
                        if(tempSched.schedule[j][1][k][1]) tempSched.schedule[j][1][k][1] = new Date(tempSched.schedule[j][1][k][1]);
                        if(tempSched.schedule[j][1][k][2]) tempSched.schedule[j][1][k][2] = new Date(tempSched.schedule[j][1][k][2]);
                    }
                }
                tempSched.assignedDate = new Date(tempSched.assignedDate);
                SchedulesService.template(tempSched);
                $state.go('app.org.detail.sched-create');
            };


            $scope.who = function(a) {
                return $scope.users[a];
            };

            $scope.firstWindowWidth = function() {
                return $window.innerWidth >= 325;
            };
            $scope.secondWindowWidth = function() {
                return $window.innerWidth >= 400;
            };
            $scope.thirdWindowWidth = function() {
                return $window.innerWidth >= 450;
            };
            $scope.fourthWindowWidth = function() {
                return $window.innerWidth >= 500;
            };

            var options = [
                function(a) {
                    if (!a.cellphone)
                        return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
                    $window.open('sms:' + a.cellphone);
                },
                function(a) {
                    if (!a.cellphone)
                        return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
                    $window.open('tel:' + a.cellphone);
                },
                function(a) {
                    SSFMailService.sendMail('Sent From the Scheduling App', '', a.email);
                }
            ];
            $scope.selectMember = function(a) {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [{
                        text: "Text"
                    }, {
                        text: "Call"
                    }, {
                        text: "Email"
                    }],
                    // destructiveText: 'Delete',
                    titleText: 'Contact: ' + a.firstName + " " + a.lastName + (a.nickName ? ' (' + a.nickName + ')' : '') + '<br>' + $filter('tel')(a.cellphone) + '<br>' + a.email,
                    cancelText: 'Cancel',
                    cancel: function() {
                        // add cancel code..
                    },
                    buttonClicked: function(index) {
                        options[index](a);
                        return true;
                    }
                });
            };
            $scope.goHome = function() {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $window.localStorage.orgId ? $state.go('app.org.detail.lobby', {orgId: $window.localStorage.orgId}) : $state.go('app.lobby');
            };
            $scope.customBackground = function(a) {
                return {height: ($window.innerHeight - document.getElementById(a).getBoundingClientRect().top) + 'px'};
            };
            
            $scope.showWings = true;
            $scope.setSubHeaderGrid = function() {
                if(!$scope.showWings && $window.innerWidth >= 320) $scope.showWings = true;
                if($window.innerWidth > 745) return 'col-33';
                if($window.innerWidth > 505) return 'col-50';
                if($window.innerWidth > 381) return 'col-67';
                if($window.innerWidth >= 320) return 'col-80';
                $scope.showWings = false;
            };
        }
    ]);