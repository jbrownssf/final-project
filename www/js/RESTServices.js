angular.module("RESTServices", [])
.service('UsersService', ['SSFConfigConstants', '$http',
        function(SSFConfigConstants, $http) {
    var path = 'AppUsers/',
    service = this;
    function getUrl() {
        return SSFConfigConstants.EndpointUrl.url + path;
    }
    service.create = function(newUser) {
        return $http.post(getUrl, newUser);
    };
    service.login = function(user) {
        user["ttl"] = 1209600000;
        return $http.post(getUrl() + "login", user);
    };
    service.updateUser = function(token, userId, changedInfo) {
        return $http({
            url: getUrl()+userId,
            method: "PUT",
            data: changedInfo,
            headers: {
                'Authorization': token
            }
        });
    };
    service.logout = function(token) {
        return $http({
            url: getUrl()+"logout",
            method: "POST",
            headers: {
                'Authorization': token
            }
        });
    };
    service.getIP = function() {
        return $http({
            url: 'https://api.ipify.org',
            method: "GET",
        });
    };
}]);