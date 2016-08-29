angular.module('starter.services')
.service('BadgeServ', ['SSFUsersREST', '$window',
    function(SSFUsersREST, $window) {
  var BadgeServ = this,
  badgeCounts; //object of firm ids with the count of pending users
  
  function setCount() {
    return SSFUsersREST.getBadgeCount($window.localStorage.token)
    .then(function(res) {
      if(res.status === 200)
        badgeCounts = res.data;
      return badgeCounts;
    });
  }
  
  BadgeServ.getByOrg = function(orgId) {
    return badgeCounts[orgId];
  };
  
  BadgeServ.getAll = function() {
    return setCount();
  };
  
  BadgeServ.remove = function() {
    badgeCounts = undefined;
  };
  
}]);