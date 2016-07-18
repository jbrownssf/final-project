// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ionic.service.core', 'starter.controllers', 'starter.services',
    'pascalprecht.translate', 'SSFConfig', 'SSFAlerts', 'SSFCache',
    'SSFConnectivity', 'SSFCss', 'SSFDirectives', 'SSFFavorites', 'SSFLogout',
    'SSFMailComposer', 'SSFSpinner', 'RESTServices'])

.run(["$ionicPlatform", '$window', '$ionicHistory', '$state', '$rootScope',
    function($ionicPlatform, $window, $ionicHistory, $state, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    // Ionic.io();
    // //Dispatch interval, how often do we want our events to be sent to analytics. Default is 30 sec
    // if($window.localStorage["userId"]) {
    //   $ionicAnalytics.setGlobalProperties({
    //     ZibID: $window.localStorage["userId"]
    //   });
    // }
  });
}])
.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('landing', {
    url: '/',
    templateUrl: 'templates/landing.html',
    controller: 'LandingCtrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/forms/login.html',
    controller: 'LoginCtrl'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'templates/forms/register.html',
    controller: 'RegisterCtrl'
  })
  .state('lobby', {
    url: '/lobby',
    templateUrl: 'templates/lobby.html',
    controller: 'LobbyCtrl'
  })
  
  //schedule
  // .state('sched-view', {
  //   cache: false,
  //   url: '/sched-view',
  //   templateUrl: 'templates/schedule/sched-view.html',
  //   controller: 'SchedViewCtrl',
  //   resolve: {
  //     schedule: ['SchedulesService', 'SSFAlertsService',
  //         function(SchedulesService, SSFAlertsService) {
  //       return SchedulesService.singleSched();
  //     }],
  //     members: ['SSFUsersREST', function(SSFUsersREST) {
  //       return SSFUsersREST.getByCompany()
  //       .then(function(res) {
  //         if(res.status === 200) {
  //           return res.data;
  //         } else {
  //           console.log('error');
  //         }
  //         return [];
  //       });
  //     }],
  //   }
  // })
  
  //organization
  .state('org', {
    // abstract: true,
    url: '/orgId',
    template: '<ion-nav-view></ion-nav-view>'
  })
  .state('org.detail', {
    // abstract: true,
    url: '/:orgId',
    template: '<ion-nav-view></ion-nav-view>'
  })
  .state('org.detail.lobby', {
    url: '/',
    templateUrl: 'templates/organizations/org-lobby.html',
    controller: 'OrgLobbyCtrl',
  })
  .state('org.detail.sched-view', {
    // abstract: true,
    url: '/schedId',
    template: '<ion-nav-view></ion-nav-view>'
  })
  .state('org.detail.sched-view.detail', {
    url: '/:schedId',
    cache: false,
    templateUrl: 'templates/schedule/sched-view.html',
    controller: 'SchedViewCtrl',
    resolve: {
      schedule: ['SchedulesService', 'SSFAlertsService',
          function(SchedulesService, SSFAlertsService) {
        return SchedulesService.singleSched();
      }],
      members: ['SSFUsersREST', function(SSFUsersREST) {
        return SSFUsersREST.getByCompany()
        .then(function(res) {
          if(res.status === 200) {
            return res.data;
          } else {
            console.log('error');
          }
          return [];
        });
      }],
    }
  })
  
  
  .state('org.detail.sched-create', {
    url: '/sched-create',
    cache: false,
    templateUrl: 'templates/schedule/sched-create.html',
    controller: 'SchedCreateCtrl',
    // resolve: {
    //   members: ['SSFUsersREST', function(SSFUsersREST) {
    //     return SSFUsersREST.getByCompany()
    //     .then(function(res) {
    //       if(res.status === 200) {
    //         return res.data;
    //       } else {
    //         console.log('error');
    //       }
    //       return [];
    //     });
    //   }],
    //   template: ['SchedulesService', function(SchedulesService) {
    //     return SchedulesService.template();
    //   }]
    // }
  })
  // .state('sched-view', {
  //   cache: false,
  //   url: '/sched-view',
  //   templateUrl: 'templates/schedule/sched-view.html',
  //   controller: 'SchedViewCtrl',
  //   resolve: {
  //     schedule: ['SchedulesService', 'SSFAlertsService',
  //         function(SchedulesService, SSFAlertsService) {
  //       return SchedulesService.singleSched();
  //     }],
  //     members: ['SSFUsersREST', function(SSFUsersREST) {
  //       return SSFUsersREST.getByCompany()
  //       .then(function(res) {
  //         if(res.status === 200) {
  //           return res.data;
  //         } else {
  //           console.log('error');
  //         }
  //         return [];
  //       });
  //     }],
  //   }
  // })
  
  
  
  .state('req-memship', {
    url: '/req-memship',
    templateUrl: 'templates/organizations/req-memship.html',
    controller: 'ReqMemshipCtrl'
  })
  
  
  .state('navigation', {
    url: '/navigation',
    template:
      '<ion-view hide-nav-bar="false" title="Navigation">' +
        '<ion-nav-buttons></ion-nav-buttons>' +
        '<ion-content class="padding">' +
          '<button class="button button-block button-calm ssf-button" ng-repeat="nav in navLinks" ui-sref="{{nav}}">{{nav}}</button>' +
        '</ion-content>' +
      '</ion-view>',
    controller: function($state, $scope) {
      var stateArray = $state.get();
      $scope.navLinks = [];
      for(var i in stateArray) {
        if(stateArray[i].name !== '' && stateArray[i].name !== 'navigation' && stateArray[i].name !== 'update') {
          $scope.navLinks.push(stateArray[i].name);
        }
      }
      $scope.navLinks.sort();
    }
  });
}]);