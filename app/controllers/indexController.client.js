'use strict';

(function () {
   angular
      .module('clementine-app', ['ngResource'])
      .controller('clickController', ['$scope', '$resource', function ($scope, $resource) {
         
         var Click = $resource('/api/clicks');
         
         $scope.getClicks = function() {
            Click.get(function (results) {
               $scope.clicks = results.clicks;
            });
         };
         
         $scope.getClicks();
         
         $scope.addClick = function() {
            Click.save(function() {
               $scope.getClicks();
            });
         };
         
         $scope.resetClicks = function() {
            Click.remove(function () {
               $scope.getClicks();
            });
         };
      }])
      .controller('indexVotingController', ['$scope', '$resource', function ($scope, $resource){
         var Poll = $resource('/api/allPolls');
         var isAuthenticated = $resource('/api/isAuth');
         
         $scope.getPolls = function() {
            Poll.query(function (results) {
               $scope.polls = results;
            });
            isAuthenticated.get((results) => {
               $scope.isAuthenticated = results.isAuthenticated;
            });
         };
         
         $scope.getPolls();
      }])
      .controller('headerController', ['$scope', '$resource', ($scope, $resource) => {
         var isAuthenticated = $resource('/api/isAuth');
         $scope.isAuth = function() {
            isAuthenticated.get((results) => {
               $scope.isAuthenticated = results.isAuthenticated;
            });
         };
         $scope.isAuth();
      }])
      .controller('newPollController', ['$scope', '$resource', ($scope, $resource) => {
         
         var Poll = $resource('/api/addNewPoll');
         
         $scope.option=[];
         $scope.options = [1, 2, 3];
         
         $scope.newPollSubmitted = false;
         
         $scope.addNewPoll = () => {
            $scope.newPollSubmitted = true;
         };
         
      }]);
})();
