angular.module("RESTServices")
.service('SchedulesREST', ['SSFConfigConstants', '$http', '$q',
        function(SSFConfigConstants, $http, $q) {
    var path = 'Schedules/',
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
        // var defer = $q.defer();
        // var tempObj = {
        //     status: 200
        // };
        // if(changedSchedule.state === 'deleted')
        //     tempObj.status = 404;
        // defer.resolve(tempObj);
        // return defer.promise;
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
        // var defer = $q.defer();
        // defer.resolve({
        //     status: 200,
        //     data: [
        //         {
        //             state: 'saved',
        //             groupId: 'abc',
        //             schedule: [
        //                 [
        //                     'Maze',
        //                     [
        //                         [
        //                             'Maze Maze',
        //                             'Thu, 01 Jan 1970 20:59:00 GMT',
        //                             'Thu, 02 Jan 1970 20:59:00 GMT',
        //                             '1'
        //                         ],
        //                         [
        //                             'Maze Maze',
        //                             'Thu, 01 Jan 1970 20:59:00 GMT',
        //                             'Thu, 02 Jan 1970 20:59:00 GMT',
        //                              '2'
        //                         ],
        //                         [
        //                             'Drums',
        //                             'Thu, 01 Jan 1970 20:59:00 GMT',
        //                             'Thu, 02 Jan 1970 20:59:00 GMT',
        //                             '3'
        //                         ],
        //                         [
        //                             'Goat Head',
        //                             'Thu, 01 Jan 1970 20:59:00 GMT',
        //                             'Thu, 02 Jan 1970 20:59:00 GMT',
        //                             '4'
        //                         ]
        //                     ]
        //                 ]
        //             ],
        //             id: '123',
        //             note: 'Maybe next time World!',
        //             createDate: new Date()
        //         },
        //         {
        //             state: 'published',
        //             groupId: 'abc',
        //             schedule: [
        //                 [
        //                     'Maze',
        //                     [
        //                         [
        //                             'Maze Maze',
        //                             'Thu, 01 Jan 1970 20:59:00 GMT',
        //                             'Thu, 02 Jan 1970 20:59:00 GMT',
        //                             '5'
        //                         ],
        //                         [
        //                             'Maze Maze',
        //                             'Thu, 01 Jan 1970 20:59:00 GMT',
        //                             'Thu, 02 Jan 1970 20:59:00 GMT',
        //                             '6'
        //                         ],
        //                         [
        //                             'Drums',
        //                             'Thu, 01 Jan 1970 20:59:00 GMT',
        //                             'Thu, 02 Jan 1970 20:59:00 GMT',
        //                             '7'
        //                         ],
        //                         [
        //                             'Goat Head',
        //                             'Thu, 01 Jan 1970 20:59:00 GMT',
        //                             'Thu, 02 Jan 1970 20:59:00 GMT',
        //                             '8'
        //                         ]
        //                     ]
        //                 ]
        //             ],
        //             id: '321',
        //             note: 'Goodbye World!',
        //             createDate: new Date()
        //         },
        //         {
        //             state: 'saved',
        //             groupId: 'abc',
        //             schedule: [
        //                 [
        //                     'Maze',
        //                     [
        //                         [
        //                             'Maze Maze',
        //                             'Thu, 01 Jan 1970 20:59:00 GMT',
        //                             'Thu, 02 Jan 1970 20:59:00 GMT',
        //                             '9'
        //                         ],
        //                         [
        //                             'Maze Maze',
        //                             'Thu, 01 Jan 1970 20:59:00 GMT',
        //                             'Thu, 02 Jan 1970 20:59:00 GMT',
        //                             '10'
        //                         ],
        //                         [
        //                             'Drums',
        //                             'Thu, 01 Jan 1970 20:59:00 GMT',
        //                             'Thu, 02 Jan 1970 20:59:00 GMT',
        //                             '11'
        //                         ],
        //                         [
        //                             'Goat Head',
        //                             'Thu, 01 Jan 1970 20:59:00 GMT',
        //                             'Thu, 02 Jan 1970 20:59:00 GMT',
        //                             '4'
        //                         ]
        //                     ]
        //                 ]
        //             ],
        //             id: '124563',
        //             note: 'Hello World!',
        //             createDate: new Date()
        //         }
        //     ]
        // });
        // return defer.promise;
    };
    
}]);


    // service.getByCompany = function(token, companyId) {
    //     var defer = $q.defer();
    //     defer.resolve();
    //     return defer.promise;
    // };