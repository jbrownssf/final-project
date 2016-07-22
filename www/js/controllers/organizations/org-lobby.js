angular.module('starter.controllers')
  .controller('OrgLobbyCtrl', ['$scope', '$window', '$stateParams', 'SchedulesREST',
    'SSFAlertsService', 'SchedulesService', '$state', '$ionicListDelegate',
    '$rootScope', '$ionicActionSheet', 'OrganizationsRest', 'MembersRest',
    '$ionicHistory',
    function($scope, $window, $stateParams, SchedulesREST, SSFAlertsService,
      SchedulesService, $state, $ionicListDelegate, $rootScope, $ionicActionSheet,
      OrganizationsRest, MembersRest, $ionicHistory) {

      $scope.openOrganizations = [];
      $scope.canEdit = false;
      $scope.listCanSwipe = false;
      $scope.currentView = 1;
      $scope.$on('$ionicView.enter', function() {
        $scope.currentView = 1;
        $rootScope.stopSpinner = true;
        makeRequest();
        MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, '', $window.localStorage.userId)
          .then(function(res) {
            if (res.status !== 200) return;
            if (!res.data[0]) {
              SSFAlertsService.showConfirm('Error', 'You are not already a member of this company. Would you like to request to join the company?', 'Yes', 'No')
              .then(function(bool) {
                if(bool) {
                  if($scope.openOrganizations.status !== 'open') {
                    SSFAlertsService.showAlert('Sorry', 'This company is not accepting new members at this time.');
                    $ionicHistory.nextViewOptions({
                      disableBack: true
                    });
                    return $state.go('app.lobby');
                  }
                  SSFAlertsService.showPrompt('Create Nick Name', 'What would you like your new nick name to be?', 'Apply', undefined, undefined, 'Nick Name')
                  .then(function(res) {
                    if(!res) {
                      $ionicHistory.nextViewOptions({
                        disableBack: true
                      });
                      $state.go('app.lobby');
                    }
                    console.log(res);
                    console.log($scope.openOrganizations);
                    $ionicHistory.nextViewOptions({
                      disableBack: true
                    });
                    $state.go('app.lobby');
                  });
                } else {
                  $ionicHistory.nextViewOptions({
                    disableBack: true
                  });
                  $state.go('app.lobby');
                }
              });
              res.data[0] = {
                status: 'pending'
              };
            }
            $scope.canEdit = res.data[0].status === 'admin' || res.data[0].status === 'owner';
            $scope.listCanSwipe = $scope.canEdit;
            if(!$scope.canEdit) $scope.currentView = 1;
          }, function(err) {

          });

        //get company info
        $rootScope.stopSpinner = true;
        OrganizationsRest.open($window.localStorage.token, $stateParams.orgId)
          .then(function(res) {
            if(res.status !== 200) return;
            $scope.openOrganizations = res.data[0];
          }, function(err) {

          });
      });
      $scope.setView = function(a) {
        $scope.currentView = a;
      };
      $scope.schedules = [];
      $scope.title = 'Welcome!'; //$stateParams.org.orgName;
      function makeRequest() {
        SchedulesREST.getList($window.localStorage.token, $window.localStorage.userId, $stateParams.orgId)
          .then(function(res) {
            if (res.status !== 200)
              return SSFAlertsService.showAlert('Error', 'Something went wrong in getting the schedules.');
            $scope.schedules = res.data;
          }, function(err) {
            SSFAlertsService.showAlert('Error', 'Something went wrong in gettting the schedules.');
          });
      }

      //switch between published/unpublished options
      $scope.edit = [];
      $scope.editSection = function(a) {
        if (a !== undefined)
          $scope.edit[a] ^= true;
        return $scope.edit[a];
      };

      $scope.gotoSched = function(selectedSched) {
        SchedulesService.singleSched(selectedSched);
        $state.go('app.org.detail.sched-view.detail', {
          schedId: selectedSched.id
        });
      };

      $scope.newSchedule = function() {
        var tempObj = {
          note: '',
          // createDate: new Date(),
          state: '',
          groupId: '',
          schedule: [
            [
              '', []
            ]
          ]
        };
        SchedulesService.template(tempObj);
        $state.go('app.org.detail.sched-create');
      };
      $scope.clone = function(schedule) {
        var tempSchedule = {};
        for (var i in schedule) {
          if (i !== 'id' && i !== 'state')
            tempSchedule[i] = JSON.parse(JSON.stringify(schedule[i]));
        }
        for (var j in tempSchedule.schedule) {
          for (var k in tempSchedule.schedule[j][1]) {
            tempSchedule.schedule[j][1][k][1] = new Date(tempSchedule.schedule[j][1][k][1]);
            tempSchedule.schedule[j][1][k][2] = new Date(tempSchedule.schedule[j][1][k][2]);
          }
        }
        tempSchedule.assignedDate = new Date(tempSchedule.assignedDate);
        SchedulesService.template(tempSchedule);
        $ionicListDelegate.closeOptionButtons();
        $state.go('app.org.detail.sched-create');
      };
      $scope.delete = function(schedule, index) {
        schedule.state = 'deleted';
        SchedulesREST.upsert($window.localStorage.token, schedule);
        $ionicListDelegate.closeOptionButtons();
        for (var i in $scope.schedules) {
          if ($scope.schedules[i].id === schedule.id) {
            console.log(i + " " + index);
            $scope.schedules.splice(i, 1);
            break;
          }
        }
        //update
      };
      $scope.publish = function(schedule) {
        schedule.state = schedule.state === 'published' ? 'saved' : 'published';
        SchedulesREST.upsert($window.localStorage.token, schedule);
        $ionicListDelegate.closeOptionButtons();
      };

      function selectOrg(err, org) {
        if (err) return;
        SSFAlertsService.showConfirm('Are You Sure?', 'You have selected to join "' + org.name + '". Would you like to continue with sending the request?')
          .then(function(res) {
            if (!res) return;
            OrganizationsRest.request($window.localStorage.token, {
                organizationId: org.id,
                userId: $window.localStorage.userId
              })
              .then(function(res) {
                if (res.status === 503)
                  return SSFAlertsService.showAlert('Error', res.data.error.message);
                if (res.status !== 200)
                  return SSFAlertsService.showAlert('Error', 'There was a problem requesting to join this selected company.');
                // $ionicHistory.nextViewOptions({
                //   disableBack: true
                // });
                // $state.go('app.lobby');
              }, function(err) {
                SSFAlertsService('Error', 'Some unknown error occured. Please try again later.');
              });
          });
      }

      $scope.openMembers = function() {
        $state.go('app.org.detail.members');
      };
      $scope.openMember = function() {
        $state.go('app.user');
      };
      $scope.goHome = function() {
        delete $window.localStorage.orgId;
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.lobby');
      };
    }
  ]);