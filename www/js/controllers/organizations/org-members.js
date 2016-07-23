angular.module('starter.controllers')
  .controller('OrgMembersCtrl', ['$scope', '$rootScope', 'SSFAlertsService',
    'MembersRest', '$state', '$window', '$stateParams', '$ionicActionSheet',
    'OrganizationsRest', 'SSFMailService', '$ionicHistory', '$filter',
    '$timeout',
    function($scope, $rootScope, SSFAlertsService, MembersRest, $state,
      $window, $stateParams, $ionicActionSheet, OrganizationsRest, SSFMailService,
      $ionicHistory, $filter, $timeout) {

      $scope.showHome = false;
      $scope.members = [];
      $scope.search = {};
      $scope.$on('$ionicView.enter', function() {
        $scope.doRefresh();
      });
      $scope.doRefresh = function(a) {
        $scope.showHome = !$ionicHistory.backTitle() ? true : false;
        reloadPage();
        MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, '', $window.localStorage.userId)
          .then(function(res) {
            if (!res.data[0]) {
              $scope.canEdit = false;
              SSFAlertsService.showAlert('Warning', 'You do not have permission to view this page. You will be redirected to the main lobby.');
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $state.go('app.lobby');
              return;
            }
            $scope.canEdit = res.data[0].status === 'admin' || res.data[0].status === 'owner';
            if (!$scope.canEdit) {
              SSFAlertsService.showAlert('Warning', 'You do not have permission to view this page. You will be redirected to the main lobby.');
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $state.go('app.lobby');
            }
          }, function(err) {
          });
        if (a) {
          $timeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
          }, '1500');
        }
      };

      function reloadPage() {
        $rootScope.stopSpinner = true;
        MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId)
          .then(function(res) {
            if (res.status !== 200)
              return SSFAlertsService.showAlert('Error', 'Something went wrong when getting the users for your company.');
            //TODO: re-order the response
            // res.data.sort(function(a, b) {
            //   console.log(a.status + ' ' + b.status);
            //   if(a.status === b.status) {
            //     return 0;
            //   } else if(b.status === 'owner') {
            //     return 1;
            //   } else if(b.status === 'owner') {
            //     return -1;
            //   } else if(a.status === 'admin') {
            //     return 1;
            //   } else if(b.status === 'admin') {
            //     return -1;
            //   } else if(a.status === 'member') {
            //     return 1;
            //   } else if(b.status === 'member') {
            //     return -1;
            //   } else if(a.status === 'suspended') {
            //     return 1;
            //   } else if(b.status === 'suspended') {
            //     return -1;
            //   } else if(a.status === 'pending') {
            //     return 1;
            //   } else if(b.status === 'pending') {
            //     return -1;
            //   } else if(a.status === 'declined') {
            //     return 1;
            //   } else if(b.status === 'declined') {
            //     return -1;
            //   } else {
            //     return 0;
            //   }
            // });
            $scope.members = res.data;
          }, function(err) {
            SSFAlertsService.showAlert('Error', 'Something went wrong when getting the users for your company.');
          });
      }

      $scope.goHome = function() {
        delete $window.localStorage.orgId;
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.lobby');
      };
      //manages the switch between viewing requests and current members
      $scope.isRequests = false;
      $scope.toggleView = function(a) {
        return $scope.isRequests = a == 'is';
      };
      $scope.filterFunc = function(a) {
        return $scope.isRequests ? (a.status === 'pending') : (a.status !== 'pending' && a.status !== 'declined');
      };

      $scope.openMember = function() {
        $state.go('app.user');
      };

      //action sheet that lets the manager change roles of members
      var options = {
        owner: {
          buttons: [{
            text: 'Email Owner'
          }, {
            text: 'Text Owner'
          }, {
            text: 'Call Owner'
          }],
          funcs: [
            function(a) {
              SSFMailService.sendMail('Sent From the Scheduling App', '', a.email);
            },
            function(a) {
              if (!a.cellphone)
                return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
              $window.open('sms:' + a.cellphone);
            },
            function(a) {
              if (!a.cellphone)
                return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
              $window.open('tel:' + a.cellphone);
            }
          ]
        },
        admin: {
          buttons: [{
            text: 'Set Member'
          }, {
            text: 'Set Suspended'
          }, {
            text: 'Set Declined'
          }, {
            text: 'Email Admin'
          }, {
            text: 'Text Admin'
          }, {
            text: 'Call Admin'
          }],
          funcs: [
            function(a) {
              if ($window.localStorage.userId === a.memberId)
                return SSFAlertsService.showAlert('Error', 'You cannot demote yourself within a company.');
              makeRequest(a, a.id, 'member');
            },
            function(a) {
              if ($window.localStorage.userId === a.memberId)
                return SSFAlertsService.showAlert('Error', 'You cannot demote yourself within a company.');
              makeRequest(a, a.id, 'suspended');
            },
            function(a) {
              if ($window.localStorage.userId === a.memberId)
                return SSFAlertsService.showAlert('Error', 'You cannot demote yourself within a company.');
              makeRequest(a, a.id, 'declined');
            },
            function(a) {
              SSFMailService.sendMail('Sent From the Scheduling App', '', a.email);
            },
            function(a) {
              if (!a.cellphone)
                return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
              $window.open('sms:' + a.cellphone);
            },
            function(a) {
              if (!a.cellphone)
                return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
              $window.open('tel:' + a.cellphone);
            }
          ]
        },
        member: {
          buttons: [{
            text: 'Set Admin'
          }, {
            text: 'Set Pending'
          }, {
            text: 'Set Suspended'
          }, {
            text: 'Email Member'
          }, {
            text: 'Text Member'
          }, {
            text: 'Call Member'
          }],
          funcs: [
            function(a) {
              makeRequest(a, a.id, 'admin');
            },
            function(a) {
              makeRequest(a, a.id, 'pending');
            },
            function(a) {
              makeRequest(a, a.id, 'suspended');
            },
            function(a) {
              SSFMailService.sendMail('Sent From the Scheduling App', '', a.email);
            },
            function(a) {
              if (!a.cellphone)
                return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
              $window.open('sms:' + a.cellphone);
            },
            function(a) {
              if (!a.cellphone)
                return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
              $window.open('tel:' + a.cellphone);
            }
          ]
        },
        pending: {
          buttons: [{
            text: 'Set Admin'
          }, {
            text: 'Set Member'
          }, {
            text: 'Set Declined'
          }, {
            text: 'Email Applicant'
          }, {
            text: 'Text Applicant'
          }, {
            text: 'Call Applicant'
          }],
          funcs: [
            function(a) {
              makeRequest(a, a.id, 'admin');
            },
            function(a) {
              makeRequest(a, a.id, 'member');
            },
            function(a) {
              makeRequest(a, a.id, 'declined');
            },
            function(a) {
              SSFMailService.sendMail('Sent From the Scheduling App', '', a.email);
            },
            function(a) {
              if (!a.cellphone)
                return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
              $window.open('sms:' + a.cellphone);
            },
            function(a) {
              if (!a.cellphone)
                return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
              $window.open('tel:' + a.cellphone);
            }
          ]
        },
        suspended: {
          buttons: [{
            text: 'Set Admin'
          }, {
            text: 'Set Member'
          }, {
            text: 'Set Pending'
          }, {
            text: 'Set Declined'
          }, {
            text: 'Email Suspended User'
          }, {
            text: 'Text Suspended User'
          }, {
            text: 'Call Suspended User'
          }],
          funcs: [
            function(a) {
              makeRequest(a, a.id, 'admin');
            },
            function(a) {
              makeRequest(a, a.id, 'member');
            },
            function(a) {
              makeRequest(a, a.id, 'pending');
            },
            function(a) {
              makeRequest(a, a.id, 'declined');
            },
            function(a) {
              SSFMailService.sendMail('Sent From the Scheduling App', '', a.email);
            },
            function(a) {
              if (!a.cellphone)
                return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
              $window.open('sms:' + a.cellphone);
            },
            function(a) {
              if (!a.cellphone)
                return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
              $window.open('tel:' + a.cellphone);
            }
          ]
        }
      };

      function makeRequest(a, id, status) {
        OrganizationsRest.handleRequest($window.localStorage.token, id, status)
          .then(function(res) {
            if (res.status !== 200)
              return SSFAlertsService.showAlert('Error', 'Something went wrong in updating ' + a.firstName + ' ' + a.lastName + "'s status.");
            a.status = status;
          }, function(err) {
            return SSFAlertsService.showAlert('Error', 'Something went wrong in updating ' + a.firstName + ' ' + a.lastName + "'s status.");
          });
      }

      $scope.selectMember = function(a) {
        var hideSheet = $ionicActionSheet.show({
          buttons: options[a.status].buttons,
          // destructiveText: 'Delete',
          titleText: 'Modify/Contact: ' + a.firstName + " " + a.lastName + (a.nickName ? ' (' + a.nickName + ')' : '') + '<br>' + $filter('tel')(a.cellphone) + '<br>' + a.email,
          cancelText: 'Cancel',
          cancel: function() {
            // add cancel code..
          },
          buttonClicked: function(index) {
            options[a.status].funcs[index](a);
            return true;
          }
        });

      };

      $scope.resetSearch = function() {
        $scope.search = {};
      };

    }
  ]);