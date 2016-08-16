angular.module('starter.services', [])
.service('FillSpotService', ['$window', '$ionicModal', 'SSFAlertsService',
        function($window, $ionicModal, SSFAlertsService) {
    var FillSpotService = this;
    
    FillSpotService.set = function($event, $scope, modelObject, indexArray) {
        $scope.nonSuspended = [];
        for(var i in $scope.users) {
            if($scope.users[i].status !== 'suspended') $scope.nonSuspended.push($scope.users[i]);
        }
        var template = 
            '<ion-modal-view>'+
                '<ion-header-bar>'+
                    '<h1 class="title">Assign Position</h1>'+
                    '<div class="button button-icon button-clear" ng-click="closeModal()"><button class="button-icon icon ion-close-round"></button></div>' +
                '</ion-header-bar>'+
                '<ion-content>' +
                
                    '<label class="item item-input">' +
                        '<span class="input-label">Spot</span>' +
                        '<input ng-change="spotChangedResetView(' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + ']' + ')" type="text" name="spot" ng-model="' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + '][0]' + '" placeholder="Spot" required>' +
                    '</label>' +
                    '<label class="item item-input">' +
                        '<span class="input-label">Start Time</span>' +
                        '<input ng-change="spotChangedResetView(' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + ']' + ')" type="time" name="startTime" ng-model="' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + '][1]' + '" placeholder="Start Time" required>' +
                    '</label>' +
                    '<label class="item item-input">' +
                        '<span class="input-label">End Time</span>' +
                        '<input ng-change="spotChangedResetView(' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + ']' + ')" type="time" name="endTime" ng-model="' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + '][2]' + '" placeholder="End Time" required>' +
                    '</label>' +
                    '<label class="item item-input item-select">' +
                        '<div class="input-label">' +
                            'Members' +
                        '</div>' +
                        '<select ng-change="spotChangedResetView(' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + ']' + ')" ng-model="' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + '][3]' + '">' +
                            '<option ng-repeat="user in nonSuspended" value="{{user.memberId}}" ng-selected="{{user.memberId == ' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + '][3]' + '}}">' +
                                '{{users[user.memberId].firstName}} ' +
                                '{{users[user.memberId].lastName}} ' +
                                '{{users[user.memberId].nickName ? "(" + users[user.memberId].nickName + ")" : ""}}' +
                            '</option>' +
                        '</select>' +
                    '</label>' +
                    '<button class="button button-full button-calm" ng-click="closeModal()">' +
                        'Done' +
                    '</button>' +
                    '<button class="button button-full button-assertive" ng-click="removeSpot()">' +
                        'Remove Spot' +
                    '</button>' +
                '</ion-content>'+
            '</ion-modal-view>';
        $scope.removeSpot = function() {
            SSFAlertsService.showConfirm('Warning', 'Are you sure you want to delete this spot? It cannot be undone.')
            .then(function(res) {
                if(res) {
                    $scope[modelObject].schedule[indexArray[0]][1][indexArray[1]] = ['NaN'];
                    $scope.closeModal();
                }
            });
        };
        $scope.chooseEmployer = $ionicModal.fromTemplate(template, {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false
        });
        $scope.chooseEmployer.show();
        
        $scope.closeModal = function() {
            $scope.chooseEmployer.remove();
        };
    };
}]);