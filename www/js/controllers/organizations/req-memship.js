angular.module('starter.controllers')
.controller('ReqMemshipCtrl', ['$scope', 'OrganizationsRest', '$rootScope',
        '$window', 'SSFAlertsService', '$state', '$ionicHistory', 'MembersRest',
        '$ionicActionSheet',
        function($scope, OrganizationsRest, $rootScope, $window, SSFAlertsService,
        $state, $ionicHistory, MembersRest, $ionicActionSheet) {
            
    $scope.openOrganizations = [];
    $scope.$on('$ionicView.enter', function() {
        $rootScope.stopSpinner = true;
        OrganizationsRest.open()
        .then(function(res) {
            $scope.openOrganizations = res.data;
        }, function(err) {
            
        });
        
    });
    
    $scope.openOptions = function() {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Join Organization' },
                { text: 'Leave Organization'},
                { text: 'Manage Requests'}
            ],
            // destructiveText: 'Delete',
            titleText: 'Manage your Organizations',
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                switch(index) {
                    case 0:
                        $scope.selectOrgModal();
                        break;
                    case 1:
                        // SSFAlertsService.showPrompt('Enter Name', 'Remember that set matters.')
                        // .then(function(res) {
                        //     if(res) submitName(res);
                        // });
                        break;
                }
                return true;
            }
        });
    };
    
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
    
    function selectOrg(err, org) {
        if(err) return;
        SSFAlertsService.showConfirm('Are You Sure?', 'You have selected to join "' + org.name + '". Would you like to continue with sending the request?')
        .then(function(res) {
            if(!res) return;
            OrganizationsRest.request($window.localStorage.token, {
                organizationId: org.id,
                userId: $window.localStorage.userId
            })
            .then(function(res) {
                if(res.status === 503)
                    return SSFAlertsService.showAlert('Error', res.data.error.message);
                if(res.status !== 200)
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
}])



.directive('reqMemRequests', [ function() {
    return {
        restrict: "E",
        template:
            '<div class="padding text-center subheader">' +
                'Your Requests' +
            '</div>' +
            '<div class="list">' +
                '<ion-item class="item" ng-repeat="req in reqMemRequests.statuses">' +
                    '{{req.orgName}}<span class="item-note">{{req.status}}</span>' +
                '</ion-item>' +
            '</div>',
        controller: ['$scope', '$rootScope', 'MembersRest', '$window', 'SSFAlertsService',
                function($scope, $rootScope, MembersRest, $window, SSFAlertsService) {
            $scope.reqMemRequests = {};
            $scope.reqMemRequests.statuses = [];
            $rootScope.stopSpinner = true;
            function makeCall() {
                MembersRest.getStatuses($window.localStorage.token, $window.localStorage.userId)
                .then(function(res) {
                    if(res.status !== 200) return SSFAlertsService.showConfirm("Error", "There was a problem loading your page, would you like to try again?")
                    .then(function(res) {
                        if(res) makeCall();
                    });
                    $scope.reqMemRequests.statuses = res.data;
                }, function(err) {
                    SSFAlertsService.showAlert("Error", "Some unknown error occured, please try again.");
                });
            }
            makeCall();
        }]
    };
    
}])


.directive('handleRequests', [ function() {
    return {
        restrict: "E",
        template:
            '<div class="padding text-center subheader">' +
                'Membership Requests' +
            '</div>' +
            '<div class="list">' +
                '<ion-item class="item" ng-repeat="req in reqMemRequests.statuses">' +
                    '{{req.orgName}}<span class="item-note">{{req.status}}</span>' +
                '</ion-item>' +
            '</div>',
        controller: ['$scope', '$rootScope', 'MembersRest', '$window', 'SSFAlertsService',
                function($scope, $rootScope, MembersRest, $window, SSFAlertsService) {
            $scope.reqMemRequests = {};
            $scope.reqMemRequests.statuses = [];
            $rootScope.stopSpinner = true;
            function makeCall() {
                MembersRest.getStatuses($window.localStorage.token, $window.localStorage.userId)
                .then(function(res) {
                    if(res.status !== 200) return SSFAlertsService.showConfirm("Error", "There was a problem loading your page, would you like to try again?")
                    .then(function(res) {
                        if(res) makeCall();
                    });
                    $scope.reqMemRequests.statuses = res.data;
                }, function(err) {
                    SSFAlertsService.showAlert("Error", "Some unknown error occured, please try again.");
                });
            }
            makeCall();
        }]
    };
    
}]);