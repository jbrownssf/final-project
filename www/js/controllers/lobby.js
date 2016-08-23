angular.module('starter.controllers')
    .controller('LobbyCtrl', ['$scope', '$rootScope', 'MembersRest',
        '$window', 'SSFAlertsService', '$state', 'OrganizationsRest',
        '$ionicHistory', '$timeout', 'SSFConfigConstants',
        function($scope, $rootScope, MembersRest, $window,
            SSFAlertsService, $state, OrganizationsRest, $ionicHistory,
            $timeout, SSFConfigConstants) {

            $scope.openOrganizations = [];
            var errArr = [];
            
            $scope.$on('$ionicView.enter', function() {
                $scope.doRefresh();
            });
            $scope.doRefresh = function(a) {
                errArr = [];
                $rootScope.stopSpinner = true;
                MembersRest.getCurrentOrgs($window.localStorage.token, $window.localStorage.userId)
                    .then(function(res) {
                        if (res.status !== 200) 
                            return errArr[0] = res;
                        errArr[0] = 200;
                        $scope.lobbySelect.data = res.data;
                    }, function(err) {
                        errArr[0] = err;
                    });
                $rootScope.stopSpinner = true;
                OrganizationsRest.open($window.localStorage.token)
                    .then(function(res) {
                        if(res.status !== 200)
                            return errArr[1] = res;
                        errArr[1] = 200;
                        $scope.openOrganizations = res.data;
                    }, function(err) {
                        errArr[1] = err;
                    });
                handleErrors(a);
            };
            function handleErrors(a) {
                $timeout(function() {
                    if(!errArr[0] || !errArr[1])
                        return handleErrors(a);
                    if(a) $scope.$broadcast('scroll.refreshComplete');
                    if(errArr[0] !== 200)
                        return SSFAlertsService.showAlert('Error', 'There was a problem loading your page. Please try again later.');
                    if(errArr[1] !== 200)
                        return SSFAlertsService.showAlert('Error', 'There was a problem retrieving open groups. Please try again later.');
                },  '100');
            }
            $scope.logout = function() {
                $rootScope.$broadcast('request:auth');
            };

            $scope.lobbySelect = {};
            $scope.lobbySelect.data = [];

            $scope.nextPage = function(member) {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $window.localStorage['orgId'] = member.orgId;
                $state.go('app.org.detail.lobby', {
                    orgId: member.orgId
                });
            };

            function selectOrg(err, org) {
                if (err) return;
                SSFAlertsService.showPrompt('Are You Sure?', 'By accepting, you agree to share your contact information with "' + org.name + '". The following field is for a nickname.', 'Accept')
                    .then(function(res) {
                        if (!res && res !== "") return;
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
            $scope.selectOrgModal = function() {
                var template =
                    // '<div class="list">' +
                    '<ion-item ng-if="openOrganizations.length === 0" class="item">' +
                    'No Companies to Select From' +
                    '</ion-item>' +
                    '<ion-item ng-if="openOrganizations.length !== 0" class="item" ng-click="closeEmployerPopover(org)" ng-repeat="org in openOrganizations">' +
                    '{{org.name}}' +
                    '</ion-item>' +
                    '<ion-item></ion-item>';
                    // '</div>';
                SSFAlertsService.showModal({
                    body: template,
                    scope: $scope,
                    title: "Request to Join"
                }, selectOrg);
            };
          $scope.ssfInputModal =function() {
            if($window.innerWidth < SSFConfigConstants.SSFDirectives.contentWidth) {
              return {
                width: $window.innerWidth + 'px',
                margin: 'auto',
                height: '100%',
                top: '0%',
                right: '0%',
                bottom: '0%',
                left: '0%'
              };
            } else {
              return {
                width: SSFConfigConstants.SSFDirectives.contentWidth + 'px',
                margin: 'auto',
                height: '100%',
                top: '0%',
                right: '0%',
                bottom: '0%',
                left: '0%'
              };
            }
          };

            $scope.openMember = function() {
                $state.go('app.user', {
                    memberId: $window.localStorage.userId
                });
            };
            
            $scope.customBackground = function(a) {
                if(a == 'modal') return {height: ($window.innerHeight - 44) + 'px'};
                return {height: ($window.innerHeight - document.getElementById(a || 0).getBoundingClientRect().top) + 'px'};
            };
        }
    ]);