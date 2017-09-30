'use strict';

(function () {
   angular
      .module('profile-app', ['ngResource'])
      .controller('profileController', ['$scope', '$resource', function ($scope, $resource) {
         var polls = $resource('/api/polls');
         
         $scope.getPolls = function() {
            polls.query(function(results) {
               $scope.polls = results;
            });
         }
         
         
         $scope.viewPoll = function(pollID) {
            $scope.poll = {
               action: 'view',
               actionID: pollID
            };
            console.log($scope.poll);
         };
         
         $scope.editPoll = function(pollID) {
            $scope.poll = {
               action: 'edit',
               actionID: pollID
            };
         };
         
         $scope.deletePoll = function(pollID) {
            $scope.poll = {
               action: 'delete',
               actionID: pollID
            };
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
