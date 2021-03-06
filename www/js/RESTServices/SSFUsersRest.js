angular.module("RESTServices", [])
.service('SSFUsersREST', ['SSFConfigConstants', '$http', '$q',
        function(SSFConfigConstants, $http, $q) {
    var path = 'SSFUsers/',
    SSFUsersREST = this;
    function getUrl() {
        return SSFConfigConstants.EndpointUrl.url + path;
    }
    SSFUsersREST.create = function(newUser) {
        return $http.post(getUrl(), newUser);
    };
    SSFUsersREST.login = function(user) {
        user["ttl"] = 1209600000;
        return $http.post(getUrl() + "login", user);
    };
    SSFUsersREST.update = function(token, userId, changedInfo) {
        return $http({
            url: getUrl() + userId,
            method: "PUT",
            data: changedInfo,
            headers: {
                'Authorization': token
            }
        });
    };
    SSFUsersREST.getById = function(token, userId) {
        return $http({
            url: getUrl()+userId,
            method: "GET",
            headers: {
                'Authorization': token
            }
        });
    };
    SSFUsersREST.getBadgeCount = function(token) {
        return $http({
            url: getUrl()+ 'getBadges',
            method: "GET",
            headers: {
                'Authorization': token
            }
        });
    };
    SSFUsersREST.logout = function(token) {
        return $http({
            url: getUrl()+"logout",
            method: "POST",
            headers: {
                'Authorization': token
            }
        });
    };
    SSFUsersREST.getIP = function() {
        return $http({
            url: 'https://api.ipify.org',
            method: "GET",
        });
    };
}]);