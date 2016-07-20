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
    
    MembersRest.getByCompany = function(token, companyId, type, userId) {
        //type is "accepted" or "requests"
        //if "accepted" exclude "pending" and "declined"
        //"removed" is also a property to not show when assigning people to a new schedule
        
        //if "requests" only get "pending" "declined" and "removed"
        
        var tempUrl = getUrl() + "/getInfo?filter[where][orgId]=" + companyId;
        if(userId) tempUrl += "&filter[where][memberId]=" + userId;
        if(type == "accepted") {
            tempUrl += "&filter[where][and][0][status][neq]=pending" +
                "&filter[where][and][1][status][neq]=declined";
        } else if(type == "requests") {
            tempUrl += "&filter[where][and][0][status]=pending" +
                "&filter[where][and][1][status]=declined" +
                "&filter[where][and][2][status]=removed";
        }
        
        return $http({
            url: tempUrl,
            method: "GET",
            headers: {
                Authorization: token
            }
        });
    };
    
}]);