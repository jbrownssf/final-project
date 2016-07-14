/*  Internet Connection online/offline
Instructions:
1.  Inject 'SSFConnectivity' into the app.js file.
2.  Place '<script src="js/SSFServices/SSFConnectivity.js"></script>' into the index.html
            file above the app.js
Note.   If you want online/offline listeners for mobile device, continue onto step 3
            and uncomment out 'service.setupConnectivityListeners'. Otherwise,
            you are finished.
3.  If you already have ngCordova installed and injected in your
            app.js file, then skip to step #8
4.  Terminal: cd <project-name>
5.  Terminal: bower install ngCordova
6.  inject 'ngCordova' in your app.js file
7.  Terminal: ionic add ionic-platform-web-client
8.  Terminal: ionic plugin add cordova-plugin-network-information
9.  Include: '<script src="lib/ngCordova/dist/ng-cordova.min.js"></script>'
            in your index.html file just below:
            '<script src="lib/ionic/js/ionic.bundle.js"></script>'
            
If you are using a feature that changes color based on being online or offline, than
        be sure to include the following call in the controller that you want the
        feature in. It creates a scope variable that has a boolean value:
        SSFConnectivityService.setupConnectivityListeners($scope);
*/


angular.module('SSFConnectivity', [])
.service('SSFConnectivityService', ['$ionicPlatform', '$cordovaNetwork',
        function($ionicPlatform, $cordovaNetwork) {
    
    var service = this;
    
    service.isOnline = function() {
        if(ionic.Platform.isWebView()) {
            if(navigator.connection === "none") {
                return false;
            }
            else {
               return true;
            }
        }
        else {
            return navigator.onLine;
        }
    };
    
    service.setupConnectivityListeners = function($scope) {
        $scope.online = true;
        if(ionic.Platform.isWebView()) {
            // could use navigator.connection instead of $cordovaNetwork.getNetwork()
            if($cordovaNetwork.getNetwork() === "none") {
                $scope.online = false;
            }
            else {
                $scope.online = true;
            }
            $scope.$apply();
            $scope.$on('$cordovaNetwork:online', function(event, networkState) {
                $scope.online = true;
            });
            $scope.$on('$cordovaNetwork:offline', function(event, networkState) {
                $scope.online = false;
            });
        }
        else {
            //computer webview
            $scope.online = navigator.onLine;
            window.addEventListener("online", function(e) {
                $scope.online = true;
            }, false);
            
            window.addEventListener("offline", function(e) {
                $scope.online = false;
            }, false);
        }
    };
}]);