/*  Favorites Feature
Instructions:
1.  Inject 'SSFFavorites' into the app.js file.
2.  Place '<script src="js/SSFServices/SSFFavorites.js"></script>' into the index.html
            file above the app.js
3.  Place the following code into the controller you want to have this feature in:
        $scope.favoriteToggle = SSFFavoritesService.favoriteToggle;
        $scope.isFavorited = SSFFavoritesService.isFavorited;
4.  Place the following code into the html linked to the controller with the feature:
        <div class="col col-10 col-center" ng-click="favoriteToggle('itemId')">
            <icon class="icon energized" style="font-size: 32px;" ng-class="isFavorited('itemId') ? 'ion-ios-star' : 'ion-ios-star-outline'">
        </div>
6.  If you want to clear favorites on logout or manually clear them, use this:
        'SSFFavoritesService.removeFavorites();'
*/

angular.module('SSFFavorites', [])
.service('SSFFavoritesService', ['$window',
        function ($window) {
    
    var service = this;
    var haveFavorites = undefined;
    var localFavorites = undefined;
    if($window.localStorage['localFavorites'] !== undefined) {
        localFavorites = JSON.parse($window.localStorage['localFavorites']);
    } else {
        localFavorites = {};
    }
    
    function objectSize(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }
    function updateHaveFavorites() {
        if(objectSize(localFavorites) > 0) {
            haveFavorites = true;
        } else {
            haveFavorites = false;
        }
    }
    updateHaveFavorites();
    
    service.haveFavorites = function() {
        return haveFavorites;
    };
    
    service.isFavorited = function(itemId) {
        if(localFavorites[itemId]) {
            return true;
        } else {
            return false;
        }
    };
    
    service.favoriteToggle = function(itemId) {
        if(localFavorites[itemId]) {
            delete localFavorites[itemId];
        } else {
            localFavorites[itemId] = true;
            if(itemId === 'itemId') {
                alert('ERROR: Remember to change the itemId passed from the icon being clicked to an actual ID. Also remember to change the id being passed to determine what type of icon is being used.');
            }
        }
        updateHaveFavorites();
        $window.localStorage['localFavorites'] = JSON.stringify(localFavorites);
    };
    
    service.commaConcatenatedFavorites = function($scope) {
        var favoritesString = '';
        updateHaveFavorites();
        if(haveFavorites) {
            //have favorites
            for(var i in localFavorites) {
                favoritesString += i + ',';
            }
            return favoritesString;
        }
        else {
            alert('Check for favorites to exist before you call this function using: SSFFavoritesService.haveFavorites();');
            return '';
        }
    };
    
    service.removeFavorites = function() {
        localFavorites = {};
        delete $window.localStorage['localFavorites'];
    };
}]);