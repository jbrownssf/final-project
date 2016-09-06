/*  Remove sensitive data on logout
Instructions:
1.  Inject 'SSFLogout' into the app.js file.
2.  Place '<script src="js/SSFServices/SSFLogout.js"></script>' into the index.html
            file above the app.js
3.	Remember to broadcast 'request:auth' when you want this listener to be called by using this:
            $rootScope.$broadcast('request:auth');

What it does:
  Routes unregistered/registered users to landing/lobby respectively on refresh.
  Logs a user out.
*/


angular.module('SSFLogout', [])
.run(["$rootScope", "$ionicHistory", "$state", "$window", 'SSFCacheService',
    'SSFFavoritesService', '$ionicPlatform', 'SSFUsersREST', 'BadgeServ',
    function($rootScope, $ionicHistory, $state, $window, SSFCacheService,
    SSFFavoritesService, $ionicPlatform, SSFUsersREST, BadgeServ) {
  $ionicPlatform.ready(function() {
    $rootScope.$on('request:auth', function() {
      $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
      });
      if($window.localStorage.token) SSFUsersREST.logout($window.localStorage.token);
      delete $window.localStorage['token'];
      delete $window.localStorage['userId'];
      delete $window.localStorage['progress'];
      delete $window.localStorage['orgId'];
      SSFCacheService.clearData();
      BadgeServ.remove();
      SSFFavoritesService.removeFavorites();
      $state.go('app.landing');
    });  
    if($window.localStorage.token !== undefined) {
      // $ionicHistory.nextViewOptions({
      //   historyRoot: true,
      //   disableBack: true
      // });
      // $state.go('app.lobby');
    }
    else {
      $rootScope.$broadcast('request:auth');
    }
  });
}]);