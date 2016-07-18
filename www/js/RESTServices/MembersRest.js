angular.module('RESTServices')
.service('MembersRest', ['$http', 'SSFConfigConstants', '$q',
        function($http, SSFConfigConstants, $q) {
    
    var MembersRest = this,
    path = 'Members';
    function getUrl() {
        return SSFConfigConstants.EndpointUrl.url + path;
    }
    
    MembersRest.getCurrentOrgs = function(token, userId) {
        return $http({
            url: getUrl() +
                "/getStatuses?filter[where][memberId]=" + userId +
                "&filter[where][and][0][status][neq]=pending" +
                "&filter[where][and][1][status][neq]=declined",
            method: "GET",
            headers: {
                Authorization: token
            }
        });
    };
    MembersRest.getStatuses = function(token, userId) {
        return $http({
            url: getUrl() + "/getStatuses?filter[where][memberId]=" + userId,
            method: "GET",
            headers: {
                Authorization: token
            }
        });
    };
    MembersRest.getRequests = function(token, orgId) {
        return $http({
            url: getUrl() + "/getRequests?filter[where][orgId]=" + orgId,
            method: "GET",
            headers: {
                Authorization: token
            }
        });
    };
    MembersRest.getByCompany = function(token, companyId) {
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