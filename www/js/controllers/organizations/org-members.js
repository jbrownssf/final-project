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
      var errArr = [];
      var userType;
      
      $scope.$on('$ionicView.enter', function() {
        $scope.doRefresh();
      });
      $scope.doRefresh = function(a) {
        errArr = [];
        $scope.showHome = !$ionicHistory.backTitle() ? true : false;
        MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, '', $window.localStorage.userId)
          .then(function(res) {
            if (res.status !== 200 || !res.data[0]) {
              $scope.canEdit = false;
              return errArr[0] = res;
            }
            errArr[0] = 200;
            $scope.canEdit = res.data[0].status === 'admin' || res.data[0].status === 'owner';
            userType = res.data[0].status;
            // if (!$scope.canEdit) {
            //   SSFAlertsService.showAlert('Warning', 'You do not have permission to view this page. You will be redirected to the main lobby.');
            //   $ionicHistory.nextViewOptions({
            //     disableBack: true
            //   });
            //   $state.go('app.lobby');
            // }
          }, function(err) {
            errArr[0] = err;
          });
        $rootScope.stopSpinner = true;
        MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId)
          .then(function(res) {
            if (res.status !== 200)
              return errArr[1] = res;
            errArr[1] = 200;
            //TODO: re-order the response
            $scope.members = res.data;
          }, function(err) {
            errArr[1] = err;
          });
        handleErrors(a);
      };
      
      
      
      function handleErrors(a) {
        $timeout(function() {
          if (!errArr[0] || !errArr[1])
            return handleErrors(a);
          if(a) $scope.$broadcast('scroll.refreshComplete');
          if (errArr[0] !== 200)
            return SSFAlertsService.showAlert('Error', 'There was a problem loading your information. Please try again later.');
          if (errArr[1] !== 200)
            return SSFAlertsService.showAlert('Error', 'There was a problem retrieving your current groups. Please try again later.');
        },  '100');
      }

      $scope.goHome = function() {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $window.localStorage.orgId ? $state.go('app.org.detail.lobby', {orgId: $window.localStorage.orgId}) : $state.go('app.lobby');
      };
      //manages the switch between viewing requests and current members
      $scope.isRequests = false;
      $scope.toggleView = function(a) {
        return $scope.isRequests = a == 'is';
      };
      $scope.filterFunc = function(a) {
        if($scope.whichOption == 0 && a.status === 'suspended') {
          return true;
        } else if($scope.whichOption == 1 && (a.status === 'member' || a.status === 'admin' ||  a.status === 'owner')) {
          return true;
        } else if($scope.whichOption == 2 && a.status === 'pending') {
          return true;
        }
        return false;
        // return $scope.isRequests ? (a.status === 'pending') : (a.status !== 'pending' && a.status !== 'declined');
      };

      $scope.openMember = function() {
        $state.go('app.user');
      };

      //action sheet that lets the manager change roles of members
      var options = {
        owner: {
          owner: {
            buttons: [],
            funcs: []
          },
          admin: {
            buttons: [{
              text: 'Set Member'
            }, {
              text: 'Set Suspended'
            // }, {
            //   text: 'Set Declined'
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
              }
            ]
          },
          member: {
            buttons: [{
              text: 'Set Admin'
            }, {
              text: 'Set Suspended'
            }],
            funcs: [
              function(a) {
                makeRequest(a, a.id, 'admin');
              },
              function(a) {
                makeRequest(a, a.id, 'suspended');
              }
            ]
          },
          pending: {
            buttons: [{
              text: 'Set Admin'
            }, {
              text: 'Set Member'
            // }, {
            //   text: 'Set Declined'
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
              }
            ]
          },
          suspended: {
            buttons: [{
              text: 'Set Admin'
            }, {
              text: 'Set Member'
            // }, {
            //   text: 'Set Declined'
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
              }
            ]
          }
        },
        admin: {
          owner: {
            buttons: [],
            funcs: []
          },
          admin: {
            buttons: [],
            funcs: []
          },
          member: {
            buttons: [{
              text: 'Set Suspended'
            }],
            funcs: [
              function(a) {
                makeRequest(a, a.id, 'suspended');
              }
            ]
          },
          pending: {
            buttons: [{
              text: 'Set Member'
            // }, {
            //   text: 'Set Declined'
            }],
            funcs: [
              function(a) {
                makeRequest(a, a.id, 'member');
              },
              function(a) {
                makeRequest(a, a.id, 'declined');
              }
            ]
          },
          suspended: {
            buttons: [{
              text: 'Set Member'
            // }, {
            //   text: 'Set Declined'
            }],
            funcs: [
              function(a) {
                makeRequest(a, a.id, 'member');
              },
              function(a) {
                makeRequest(a, a.id, 'declined');
              }
            ]
          }
        }
      };
      for(var j in options) {
        for(var i in options[j]) {
          options[j][i].buttons.push({
            text: 'Email User'
          });
          options[j][i].funcs.push(function(a) {
            SSFMailService.sendMail('Sent From the Scheduling App', '', a.email);
          });
          if(ionic.Platform.isWebView() || ionic.Platform.isIPad() || ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
            options[j][i].buttons.push({
              text: 'Text User'
            });
            options[j][i].funcs.push(function(a) {
              if (!a.cellphone)
                return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
              if(ionic.Platform.isWebView()) {
                cordova.InAppBrowser.open('sms:' + a.cellphone, '_blank', 'location=no,hardwareback=no');
              } else {
                $window.open('sms:' + a.cellphone);
              }
            });
            options[j][i].buttons.push({
              text: 'Call User'
            });
            options[j][i].funcs.push(function(a) {
              if (!a.cellphone)
                return SSFAlertsService.showAlert('Missing Information', 'The user has not registered a Cell Phone.');
              if(ionic.Platform.isWebView()) {
                cordova.InAppBrowser.open('tel:' + a.cellphone, '_blank', 'location=no,hardwareback=no');
              } else {
                $window.open('tel:' + a.cellphone);
              }
            });
          }
        }
      }
      
      
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
          buttons: options[userType][a.status].buttons,
          // destructiveText: 'Delete',
          titleText: 'Modify/Contact: ' + a.firstName + " " + a.lastName + (a.nickName ? ' (' + a.nickName + ')' : '') + '<br>' + $filter('tel')(a.cellphone) + '<br>' + a.email,
          cancelText: 'Cancel',
          cancel: function() {
            // add cancel code..
          },
          buttonClicked: function(index) {
            options[userType][a.status].funcs[index](a);
            return true;
          }
        });

      };

      $scope.resetSearch = function() {
        $scope.search = {};
      };

      $scope.customBackground = function(a) {
        return {height: ($window.innerHeight - document.getElementById(a).getBoundingClientRect().top) + 'px'};
      };
      
      $scope.whichOption = 1;
      $scope.setView = function(a) {
        $scope.whichOption = a;
      };
    }
  ]);