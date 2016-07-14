angular.module('starter.services')
.service('SchedulesService', [function() {
    var SchedulesService = this,
    singleSched,
    template = {
        note: '',
        // createDate: new Date(),
        state: '',
        groupId: '',
        schedule: [
            [
                '',
                []
            ]
        ]
    };
    // [ //example schedule
    //     [
    //         'Maze-Maze',
    //         [
    //             [
    //                 'Maze',
    //                 new Date('Thu, 01 Jan 1970 20:59:00 GMT'),
    //                 new Date('Thu, 02 Jan 1970 20:59:00 GMT'),
    //                 '1'
    //             ]
    //         ]
    //     ]
    // ];
    
    SchedulesService.template = function(replace) {
        if(replace)
            template = replace;
        return template;
    };
    SchedulesService.singleSched = function(replace) {
        if(replace)
            singleSched = replace;
        return singleSched;
    };
}]);