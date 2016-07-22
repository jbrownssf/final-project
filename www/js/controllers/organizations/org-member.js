angular.module('starter.controllers')
  .controller('OrgMemberCtrl', ['$scope', '$rootScope', 'SSFAlertsService',
    'MembersRest', '$window', '$stateParams', 'SSFUsersREST',
    function($scope, $rootScope, SSFAlertsService, MembersRest, $window,
      $stateParams, SSFUsersREST) {

      $scope.member = {};
      $scope.user = {};

      $scope.$on('$ionicView.enter', function() {
        $rootScope.stopSpinner = true;
        MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, 'accepted', $stateParams.memberId)
          .then(function(res) {
            if (res.status !== 200)
              return SSFAlertsService.showAlert('Error', 'Something went wrong when getting the users for your company.');
            $scope.member = res.data[0];
            $scope.user.firstName = JSON.parse(JSON.stringify($scope.member.firstName));
            $scope.user.lastName = JSON.parse(JSON.stringify($scope.member.lastName));
            $scope.user.cellphone = JSON.parse(JSON.stringify($scope.member.cellphone));
            $scope.user.email = JSON.parse(JSON.stringify($scope.member.email));
          }, function(err) {
            SSFAlertsService.showAlert('Error', 'Something went wrong when getting the users for your company.');
          });
      });

      $scope.submitProfile = function(form) {
        if (!form.$dirty) return;
        if ($scope.user.cellphone)
          if ($scope.user.cellphone.length !== 10 && $scope.user.cellphone.length !== 0)
            return SSFAlertsService.showAlert("Error", "Your cellphone number has to be 10 numbers long or not at all.");
        if (form.$invalid)
          return SSFAlertsService.showAlert('Error', 'Please fill in all of the fields completely.');
        SSFAlertsService.showPrompt('Password Check', 'Enter your password', undefined, undefined, 'password', 'Your Password')
        .then(function(res) {
          if (!res && res !== "") return SSFAlertsService.showAlert('Error', 'User information was not updated since no password was entered.');
            $scope.user.password = res;
            return submitRequest();
        });
      };
      function submitRequest() {
        SSFUsersREST.update($window.localStorage.token, $window.localStorage.userId, $scope.user)
        .then(function(res) {
          if(res.status !== 200)
            return SSFAlertsService.showAlert('Error', 'Something went wrong with updating your account.');
        }, function(err) {
          if(err.status !== 200)
            return SSFAlertsService.showAlert('Error', 'Something went wrong with updating your account.');
        });
      }

    }
  ]);