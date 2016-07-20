angular.module('starter.controllers')
  .controller('OrgLobbyCtrl', ['$scope', '$window', '$stateParams', 'SchedulesREST',
    'SSFAlertsService', 'SchedulesService', '$state', '$ionicListDelegate',
    '$rootScope', '$ionicActionSheet', 'OrganizationsRest', 'MembersRest',
    function($scope, $window, $stateParams, SchedulesREST, SSFAlertsService,
      SchedulesService, $state, $ionicListDelegate, $rootScope, $ionicActionSheet,
      OrganizationsRest, MembersRest) {

      $scope.openOrganizations = [];
      $scope.canEdit = false;
      
      $scope.$on('$ionicView.enter', function() {
        $rootScope.stopSpinner = true;
        makeRequest();
        MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, '', $window.localStorage.userId)
        .then(function(res) {
          if(res.status !== 200) return;
          $scope.canEdit = res.data.status === 'admin' || res.data.status === 'owner';
        }, function(err) {
          
        });
      });

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
        $state.go('org.detail.sched-view.detail', {
          schedId: selectedSched.id
        });
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
              '', []
            ]
          ]
        };
        SchedulesService.template(tempObj);
        $state.go('org.detail.sched-create');
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
        $state.go('org.detail.sched-create');
      };
      $scope.delete = function(schedule, index) {
        schedule.state = 'deleted';
        SchedulesREST.upsert($window.localStorage.token, schedule);
        $ionicListDelegate.closeOptionButtons();
        $scope.schedules.splice(index, 1);
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
                // $state.go('lobby');
              }, function(err) {
                SSFAlertsService('Error', 'Some unknown error occured. Please try again later.');
              });
          });
      }

      $scope.openMembers = function() {
        $state.go('org.detail.members');
      };
      // $scope.openMembers = function() {
      //   var template =
      //     // '<form name="OrganizationForm" class="padding" ng-submit="submitForm(OrganizationForm)">' +
      //     // '<label class="item item-input">' +
      //     //     '<input name="orgCode" ng-model="ngModel.orgCode" type="text" placeholder="Type Code">' +
      //     // '</label>' +
      //     // '<button type="submit" class="button button-block button-calm ssf-button">' +
      //     //     'submit' +
      //     // '</button>' +
      //     '<div class="list">' +
      //     '<ion-item class="item" ng-click="closeEmployerPopover(org)" ng-repeat="org in openOrganizations">' +
      //     '{{org.name}}' +
      //     '</ion-item>' +
      //     '</div>';
      //   SSFAlertsService.showModal({
      //     body: template,
      //     scope: $scope,
      //     title: "Request to Join"
      //   }, selectOrg);
      // };
    }
  ]);