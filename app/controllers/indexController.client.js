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
               if($scope.polls.length == 0) {
                  $scope.noPolls = true;
               }
               else $scope.noPolls = false;
            });
            isAuthenticated.get((results) => {
               $scope.isAuthenticated = results.isAuthenticated;
            });
         };
         
         $scope.showPollDetails = (id) => {
            if($scope['showDetails'+id]) $scope['showDetails'+id] = false;
            else $scope['showDetails'+id] = true; 
            $scope.initChart(id);
         };
         
         $scope.initChart = (id) => {
            var pollData = _.find($scope.polls, (el) => { return el.pollID == id }); //find the poll data matching poll ID
            var pollLabels = [],
                pollDataPoints = [],
                backgroundColors = [];
            
            for(var x of pollData.options){ //populate the labels and datapoints
               pollLabels.push(x.name);
               pollDataPoints.push(x.count);
               let r = Math.floor(Math.random() * 200);
               let g = Math.floor(Math.random() * 200);
               let b = Math.floor(Math.random() * 200);
               let color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
               backgroundColors.push(color);
            }
            var ctx = document.getElementById('pollChart'+id).getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'pie',
            
                // The data for our dataset
                data: {
                    labels: pollLabels,
                    datasets: [{
                        data: pollDataPoints,
                        backgroundColor: backgroundColors
                    }]
                }
            });
         }
         
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
         var isAuthenticated = $resource('/api/isAuth');
         $scope.isAuth = function() {
            isAuthenticated.get((results) => {
               $scope.isAuthenticated = results.isAuthenticated;
            });
         };
         $scope.isAuth();
         
         var Poll = $resource('/api/addNewPoll');
         
         $scope.createNewPoll = false;
         
         $scope.option=[];
         $scope.options = [1, 2, 3];
         
         $scope.newPollSubmitted = false;
         
         $scope.addNewPoll = () => {
            $scope.newPollSubmitted = true;
            Poll.
               save(null, {
                  'pollName': $scope.newPollName,
                  'pollDesc': $scope.newPollDesc,
                  'options': $scope.option
               });
         };
         
         $scope.showForm = () => {
           $scope.createNewPoll = true; 
         };
         
         $scope.updateOptions = (x) => {
           $scope.option[x-1] = $("#option"+x).val(); 
         };
         
         $scope.addOption = () => {
           $scope.options.push($scope.options.length+1); 
         };
         
      }]);
})();
