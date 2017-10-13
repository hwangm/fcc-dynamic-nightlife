'use strict';

(function () {
   angular
      .module('profile-app', ['ngResource'])
      .controller('profileController', ['$scope', '$resource', function ($scope, $resource) {
         var polls = $resource('/api/polls');
         
         $scope.getPolls = function() {
            polls.query(function(results) {
               $scope.polls = results;
               if($scope.polls.length == 0){
                  $scope.noPolls = true;
               }
               else $scope.noPolls = false;
            });
         }
         
         
         $scope.viewPoll = function(pollID) {
            $scope.poll = {
               action: 'view',
               actionID: pollID
            };
            document.getElementById('pollResults'+pollID).innerHTML = 'Viewing poll '+pollID;
         };
         
         $scope.editPoll = function(pollID) {
            $scope.poll = {
               action: 'edit',
               actionID: pollID
            };
            document.getElementById('pollResults'+pollID).innerHTML = 'Editing poll '+pollID;
         };
         
         $scope.deletePoll = function(pollID) {
            $scope.poll = {
               action: 'delete',
               actionID: pollID
            };
            $scope['poll'+pollID+'ActionTaken'] = true;
            document.getElementById('pollResults'+pollID).innerHTML = 'Deleting poll '+pollID;
            $resource('/api/polls/'+pollID).delete((res) => {
               $('#pollContainer'+pollID).remove();
               $scope.getPolls();
            });
         };
       
         $scope.getPolls();
      }])
      .controller('googleInfoController', ['$scope', '$resource', ($scope, $resource) => {
         var user = $resource('/api/11111');
         
         $scope.getUser = function() {
            user.get((results) => {
               var data = results;
               $scope.googleID = data.google.id;
               $scope.googleDisplayName = data.google.displayName;
            });
         };
         
         $scope.getUser();
      }]);
})();
