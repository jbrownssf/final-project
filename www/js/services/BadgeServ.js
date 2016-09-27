angular.module('starter.services')
.service('BadgeServ', ['SSFUsersREST', '$window', '$timeout', '$rootScope',
    function(SSFUsersREST, $window, $timeout, $rootScope) {
  var BadgeServ = this;
  
  BadgeServ.badges = {};
  
  var hadIssues = 0;
  function clock() {
    $timeout(function() {
      if($window.localStorage.token)
        BadgeServ.updateCount()
        .then(function(res) {
          if(res.status === 200) {
            hadIssues = 200;
          } else {
            if(hadIssues < 6) ++hadIssues;
          }
        });
      clock();
    }, 5000 + (hadIssues * 10000));
  }
  clock();
  
  BadgeServ.updateCount = function() {
    $rootScope.stopSpinner = true;
    return SSFUsersREST.getBadgeCount($window.localStorage.token)
    .then(function(res) {
      if(res.status === 200)
        $rootScope.badges = res.data;
      return res;
    });
  };
  
  BadgeServ.remove = function() {
    $rootScope.badges = {};
    hadIssues = 0;
  };
  
}]);