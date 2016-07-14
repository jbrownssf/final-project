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
    SSFUsersREST.updateUser = function(token, userId, changedInfo) {
        return $http({
            url: getUrl()+userId,
            method: "PUT",
            data: changedInfo,
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
    SSFUsersREST.getByCompany = function(token, companyId) {
        var defer = $q.defer();
        defer.resolve({
            status: 200,
            data: [
        {
            firstName: 'John',
            lastName: 'Brown',
            userId: '1'
        },
        {
            firstName: 'Zach',
            lastName: 'Smith',
            userId: '2'
        },
        {
            firstName: 'Teresa',
            lastName: 'Gonzolez',
            userId: '3'
        },
        {
            firstName: 'Josh',
            lastName: 'Jacobs',
            userId: '4'
        },
        {
            firstName: 'Jane',
            lastName: 'Doe',
            userId: '5'
        },
        {
            firstName: 'John',
            lastName: 'Doe',
            userId: '6'
        },
        {
            firstName: 'Jean',
            lastName: 'Mitchel',
            userId: '7'
        },
        {
            firstName: 'Ann',
            lastName: 'Marie',
            userId: '8'
        },
        {
            firstName: 'Stephanie',
            lastName: 'Charles',
            userId: '9'
        },
        {
            firstName: 'Chuck',
            lastName: 'Brown',
            userId: '10'
        },
        {
            firstName: 'Leann',
            lastName: 'Harley',
            userId: '11'
        }
    ]
    });
        return defer.promise;
    };
}]);


    // SSFUsersREST.getByCompany = function(token, companyId) {
    //     var defer = $q.defer();
    //     defer.resolve();
    //     return dever.promise;
    // };