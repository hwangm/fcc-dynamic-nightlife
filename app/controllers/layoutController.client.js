// create the module and name it scotchApp
    var votingApp = angular.module('mhwang-fcc-voting-app', ['ngResource', 'ngRoute']);
    
     // configure our routes
    votingApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'public/index_voting.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/profile', {
                templateUrl : 'public/profile_voting.html',
                controller  : 'profileController'
            })
            
            //when viewing a specific poll
            .when('/poll/:id', {
                templateUrl : 'public/poll.html',
                controller : 'pollController'
            })

            // route for the contact page
            .when('/login', {
                templateUrl : 'public/login.html',
                controller  : 'loginController'
            });
    });
    
    votingApp.service('pollService', function($resource) {
        
        return {
            getPolls: function() {
                let Poll = $resource('/api/allPolls');
                return Poll.query().$promise;
            },
            getPoll: function(pollID) {
                let Poll = $resource('/api/polls/' + pollID);
                return Poll.get().$promise;
            },
            updatePollCount: function(pollID, pollData) {
                let Poll = $resource('/api/polls/' + pollID, {}, {
                    update: {
                        method: 'PUT'
                    }
                });
                return Poll.update({}, { 'newDoc': pollData }).$promise;
            },
            savePoll: function(pollObject) {
                let Poll = $resource('/api/addNewPoll');
                return Poll
                    .save(null, {
                        'pollName': pollObject.newPollName,
                        'pollDesc': pollObject.newPollDesc,
                        'options': pollObject.optionObject
                    })
                    .$promise;
                        
            },
            deletePoll: function(pollID) {
                let Poll = $resource('/api/polls/'+pollID);
                return Poll.delete().$promise;
            },
            isAuth: function() {
                let auth = $resource('/api/isAuth');
                return auth.get().$promise;
            }
            
        }
            
    });

    // create the controller and inject Angular's $scope
    votingApp.controller('mainController', ['$scope', '$resource', '$route', function ($scope, $resource, $route) {
        
    }]);
    
    // create the controller and inject Angular's $scope
    votingApp.controller('pollController', ['$scope', '$resource', '$routeParams', 'pollService', '$q', '$timeout', function ($scope, $resource, $routeParams, pollService, $q, $timeout) {
        var pollID = $routeParams.id;
        $scope.getPoll = function() {
                var deferred = $q.defer();
                pollService.getPoll(pollID).then(function(results) {
                    $scope.poll = results;
                    deferred.resolve(results);
                    pollService.isAuth().then(function(res) {
                        $scope.isAuthenticated = res.isAuthenticated;
                    });
                },
                function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
        
        $scope.addSaveNewOption = (id) => {
            var newOptionText = $('#newOption_' + id).val();
            var pollData = $scope.poll;
            pollData.options.push({
                'name': newOptionText,
                'count': 1
            });
            pollService.updatePollCount(id, pollData).then(function(results) {
                if(results.votedAlready == true){
                    pollData.options.splice(_.indexOf(pollData.options, newOptionText), 1);
                    alert('You already voted on this poll and cannot add a new option.');
                }
                else $scope.updateChart(id);
            });
        }
        
        $scope.initChart = (id) => {
            
            var pollLabels = [],
                pollDataPoints = [],
                backgroundColors = [];
        
            for (var x of $scope.poll.options) { //populate the labels and datapoints
                pollLabels.push(x.name);
                pollDataPoints.push(x.count);
                let r = Math.floor(Math.random() * 200);
                let g = Math.floor(Math.random() * 200);
                let b = Math.floor(Math.random() * 200);
                let color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
                backgroundColors.push(color);
            }
            var ctx = document.getElementById('pollChart' + id).getContext('2d');
            $timeout(() => {
                $scope['chart' + id] = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'pie',
            
                    // The data for our dataset
                    data: {
                        labels: pollLabels,
                        datasets: [{
                            data: pollDataPoints,
                            backgroundColor: backgroundColors
                        }]
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false
                    }
                });
            }, 100);
        }
        
        $scope.getPoll().then(function() {
            $(document).ready(() => {
                $scope.initChart(pollID);
            });
        });
        
        $scope.updateChart = (id) => {
        
            $scope.getPoll().then(function(result) {
                var pollLabels = [],
                    pollDataPoints = [],
                    backgroundColors = [];
                
                for (var x of $scope.poll.options) { //populate the labels and datapoints
                    pollLabels.push(x.name);
                    pollDataPoints.push(x.count);
                    let r = Math.floor(Math.random() * 200);
                    let g = Math.floor(Math.random() * 200);
                    let b = Math.floor(Math.random() * 200);
                    let color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
                    backgroundColors.push(color);
                }
                $scope['chart' + pollID].data.datasets[0].data = pollDataPoints;
                $scope['chart' + pollID].data.labels = pollLabels;
                $scope['chart' + pollID].data.datasets[0].backgroundColor = backgroundColors;
                $timeout(function() {
                    $scope['chart'+pollID].update();
                }, 200);
            });
        
        }
        
        $scope.submitOption = (pollID) => {
            var pollData = $scope.poll;
            var optionName = $('input[name="options' + pollID + '"]:checked').val();
            var optionData = _.each(pollData.options, (el, ind, list) => { if (el.name == optionName) { el.count++; } });
            pollData.options = optionData;
            if ($('input[name="options' + pollID + '"]:checked').val() == undefined) { //means none are checked
                $('#optionResultPoll' + pollID).text("No option selected, please select an option and try again.");
            }
            else {
                //update the poll options with the incremented count in database
                //use HTTP PUT 
                pollService.updatePollCount(pollID, pollData).then((results) => {
                    if(results.votedAlready == true){
                        alert('You have previously voted on this poll and cannot vote again.');
                    }
                    else{
                        $scope.updateChart(pollID);
                        $('#optionResultPoll_' + pollID).text("You chose " + optionName);
                    }
                    
                });
            }
        };
    }]);
    
    // create the controller and inject Angular's $scope
    votingApp.controller('headerController', ['$scope', '$resource', '$route', 'pollService', function ($scope, $resource, $route, pollService) {
        var apiUrl = '/api/:id';
        pollService.isAuth().then(function(result) {
            $scope.isAuthenticated = result.isAuthenticated;
            $(document).ready(() => {
                if($scope.isAuthenticated){
                    $.get(apiUrl, (result) => {
                        $('#display-name').text(result.google.displayName);
                    });
                }
            });
        });
    }]);
    
    // create the controller and inject Angular's $scope
    votingApp.controller('loginController', ['$scope', '$resource', '$route', function ($scope, $resource, $route) {
        
    }]);
    votingApp
        .controller('indexVotingController', ['$scope', '$resource', 'pollService', '$q', '$window', function($scope, $resource, pollService, $q, $window) {

            $scope.getPolls = function() {
                var deferred = $q.defer();
                pollService.getPolls().then(function(results) {
                        $scope.polls = results;
                        if($scope.polls.length == 0){
                            $scope.noPolls = true;
                        }
                        _.each($scope.polls, function(el) {
                            el.metadata.createDateLocal = moment(el.metadata.createDate).format('MMMM DD, YYYY');
                        })
                        deferred.resolve(results);
                        pollService.isAuth().then(function(res) {
                            $scope.isAuthenticated = res.isAuthenticated;
                        });
                    },
                    function(error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            $scope.getPolls();

            $scope.showPollDetails = function(pollID) {
                $window.location.href = '/#!/poll/' + pollID;
            }


            $scope.createNewPoll = false;

            $scope.option = [];
            $scope.options = [1, 2, 3];

            $scope.newPollSubmitted = false;

            $scope.addNewPoll = () => {
                $scope.newPollSubmitted = true;
                var optionObject = _.map($scope.option, (val) => { return { 'name': val, 'count': 0 }; });
                var pollDataObject = {
                    'newPollName': $scope.newPollName,
                    'newPollDesc': $scope.newPollDesc,
                    'optionObject': optionObject
                };
                pollService.savePoll(pollDataObject).then(function(result) {
                    if (result.err) { //means there is an error
                        console.log(result.err);
                        $('#pollResult').text('Something went wrong, your poll was not saved. Try again later!');
                    }
                    else {
                        $('#pollResult').text('New poll saved successfully. Check it out!');
                        $scope.resetNewPollForm();
                        $scope.getPolls();
                    }
                });

            };
            
            $scope.resetNewPollForm = () => {
                $scope.option = [];
                $scope.options = [1, 2, 3];
                $scope.form.$setPristine();
                $scope.form.$setUntouched();
                $scope.newPollName = "";
                $scope.newPollDesc = "";
                $('input[name*="option"]').val("");
                
            };
    
            $scope.showForm = () => {
                $scope.createNewPoll = true;
            };
            
            $scope.updateOptions = (x) => {
                $scope.option[x - 1] = $("#option" + x).val();
            };
            
            $scope.addOption = () => {
                $scope.options.push($scope.options.length + 1);
            };
    

        }]);
    votingApp
        .controller('profileController', ['$scope', '$resource', 'pollService', '$window', function($scope, $resource, pollService, $window) {
            var polls = $resource('/api/polls');
    
            $scope.getPolls = function() {
                pollService.getPolls().then(function(results) {
                    $scope.polls = results;
                    if($scope.polls.length == 0){
                        $scope.noPolls = true;
                    }
                    _.each($scope.polls, function(el) {
                            el.metadata.createDateLocal = moment(el.metadata.createDate).format('MMMM DD, YYYY');
                    });
                    pollService.isAuth().then(function(res) {
                        $scope.isAuthenticated = res.isAuthenticated;
                    });
                });
            };
            
            $scope.showPollDetails = function(pollID) {
                $window.location.href = '/#!/poll/' + pollID;
            }
    
            $scope.deletePoll = function(pollID) {
                $scope.poll = {
                    action: 'delete',
                    actionID: pollID
                };
                $scope['poll' + pollID + 'ActionTaken'] = true;
                $('#pollResults' + pollID).innerHTML = 'Deleting poll ' + pollID;
                pollService.deletePoll(pollID).then((res) => {
                    $('#pollContainer' + pollID).remove();
                    $scope.getPolls();
                })
            };
    
            $scope.getPolls();
            
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