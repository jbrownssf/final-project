// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ionic.service.core', 'starter.controllers', 'starter.services',
    'pascalprecht.translate', 'SSFConfig', 'SSFAlerts', 'SSFCache',
    'SSFConnectivity', 'SSFDirectives', 'SSFFavorites', 'SSFLogout',
    'SSFMailComposer', 'SSFSpinner', 'RESTServices', 'SSFDeploy'])

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
  })
  .state('app.credits', {
    url: '/credits',
    views: {
      'menuContent': {
        template: 
          '<ion-view view-title="Simply Scheduling">' +
            '<ion-header-bar class="bar bar-subheader bar-calm" style="height: 48px;">' +
              '<div class="tabs">' +
                '<div style="width: 16%"></div>' +
                '<button class="button button-clear button-full tab-item tab-off">' +
                '</button>' +
                '<button class="button button-clear button-full tab-item tab-on">' +
                  'Credits' +
                '</button>' +
                '<button class="button button-clear button-full tab-item tab-off">' +
                '</button>' +
                '<div style="width: 16%"></div>' +
              '</div>' +
            '</ion-header-bar>' +
            '<ion-content>' +
              // '<div class="item-text-center">' +
              //   'Designed and Developed By' +
              //   '<br>' +
              //   '<br>' +
              //   'John P. Brown' +
              //   '<br>' +
              //   '<br>' +
              //   '<br>' +
              //   'Assisted by SoftStack Factory' +
              //   '<br>' +
              //   '<br>' +
              //   'Harold Gottschalk, CEO' +
              // '</div>' +
            '</ion-content>' +
          '</ion-view>',
        controller: ['$scope', function($scope) {
        }]
      }
    }
  });
}]);