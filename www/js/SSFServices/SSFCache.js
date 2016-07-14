/*  Remembers results and stores in local storage for offline access
Instructions:
1.  Inject 'SSFCache' into the app.js file.
2.  Place '<script src="js/SSFServices/SSFCache.js"></script>' into the index.html
            file above the app.js
3.	If you have not already done so, include the SSFLogout.js service file.
4.	Place this: 'SSFCacheService.clearData();' into the only service in the
			SSFLogout.js file.
5.  If you turn translation on, include SSFTranslate.js file and finish its' steps before returning here.
            Otherwise you are done.
6.  Include the following within the 'SSF_CONFIG_CONSTANTS' ojbect:
"SSF_CACHE_SERVICE": {
    "OKAY": "OK",
    "CANCEL": "Cancel"
}


EXAMPLE USES referencing the Zebit App

creates high level instant budget
CacheService.manageData('InstantService', 'computeHighLevelInstant', 'mostRecentHighLevel', formInputs, false);

gets latest custom budget
CacheService.manageData('CustomService', 'getLatestCustom', 'mostRecentDeltas', {}, true);

gets latest savings budget
CacheService.manageData('SavingsService', 'getLatestSavingsBudget', 'mostRecentSavings', {}, true);
*/

angular.module('SSFCache', [])
.config(['SSFConfigConstants', function(SSFConfigConstants) {
    SSFConfigConstants['SSFCacheService'] = {
    	//SSFTranslate should create a 'textTranslated' object whenever it translates
    	'languageFileReference': [
            'SSF_CONFIG_CONSTANTS.SSF_CACHE_SERVICE.TITLE',
            'SSF_CONFIG_CONSTANTS.SSF_CACHE_SERVICE.OFFLINE',
            'SSF_CONFIG_CONSTANTS.SSF_CACHE_SERVICE.UNREGISTERED'
    	],
        'notTranslated': [
            'Error',
            'We could not retrieve your data while you are offline.',
            'There was a problem with authenticating your session. Please sign in.'
        ]
    };
}])

.service('SSFCacheService', ['$window', '$q', '$rootScope', 'SSFConfigConstants', 'SSFAlertsService',
		function ($window, $q, $rootScope, SSFConfigConstants, SSFAlertsService) {
	
	var service = this,
	cacheData = {},
	currentData = {};
	
	//	toggles between which translated or not translated text is referenced.
    var serviceText = undefined;
    if(SSFConfigConstants.shouldTranslate) {
        serviceText = SSFConfigConstants.SSFCacheService.textTranslated;
    }
    else {
        serviceText = SSFConfigConstants.SSFCacheService.notTranslated;
    }
    service.updateServiceText = function(array) {
        serviceText = array;
    };

	function updateArray(storageName) {
		cacheData[storageName] = currentData;
		$window.localStorage['cacheData'] = JSON.stringify(cacheData);
	}

	function whichData(storageName) {
		//decides what data is being referenced
		if(cacheData.storageName !== undefined) {
			return currentData = cacheData.storageName;
		}
		else if($window.localStorage['cacheData'] !== undefined) {
			var tempHolder = JSON.parse($window.localStorage['cacheData']);
			if(tempHolder.storageName !== undefined) {
				currentData = tempHolder.storageName;
			}
			else {
				SSFAlertsService.showAlert(serviceText[0], serviceText[1]);
				currentData = {
					'data': {},
					'errorMessage': serviceText[1]
				};
			}
		}
		else {
			SSFAlertsService.showAlert(serviceText[0], serviceText[1]);
			currentData = {
				'data': {},
				'errorMessage': serviceText[1]
			};
		}
	}
    function objectSize(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }
	
	service.clearData = function() {
		cacheData = {};
    	currentData = {};
		delete $window.localStorage['cacheData'];
	};

	service.manageData = function(injectedName, serviceName, storageName, dataObject, shouldBeSignedIn) {
		/*	list of options
		injectedName: the name of the injected RESTServices.js provider
		serviceName: the name of the injected RESTServices.js provider
		storageName: *must be unique!* same name that references the RESTServices.js service to be called.
		dataObject: the object containing what the backend needs to complete it's call. If null, put: {}
		shouldBeSignedIn: boolean
		token: required if isSignedIn = true
		userId: required if isSignedIn = true
		*/
		
		var deferred = $q.defer();
		whichData(storageName);
		if(shouldBeSignedIn) {
			var token = $window.localStorage['token'],
			userId = $window.localStorage['userId'];
		}
		
		if(shouldBeSignedIn && $window.localStorage['userId'] === undefined) {
			SSFAlertsService.showAlert(serviceText[0], serviceText[2]);
			deferred.resolve(
				currentData = {
					'data': {},
					'errorMessage': serviceText[2]
				}
			);
		}
		else {
		    //TODO: test if this if statement actually works
			if(objectSize(JSON.stringify(currentData.data)) === 0 || currentData.data === undefined) {
				if($rootScope.online) {
					deferred.resolve(
						[injectedName][serviceName](token, userId, dataObject)
						.then(function(response) {
							currentData = response;
							updateArray(storageName, currentData);
							return response;
						}, function(error) {
							currentData = error;
							updateArray(storageName, currentData);
							return error;
						})
					);
				}
				else {
					//offline and don't have the data
					SSFAlertsService.showAlert(serviceText[0], serviceText[1]);
					deferred.resolve(
						currentData = {
							'data': {},
							'errorMessage': serviceText[1]
						}
					);
				}
			}
			else {
				deferred.resolve(currentData);
			}
		}
		return deferred.promise;
	};
}]);