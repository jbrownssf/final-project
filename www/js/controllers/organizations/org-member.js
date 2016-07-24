angular.module('starter.controllers')
  .controller('OrgMemberCtrl', ['$scope', '$rootScope', 'SSFAlertsService',
    'MembersRest', '$window', '$stateParams', 'SSFUsersREST',
    'OrganizationsRest', '$ionicHistory', '$state', '$ionicModal',
    '$timeout',
    function($scope, $rootScope, SSFAlertsService, MembersRest, $window,
      $stateParams, SSFUsersREST, OrganizationsRest, $ionicHistory,
      $state, $ionicModal, $timeout) {

      $scope.showHome = false;
      $scope.user = {};
      $scope.lobbySelect = {};
      $scope.currentView = 1;

      $scope.$on('$ionicView.enter', function() {
        $scope.doRefresh();
      });
      $scope.doRefresh = function(a) {
        $scope.updateUser = {};
        $scope.repeat = {};
        $scope.showHome = !$ionicHistory.backTitle() ? true : false;
        $rootScope.stopSpinner = true;
        SSFUsersREST.getById($window.localStorage.token, $window.localStorage.userId)
          .then(function(res) {
            if (res.status !== 200)
              return SSFAlertsService.showAlert('Error', 'Something went wrong when getting the user information.');
            $scope.user = res.data;
          }, function(err) {
            SSFAlertsService.showAlert('Error', 'Something went wrong when getting the user information.');
          });
        $rootScope.stopSpinner = true;
        MembersRest.getCurrentOrgs($window.localStorage.token, $window.localStorage.userId)
          .then(function(res) {
            if (res.status !== 200)
              return SSFAlertsService.showAlert("Error", "There was a problem loading your page.");
            $scope.lobbySelect.data = res.data;
          }, function(err) {
            SSFAlertsService.showAlert("Error", "Some unknown error occured, please try again.");
          });
        $rootScope.stopSpinner = true;
        OrganizationsRest.open($window.localStorage.token)
          .then(function(res) {
            $scope.openOrganizations = res.data;
          }, function(err) {

          });
        if (a) {
          $timeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
          }, '1500');
        }

      };

      $scope.submitProfile = function(form) {
        if (!form.$dirty) return;
        if ($scope.user.cellphone)
          if ($scope.user.cellphone.length !== 10 && $scope.user.cellphone.length !== 0)
            return SSFAlertsService.showAlert("Error", "Your cellphone number has to be 10 numbers long or not at all.");
        if (form.$invalid)
          return SSFAlertsService.showAlert('Error', 'Please fill in all of the fields completely.');
        SSFAlertsService.showPrompt('Password Check', 'Enter your password', undefined, undefined, 'password', 'Your Password')
          .then(function(res) {
            if (!res || res === "") return SSFAlertsService.showAlert('Error', 'User information was not updated since no password was entered.');
            $scope.user.password = res;
            return submitRequest();
          });
      };

      function submitRequest() {
        SSFUsersREST.update($window.localStorage.token, $window.localStorage.userId, $scope.user)
          .then(function(res) {
            if (res.status !== 200)
              return SSFAlertsService.showAlert('Error', 'Something went wrong with updating your account.');
          }, function(err) {
            if (err.status !== 200)
              return SSFAlertsService.showAlert('Error', 'Something went wrong with updating your account.');
          });
      }

      $scope.changeNickName = function(org) {
        var promptBody = org.nickName ? 'Your current nick name is "' + org.nickName + '". ' : '';
        SSFAlertsService.showPrompt('Update Nick Name', promptBody + 'What would you like your new nick name to be?', 'Update', undefined, undefined, 'New Nick Name')
          .then(function(res) {
            if (!res && res !== '') return;
            OrganizationsRest.request($window.localStorage.token, {
                organizationId: org.orgId,
                userId: $window.localStorage.userId,
                nickName: res
              })
              .then(function(res) {
                if (res.status === 503)
                  return SSFAlertsService.showAlert('Error', res.data.error.message);
                if (res.status !== 200)
                  return SSFAlertsService.showAlert('Error', 'There was a problem requesting to join this selected company.');
                org.nickName = res.data.nickName;
              }, function(err) {
                SSFAlertsService('Error', 'Some unknown error occured. Please try again later.');
              });
          });
      };
      $scope.selectOrgModal = function() {
        var template =
          '<div class="list">' +
          '<ion-item ng-if="openOrganizations.length === 0" class="item">' +
          'No Companies to Select From' +
          '</ion-item>' +
          '<ion-item ng-if="openOrganizations.length !== 0" class="item" ng-click="closeEmployerPopover(org)" ng-repeat="org in openOrganizations">' +
          '{{org.name}}' +
          '</ion-item>' +
          '</div>';
        SSFAlertsService.showModal({
          body: template,
          scope: $scope,
          title: "Request to Join"
        }, selectOrg);
      };

      function selectOrg(err, org) {
        if (err) return;
        SSFAlertsService.showPrompt('Are You Sure?', 'By accepting, you agree to share your contact information with "' + org.name + '". The following field is for a nickname.', 'Accept')
          .then(function(res) {
            if (!res || res === "") return;
            OrganizationsRest.request($window.localStorage.token, {
                organizationId: org.id,
                userId: $window.localStorage.userId,
                nickName: res
              })
              .then(function(res) {
                if (res.status === 503)
                  return SSFAlertsService.showAlert('Error', res.data.error.message);
                if (res.status !== 200)
                  return SSFAlertsService.showAlert('Error', 'There was a problem requesting to join this selected company.');
              }, function(err) {
                SSFAlertsService('Error', 'Some unknown error occured. Please try again later.');
              });
          });
      }

      $scope.changePassword = function() {
        SSFAlertsService.showAlert('Comming Soon...', 'This feature will be added shortly.');
      };
      $scope.goHome = function() {
        delete $window.localStorage.orgId;
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.lobby');
      };




      //password reset code
      $scope.updateUser = {};
      $scope.repeat = {};
      $scope.submitPassword = function(form) {
        if (form.newPass.$invalid)
          return SSFAlertsService.showAlert("Error", "Your password must be at least 8 characters long and contain one of each of the following: An upper and lower case letter, a number, and a special character which include, but are not limited to: ! @ # $");
        if (form.$invalid)
          return SSFAlertsService.showAlert('Error', 'Please fill in all required fields.');
        if ($scope.updateUser.password !== $scope.repeat.password)
          return SSFAlertsService.showAlert('Error', 'Please make sure your passwords match.');
        // $scope.updateUser.userId = $window.localStorage.userId;
        SSFUsersREST.update($window.localStorage.token, $window.localStorage.userId, $scope.updateUser)
          .then(function(res) {
            if (res.status !== 200)
              return SSFAlertsService.showAlert('Update Failed', res.data.error.message === 'login failed' ? 'We could not varify your password.' : res.data.error.message);
            SSFAlertsService.showAlert('Success!', 'Your password has successfully been updated.');
            $scope.updateUser = {};
            $scope.repeat = {};
          }, function(err) {
            if (err.data !== undefined)
              return SSFAlertsService.showAlert('Error', 'Check your connectin to the internet and try again.');
            SSFAlertsService.showAlert('Error', 'Something went wrong.');
          });
      };
      $scope.openPasswordModal = function() {
        showModal({
          title: 'Update Password',
          scope: $scope
        }, function(err, res) {
          if (err) return;
          //successful
        });
      };

      function showModal(parameters, callback) {
        $ionicModal.fromTemplateUrl('templates/forms/changepass.html', {
          scope: parameters.scope,
          animation: 'slide-in-up',
          backdropClickToClose: false
        }).then(function(modal) {
          parameters.scope.chooseEmployer = modal;
          parameters.scope.chooseEmployer.show();
        });
        parameters.scope.closeEmployerPopover = function(a) {
          parameters.scope.chooseEmployer.remove();
          callback(0, a);
        };
        parameters.scope.closeModal = function() {
          parameters.scope.chooseEmployer.remove();
          callback('User closed modal');
        };
      }
    }
  ]);