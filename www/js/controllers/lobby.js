angular.module('starter.controllers')
    .controller('LobbyCtrl', ['$scope', '$rootScope', '$translate', 'FillSpotService',
        'MembersRest', '$window', 'SSFAlertsService', '$state', '$ionicHistory',
        '$ionicActionSheet', 'OrganizationsRest',
        function($scope, $rootScope, $translate, FillSpotService, MembersRest,
            $window, SSFAlertsService, $state, $ionicHistory, $ionicActionSheet,
            OrganizationsRest) {

            // $scope.consoleLog = function(a) {
            //     console.log(a);
            // };
            $scope.openOrganizations = [];
            $scope.$on('$ionicView.enter', function() {
                $rootScope.stopSpinner = true;
                makeCall();
                $rootScope.stopSpinner = true;
                OrganizationsRest.open()
                    .then(function(res) {
                        $scope.openOrganizations = res.data;
                    }, function(err) {

                    });
                $rootScope.stopSpinner = true;
                OrganizationsRest.open()
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
            $rootScope.stopSpinner = true;

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
                $state.go('org.detail.lobby', {
                    orgId: member.orgId,
                    org: member
                });
            };

            function selectOrg(err, org) {
                if (err) return;
                SSFAlertsService.showConfirm('Are You Sure?', 'You have selected to join "' + org.name + '". Would you like to continue with sending the request?')
                    .then(function(res) {
                        if (!res) return;
                        OrganizationsRest.request($window.localStorage.token, {
                                organizationId: org.id,
                                userId: $window.localStorage.userId
                            })
                            .then(function(res) {
                                if (res.status === 503)
                                    return SSFAlertsService.showAlert('Error', res.data.error.message);
                                if (res.status !== 200)
                                    return SSFAlertsService.showAlert('Error', 'There was a problem requesting to join this selected company.');
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go('lobby');
                            }, function(err) {
                                SSFAlertsService('Error', 'Some unknown error occured. Please try again later.');
                            });
                    });
            }
            $scope.selectOrgModal = function() {
                var template =
                    // '<form name="OrganizationForm" class="padding" ng-submit="submitForm(OrganizationForm)">' +
                    // '<label class="item item-input">' +
                    //     '<input name="orgCode" ng-model="ngModel.orgCode" type="text" placeholder="Type Code">' +
                    // '</label>' +
                    // '<button type="submit" class="button button-block button-calm ssf-button">' +
                    //     'submit' +
                    // '</button>' +
                    '<div class="list">' +
                    '<ion-item class="item" ng-click="closeEmployerPopover(org)" ng-repeat="org in openOrganizations">' +
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