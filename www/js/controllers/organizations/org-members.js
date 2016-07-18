angular.module('starter.controllers')
  .controller('OrgMembersCtrl', ['$scope', '$rootScope', 'SSFAlertsService', 'MembersRest',
      function($scope, $rootScope, SSFAlertsService, MembersRest) {

    $scope.members = [];
    $scope.$on('$ionicView.enter', function() {
      $rootScope.stopSpinner = true;
      MembersRest.getByCompany()
      .then(function(res) {
        if(res.status !== 200)
          return SSFAlertsService.showAlert('Error', 'Something went wrong when getting the users for your company.');
        $scope.members = res.data;
      }, function(err) {
        SSFAlertsService.showAlert('Error', 'Something went wrong when getting the users for your company.');
      });
    });

  }]);