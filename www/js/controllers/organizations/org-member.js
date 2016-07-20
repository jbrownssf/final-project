angular.module('starter.controllers')
  .controller('OrgMemberCtrl', ['$scope', '$rootScope', 'SSFAlertsService',
      'MembersRest', '$window', '$stateParams',
      function($scope, $rootScope, SSFAlertsService, MembersRest, $window,
      $stateParams) {

    $scope.member = {};
    console.log('hit OrgMemberCtrl');
    $scope.$on('$ionicView.enter', function() {
      $rootScope.stopSpinner = true;
      MembersRest.getByCompany($window.localStorage.token, $stateParams.orgId, 'accepted', $stateParams.memberId)
      .then(function(res) {
        if(res.status !== 200)
          return SSFAlertsService.showAlert('Error', 'Something went wrong when getting the users for your company.');
        $scope.member = res.data[0];
        console.log(res.data[0]);
      }, function(err) {
        SSFAlertsService.showAlert('Error', 'Something went wrong when getting the users for your company.');
      });
    });

  }]);