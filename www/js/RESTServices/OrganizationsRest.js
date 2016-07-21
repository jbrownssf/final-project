angular.module('RESTServices')
.service('OrganizationsRest', ['$http', 'SSFConfigConstants',
        function($http, SSFConfigConstants) {
    var OrganizationsRest = this,
    path = 'Organizations';
    function getUrl() {
        return SSFConfigConstants.EndpointUrl.url + path;
    }
    
    OrganizationsRest.request = function(token, data) {
        return $http({
            url: getUrl() + '/join',
            method: 'POST',
            data: data,
            headers: {
                'Authorization': token
            }
        });
    };
    
    OrganizationsRest.open = function(token, orgId) {
        var tempString = getUrl() + "?filter[where][status]=open";
        if(orgId) tempString += '&filter[where][id]=' + orgId;
        return $http({
            url: tempString,
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
    };
    
    OrganizationsRest.handleRequest = function(token, requestId, status) {
        return $http({
            url: getUrl() + "/handleRequest",
            method: 'POST',
            data: {
                requestId: requestId,
                status: status
            },
            headers: {
                Authorization: token
            }
        });
    };
}]);