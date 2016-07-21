angular.module('starter.controllers')
    .controller('SchedCreateCtrl', ['$scope', 'FillSpotService', '$state',
        'SchedulesREST', '$window', 'SSFAlertsService', 'SchedulesService', '$rootScope',
        'SSFUsersREST', '$stateParams', 'MembersRest', '$ionicHistory',
        function($scope, FillSpotService, $state, SchedulesREST, $window,
            SSFAlertsService, SchedulesService, $rootScope, SSFUsersREST, $stateParams,
            MembersRest, $ionicHistory) {


            $scope.users = {};
            $scope.schedule = [];
            $scope.canEdit = true;
            $scope.$on('$ionicView.enter', function() {
                $rootScope.stopSpinner = true;
                $scope.schedule = SchedulesService.template();
                MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, "accepted")
                    .then(function(res) {
                        if (res.status === 200) {
                            for (var i in res.data) {
                                $scope.users[res.data[i].memberId] = res.data[i];
                            }
                        }
                    });
                MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, '', $window.localStorage.userId)
                    .then(function(res) {
                        if (res.status !== 200) return;
                        if (!res.data[0]) res.data[0] = {
                            status: 'pending'
                        };
                        $scope.canEdit = res.data[0].status === 'admin' || res.data[0].status === 'owner';
                        if (!$scope.canEdit) {
                            SSFAlertsService.showAlert('Warning', 'You do not have permission to view this page. You will be redirected to the main lobby.');
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('lobby');
                        }
                    }, function(err) {

                    });
            });
            
            $scope.spotChangedResetView = function(a) {
                delete a[4];
            };

            $scope.addSection = function() {
                $scope.schedule.schedule.push([
                    '', []
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

            $scope.who = function(a) {
                return $scope.users[a];
            };
            var action;
            $scope.submitType = function(form, value) {
                action = value;
                $scope.handleForm(form);
            };

            $scope.handleForm = function(form) {
                if (form.$invalid)
                    return SSFAlertsService.showAlert('Error', 'Please make sure all fields are filled in.');
                var hadId = $scope.schedule.id !== undefined;
                if (action === 'saved') {
                    $scope.schedule.state = $scope.schedule.state === 'published' ? 'published' : 'saved';
                }
                else if (action === 'published') {
                    $scope.schedule.state = 'published';
                }
                else if (action === 'deleted') {
                    $scope.schedule.state = 'deleted';
                }
                $scope.schedule.createDate = new Date().toUTCString();
                $scope.schedule.groupId = $stateParams.orgId;
                SchedulesREST.upsert($window.localStorage.token, $scope.schedule)
                    .then(function(res) {
                        if (res.status === 200 || (res.status === 404 && $scope.submitType === 'deleted')) {
                            if (hadId) {
                                SchedulesService.template(res.data);
                                if(res.data.state === 'deleted') return $state.go('org.detail.lobby');
                                $state.go('org.detail.sched-view.detail', {
                                    schedId: res.data.id
                                });
                            }
                            else {
                                if(res.data.state === 'deleted') return $state.go('org.detail.lobby');
                                $state.go('org.detail.lobby'); //go to list of schedules page
                            }
                        }
                        else {
                            SSFAlertsService.showAlert('Error', 'Something went wrong with updating your schedule.');
                        }
                    });
            };
        }
    ]);