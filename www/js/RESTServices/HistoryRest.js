angular.module('RESTServices')
.service('HistoryRest', ['$http', 'SSFConfigConstants',
        function($http, SSFConfigConstants) {
    var HistoryRest = this,
    path = 'History';
    function getUrl() {
        return SSFConfigConstants.EndpointUrl.url + path;
    }
    
    HistoryRest.getBySchedId = function(token, schedId, tz) {
        //tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return $http({
            url: getUrl() + '/schedHistory?filter[where][schedId]=' + schedId +
                '&filter[where][tz]=' + tz,
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
    };
    
    HistoryRest.open = function(token, orgId) {
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
    
    HistoryRest.handleRequest = function(token, requestId, status) {
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