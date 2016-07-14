angular.module('starter.services', [])
.service('FillSpotService', ['$window', '$ionicModal', function($window, $ionicModal) {
    var FillSpotService = this;
    
    FillSpotService.set = function($event, $scope, modelObject, indexArray) {
        console.log()
        var template = 
            '<ion-modal-view>'+
                '<ion-header-bar>'+
                    '<h1 class="title">Assign Position</h1>'+
                    '<div class="button button-icon button-clear" ng-click="closeModal()"><button class="button-icon icon ion-close-round"></button></div>' +
                '</ion-header-bar>'+
                '<ion-content>' +
                
                    '<label class="item item-input">' +
                        '<span class="input-label">Spot</span>' +
                        '<input type="text" name="spot" ng-model="' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + '][0]' + '" placeholder="Spot" required>' +
                    '</label>' +
                    '<label class="item item-input">' +
                        '<span class="input-label">Start Time</span>' +
                        '<input type="time" name="startTime" ng-model="' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + '][1]' + '" placeholder="Start Time" required>' +
                    '</label>' +
                    '<label class="item item-input">' +
                        '<span class="input-label">End Time</span>' +
                        '<input type="time" name="endTime" ng-model="' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + '][2]' + '" placeholder="End Time" required>' +
                    '</label>' +
                    '<label class="item item-input item-select">' +
                        '<div class="input-label">' +
                            'Members' +
                        '</div>' +
                        '<select ng-model="' + modelObject + '.schedule[' + indexArray[0] + '][1][' + indexArray[1] + '][3]' + '">' +
                            '<option ng-repeat="user in users" value="{{user.userId}}">{{who(user.userId).firstName}} {{who(user.userId).lastName}}</option>' +
                        '</select>' +
                    '</label>' +
                    // '<div ng-repeat="user in users">{{consoleLog(user)}}</div>' +
                    '<button class="button button-full button-calm ssf-button" ng-click="closeModal()">' +
                        'Done' +
                    '</button>' +
                '</ion-content>'+
            '</ion-modal-view>';
        
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