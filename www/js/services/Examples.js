angular.module('starter.services')
.service('ExamplesServ', ['$ionicModal', '$ionicSlideBoxDelegate',
    function($ionicModal, $ionicSlideBoxDelegate) {
  var ExamplesServ = this;
  
  
  ExamplesServ.show = function(params) {
    
  	params.scope.aImages = [{
        'src' : 'img/examples/org-lobby-options.png',
      	'msg' : 'Simple list of schedules, slide items to clone or delete them.'
    	}, {
        'src' : 'img/examples/sched-view.png',
      	'msg' : 'When you view a schedule, you will be alerted where and when you are working.'
    	}, {
        'src' : 'img/examples/sched-view-history.png',
      	'msg' : 'Managers can see a history of changes to the schedule.'
    	}, {
        'src' : 'img/examples/org-members.png',
      	'msg' : 'Managers can view a list of members, and their contact information.'
    	}, {
        'src' : 'img/examples/org-members-edit.png',
      	'msg' : 'Easy to accept or remove members.'
    }];
    var template = 
      '<ion-modal-view scroll="false" class="modal" ng-style="ssfInputModal()" style="background: white">' +
        '<ion-header-bar style="background-color: #39864c;">'+
          '<h1 class="title" style="color: white;">Simply Scheduling</h1>'+
          '<div class="button button-icon button-clear" ng-click="closeModal()"><button class="button-icon icon ion-close-round light"></button></div>' +
        '</ion-header-bar>'+
        '<ion-content scroll="false" style="max-width: 900px">' +
          '<ion-slide-box on-slide-changed="slideChanged(index)" show-pager="true">' +
            '<ion-slide ng-repeat="oImage in aImages">' +
              '<img ng-src="{{oImage.src}}" height="65%" class="center" style="margin-top: 10px;"/>' +
              '<p class="info" style="color: #184924;">{{oImage.msg}}</p>' +
            '</ion-slide>' +
          '</ion-slide-box>' +
        '</ion-content>' +
      '</ion-modal-view>';
    params.scope.modal = $ionicModal.fromTemplate(template, {
      scope: params.scope,
      animation: 'slide-in-up'
    });
    // .then(function(modal) {
    //   params.scope.modal = modal;
    // });

    // params.scope.openModal = function() {
      $ionicSlideBoxDelegate.slide(0);
      params.scope.modal.show();
    // };

    params.scope.closeModal = function() {
      params.scope.modal.hide();
    };

    // Cleanup the modal when we're done with it!
    params.scope.$on('$destroy', function() {
      params.scope.modal.remove();
    });

    // Call this functions if you need to manually control the slides
    params.scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
  
    params.scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };
  
  	params.scope.goToSlide = function(index) {
      params.scope.modal.show();
      $ionicSlideBoxDelegate.slide(index);
    };
  
    // Called each time the slide changes
    params.scope.slideChanged = function(index) {
      params.scope.slideIndex = index;
    };
  };
  
  
}]);