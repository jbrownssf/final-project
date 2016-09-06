// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ionic.service.core', 'starter.controllers', 'starter.services',
    'pascalprecht.translate', 'SSFConfig', 'SSFAlerts', 'SSFCache',
    'SSFConnectivity', 'SSFDirectives', 'SSFFavorites', 'SSFLogout',
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
      
      
  $urlRouterProvider.otherwise(function() {
    if(window.localStorage.orgId)
      return '/app/orgId/' + window.localStorage.orgId + '/';
    if(window.localStorage.token)
      return '/app/lobby';
    return '/app/';
  });
  
  
  $stateProvider
  
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'SideMenuCtrl'
  })
  
  
  
  
  // .state('app', {
  //   url: '/app',
  //   template: '<ion-nav-view></ion-nav-view>'
  // })
  .state('app.landing', {
    url: '/',
    views: {
      'menuContent': {
        templateUrl: 'templates/landing.html',
        controller: 'LandingCtrl'
      }
    }
  })
  // .state('app.login', {
  //   url: '/login',
  //   templateUrl: 'templates/forms/login.html',
  //   controller: 'LoginCtrl'
  // })
  // .state('app.register', {
  //   url: '/register',
  //   templateUrl: 'templates/forms/register.html',
  //   controller: 'RegisterCtrl'
  // })
  .state('app.lobby', {
    url: '/lobby',
    views: {
      'menuContent': {
        templateUrl: 'templates/lobby.html',
        controller: 'LobbyCtrl'
      }
    }
  })
  
  .state('app.user', {
    url: '/user',
    views: {
      'menuContent': {
        templateUrl: 'templates/organizations/org-member.html',
        controller: 'OrgMemberCtrl',
      }
    }
  })
  
  //organization
  .state('app.org', {
    url: '/orgId',
    views: {
      'menuContent': {
        template: '<ion-nav-view></ion-nav-view>'
      }
    }
  })
  .state('app.org.detail', {
    url: '/:orgId',
    template: '<ion-nav-view></ion-nav-view>'
  })
  .state('app.org.detail.lobby', {
    url: '/',
    templateUrl: 'templates/organizations/org-lobby.html',
    controller: 'OrgLobbyCtrl',
  })
  
  //schedules
  .state('app.org.detail.sched-view', {
    url: '/scheds',
    template: '<ion-nav-view></ion-nav-view>'
  })
  .state('app.org.detail.sched-view.detail', {
    url: '/:schedId',
    templateUrl: 'templates/schedule/sched-view.html',
    controller: 'SchedViewCtrl',
  })
  .state('app.org.detail.sched-create', {
    url: '/sched-create',
    templateUrl: 'templates/schedule/sched-create.html',
    controller: 'SchedCreateCtrl',
  })
  
  //members
  .state('app.org.detail.members', {
    url: '/members',
    templateUrl: 'templates/organizations/org-members.html',
    controller: 'OrgMembersCtrl',
  });
  // .state('navigation', {
  //   url: '/navigation',
  //   template:
  //     '<ion-view hide-nav-bar="false" title="Navigation">' +
  //       '<ion-nav-buttons></ion-nav-buttons>' +
  //       '<ion-content class="padding">' +
  //         '<button class="button button-block button-calm ssf-button" ng-repeat="nav in navLinks" ui-sref="{{nav}}">{{nav}}</button>' +
  //       '</ion-content>' +
  //     '</ion-view>',
  //   controller: function($state, $scope) {
  //     var stateArray = $state.get();
  //     $scope.navLinks = [];
  //     for(var i in stateArray) {
  //       if(stateArray[i].name !== '' && stateArray[i].name !== 'navigation' && stateArray[i].name !== 'update') {
  //         $scope.navLinks.push(stateArray[i].name);
  //       }
  //     }
  //     $scope.navLinks.sort();
  //   }
  // });
}])

.run([ function() {
  //set number of notifications here, update whenever the list is called.
}]);