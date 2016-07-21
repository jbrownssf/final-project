angular.module('starter.controllers')
    .controller('LobbyCtrl', ['$scope', '$rootScope', 'MembersRest', 
        '$window', 'SSFAlertsService', '$state', 'OrganizationsRest',
        function($scope, $rootScope, MembersRest, $window,
        SSFAlertsService, $state,
            OrganizationsRest) {

            $scope.openOrganizations = [];
            $scope.$on('$ionicView.enter', function() {
                $rootScope.stopSpinner = true;
                makeCall();
                $rootScope.stopSpinner = true;
                OrganizationsRest.open($window.localStorage.token)
                    .then(function(res) {
                        $scope.openOrganizations = res.data;
                    }, function(err) {

                    });
            });

            $scope.logout = function() {
                $rootScope.$broadcast('request:auth');
            };

            $scope.lobbySelect = {};
            $scope.lobbySelect.data = [];

            function makeCall() {
                MembersRest.getCurrentOrgs($window.localStorage.token, $window.localStorage.userId)
                    .then(function(res) {
                        if (res.status !== 200) return SSFAlertsService.showConfirm("Error", "There was a problem loading your page, would you like to try again?")
                            .then(function(res) {
                                if (res) makeCall();
                            });
                        $scope.lobbySelect.data = res.data;
                    }, function(err) {
                        SSFAlertsService.showAlert("Error", "Some unknown error occured, please try again.");
                    });
            }
            $scope.nextPage = function(member) {
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
                    '<div class="list">' +
                    '<ion-item ng-if="openOrganizations.length === 0" class="item">' +
                    'No Companies to Select From' +
                    '</ion-item>' +
                    '<ion-item ng-if="openOrganizations.length !== 0" class="item" ng-click="closeEmployerPopover(org)" ng-repeat="org in openOrganizations">' +
                    '{{org.name}}' +
                    '</ion-item>' +
                    '</div>';
                SSFAlertsService.showModal({
                    body: template,
                    scope: $scope,
                    title: "Request to Join"
                }, selectOrg);
            };
        }
    ]);