angular.module('RESTServices')
.service('MembersRest', ['$http', 'SSFConfigConstants',
        function($http, SSFConfigConstants) {
    
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
    
}]);