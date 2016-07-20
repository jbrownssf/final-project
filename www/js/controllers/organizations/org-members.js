angular.module('starter.controllers')
  .controller('OrgMembersCtrl', ['$scope', '$rootScope', 'SSFAlertsService',
    'MembersRest', '$state', '$window', '$stateParams', '$ionicActionSheet',
    'OrganizationsRest', 'SSFMailService',
    function($scope, $rootScope, SSFAlertsService, MembersRest, $state,
      $window, $stateParams, $ionicActionSheet, OrganizationsRest, SSFMailService) {

      $scope.members = [];
      $scope.$on('$ionicView.enter', function() {
        reloadPage();
      });

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

      // $scope.selectMember = function(member) {
      //   $state.go('org.detail.member.detail', {
      //     memberId: member.memberId
      //   });
      // };



      //manages the switch between viewing requests and current members
      $scope.isRequests = false;
      $scope.toggleView = function(a) {
        return $scope.isRequests = a == 'is';
      };
      $scope.filterFunc = function(a) {
        return $scope.isRequests ? (a.status === 'pending') : (a.status !== 'pending' && a.status !== 'declined');
      };



      //action sheet that lets the manager change roles of members
      var options = {
        owner: {
          buttons: [{
            text: 'Email Owner'
          }],
          funcs: [
            function(a) {
              SSFMailService.sendMail('Sent From the Scheduling App', '', a.email);
            }
          ]
        },
        admin: {
          buttons: [{
            text: 'Set Member'
          },{
            text: 'Set Suspended'
          },{
            text: 'Set Declined'
          },{
            text: 'Email Admin'
          }],
          funcs: [
            function(a) {
              makeRequest(a, a.id, 'member');
            },
            function(a) {
              makeRequest(a, a.id, 'suspended');
            },
            function(a) {
              makeRequest(a, a.id, 'declined');
            },
            function(a) {
              SSFMailService.sendMail('Sent From the Scheduling App', '', a.email);
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
            }
          ]
        },
        pending: {
          buttons: [{
            text: 'Set Admin'
          },{
            text: 'Set Member'
          },{
            text: 'Set Declined'
          }, {
            text: 'Email Applicant'
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
            }
          ]
        },
        suspended: {
          buttons: [{
            text: 'Set Admin'
          },{
            text: 'Set Member'
          },{
            text: 'Set Pending'
          },{
            text: 'Set Declined'
          }, {
            text: 'Email Suspended User'
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
          titleText: 'Modify ' + a.firstName + " " + a.lastName,
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

    }
  ]);