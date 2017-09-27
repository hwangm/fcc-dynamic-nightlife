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
         
         $scope.getPolls();
      }]);
})();
