angular.module("RESTServices")
.service('SchedulesREST', ['SSFConfigConstants', '$http', '$q',
        function(SSFConfigConstants, $http, $q) {
    var path = 'Schedules',
    SchedulesREST = this;
    function getUrl() {
        return SSFConfigConstants.EndpointUrl.url + path;
    }
    
    SchedulesREST.upsert = function(token, changedSchedule) {
        //for new schedules or updating existing ones.
        return $http({
            url: getUrl(),
            method: "PUT",
            data: changedSchedule,
            headers: {
                'Authorization': token
            }
        });
    };
    
    SchedulesREST.getById = function(token, groupId, schedId) {
        return $http({
            url: getUrl() + "/findOne?filter[where][groupId]=" + groupId +
                "&filter[where][id]=" + schedId,
            method: "GET",
            headers: {
                'Authorization': token
            }
        });
    };
    
    SchedulesREST.getList = function(token, userId, groupId) {
        return $http({
            url: getUrl() + "?filter[where][groupId]=" + groupId +
                "&filter[where][state][neq]=deleted",   //TODO: filter this hook side
            method: "GET",
            headers: {
                'Authorization': token
            }
        });
    };
    
}]);