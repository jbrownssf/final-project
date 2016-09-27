angular.module('starter.controllers')
    .controller('SchedCreateCtrl', ['$scope', 'FillSpotService', '$state',
        'SchedulesREST', '$window', 'SSFAlertsService', 'SchedulesService', '$rootScope',
        'SSFUsersREST', '$stateParams', 'MembersRest', '$ionicHistory', '$timeout',
        function($scope, FillSpotService, $state, SchedulesREST, $window,
            SSFAlertsService, SchedulesService, $rootScope, SSFUsersREST, $stateParams,
            MembersRest, $ionicHistory, $timeout) {


            $scope.showHome = false;
            $scope.users = {};
            $scope.schedule = [];
            $scope.canEdit = true;
            var errArr = [];
            
            $scope.$on('$ionicView.enter', function() {
                errArr = [];
                $scope.showHome = !$ionicHistory.backTitle() ? true : false;
                $rootScope.stopSpinner = true;
                $scope.schedule = SchedulesService.template();
                MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, "accepted")
                    .then(function(res) {
                        if (res.status !== 200)
                            return errArr[0] = res;
                        errArr[0] = 200;
                        for (var i in res.data) {
                            $scope.users[res.data[i].memberId] = res.data[i];
                        }
                    });
                MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, '', $window.localStorage.userId)
                    .then(function(res) {
                        if (res.status !== 200 || !res.data[0]) {
                            $scope.canEdit = false;
                            return errArr[1] = res;
                        }
                        $scope.canEdit = res.data[0].status === 'admin' || res.data[0].status === 'owner';
                        if (!$scope.canEdit) {
                            return errArr[1] = res;
                        }
                        errArr[1] = 200;
                        
                    }, function(err) {
                        errArr[1] = err;
                    });
                handleErrors();
            });
            
            
            function handleErrors() {
                $timeout(function() {
                    if(!errArr[0] || !errArr[1])
                        return handleErrors();
                    if(errArr[0] !== 200)
                        return SSFAlertsService.showAlert('Error', 'There was a problem loading your page. Please try again later.');
                    if(errArr[1] !== 200)
                        return SSFAlertsService.showAlert('Error', 'There was a problem retrieving open groups. Please try again later.');
                },  '100');
            }

            $scope.spotChangedResetView = function(a) {
                delete a[4];
            };

            $scope.addSection = function() {
                $scope.schedule.schedule.push([
                    '', []
                ]);
            };
            $scope.addSpot = function($event, array) {
                $scope.schedule.schedule[array[0]][1].push([]);
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
                    return SSFAlertsService.showAlert('Error', 'Please make sure all "Area" field names are filled in.');
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
                                if (res.data.state === 'deleted') {
                                    //stop back button
                                    $ionicHistory.nextViewOptions({
                                        disableBack: true
                                    });
                                    return $state.go('app.org.detail.lobby');
                                }
                                $state.go('app.org.detail.sched-view.detail', {
                                    schedId: res.data.id
                                });
                            }
                            else {
                                if (res.data.state === 'deleted') return $state.go('app.org.detail.lobby');
                                $state.go('app.org.detail.lobby'); //go to list of schedules page
                            }
                        }
                        else {
                            SSFAlertsService.showAlert('Error', 'Something went wrong with updating your schedule.');
                        }
                    });
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
            $scope.deleteSection = function(a) {
                SSFAlertsService.showConfirm('Warning', 'Are you sure you want to delete this spot? It cannot be undone.')
                    .then(function(res) {
                        if (res) {
                            $scope.schedule.schedule[a] = ['NaN', []];
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
                if(a == 'modal') return {bottom: 0 + 'px'};
                return {height: ($window.innerHeight - document.getElementById(a).getBoundingClientRect().top) + 'px'};
            };
            
            $scope.showWings = true;
            $scope.setSubHeaderGrid = function() {
                if(!$scope.showWings && $window.innerWidth >= 320) $scope.showWings = true;
                if($window.innerWidth > 572) return 'col-50';
                if($window.innerWidth > 440) return 'col-67';
                if($window.innerWidth > 374) return 'col-80';
                if($window.innerWidth > 330) return 'col-90';
                $scope.showWings = false;
            };
        }
    ]);