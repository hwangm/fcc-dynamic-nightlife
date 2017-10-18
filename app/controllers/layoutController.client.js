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
                Poll.
                    save(null, {
                            'pollName': pollObject.newPollName,
                            'pollDesc': pollObject.newPollDesc,
                            'options': pollObject.optionObject
                        })
                        .$promise;
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
    votingApp.controller('headerController', ['$scope', '$resource', '$route', 'pollService', function ($scope, $resource, $route, pollService) {
        pollService.isAuth().then(function(result) {
            $scope.isAuthenticated = result.isAuthenticated;
        });
        
        var profileId = document.querySelector('#google-id') || null;
        var profileUsername = document.querySelector('#google-username') || null;
        var googleName = document.querySelector('#google-name');
        var displayName = document.querySelector('#display-name');
        var apiUrl = appUrl + '/api/:id';

        function updateHtmlElement(data, element, userProperty) {
            element.innerHTML = data[userProperty];
        }

        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data) {
            var userObject = JSON.parse(data);
            if (displayName !== null) {
                updateHtmlElement(userObject.google, displayName, 'displayName');
            }
        }));
    }]);
    
    // create the controller and inject Angular's $scope
    votingApp.controller('loginController', ['$scope', '$resource', '$route', function ($scope, $resource, $route) {
        
    }]);
    votingApp
        .controller('indexVotingController', ['$scope', '$resource', 'pollService', function($scope, $resource, pollService) {
            var isAuthenticated = $resource('/api/isAuth');

            $scope.getPolls = function() {
                pollService.getPolls().then(function(results) {
                    $scope.polls = results;
                    pollService.isAuth().then(function(res) {
                        $scope.isAuthenticated = res.isAuthenticated;
                    });
                });
            };
        
            $scope.getPolls();
    
            $scope.showPollDetails = (id) => {
                if ($scope['showDetails' + id]) $scope['showDetails' + id] = false;
                else $scope['showDetails' + id] = true;
                $scope.initChart(id);
            };
    
            $scope.initChart = (id) => {
                var pollData = _.find($scope.polls, (el) => { return el.pollID == id }); //find the poll data matching poll ID
                var pollLabels = [],
                    pollDataPoints = [],
                    backgroundColors = [];
    
                for (var x of pollData.options) { //populate the labels and datapoints
                    pollLabels.push(x.name);
                    pollDataPoints.push(x.count);
                    let r = Math.floor(Math.random() * 200);
                    let g = Math.floor(Math.random() * 200);
                    let b = Math.floor(Math.random() * 200);
                    let color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
                    backgroundColors.push(color);
                }
                var ctx = document.getElementById('pollChart' + id).getContext('2d');
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
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false
                    }
                });
            }
    
            $scope.submitOption = (pollID) => {
                var pollData = _.find($scope.polls, (el) => { return el.pollID == pollID }); //find the poll data matching poll ID
                var optionName = $('input[name="options' + pollID + '"]').val();
                var optionData = _.each(pollData.options, (el, ind, list) => { console.log(el); if (el.name == optionName) { el.count++; } });
                pollData.options = optionData;
    
                //update the poll options with the incremented count in database
                //use HTTP PUT 
                pollService.updatePollCount(pollID, pollData).then((results) => {
                    console.log(results);
                    $scope.getPolls();
                });


            };

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
                pollService.savePoll().then((result) => {
                    if (result.err){ //means there is an error
                        console.log(result.err);
                        $('#pollResult').text('Something went wrong, your poll was not saved. Try again later!');
                    }
                    else {
                        $('#pollResult').text('New poll saved successfully. Check it out!');
                    }
                });
            
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
        .controller('profileController', ['$scope', '$resource', function($scope, $resource) {
            var polls = $resource('/api/polls');
    
            $scope.getPolls = function() {
                polls.query(function(results) {
                    $scope.polls = results;
                    if ($scope.polls.length == 0) {
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
                document.getElementById('pollResults' + pollID).innerHTML = 'Viewing poll ' + pollID;
            };
    
            $scope.editPoll = function(pollID) {
                $scope.poll = {
                    action: 'edit',
                    actionID: pollID
                };
                document.getElementById('pollResults' + pollID).innerHTML = 'Editing poll ' + pollID;
            };
    
            $scope.deletePoll = function(pollID) {
                $scope.poll = {
                    action: 'delete',
                    actionID: pollID
                };
                $scope['poll' + pollID + 'ActionTaken'] = true;
                document.getElementById('pollResults' + pollID).innerHTML = 'Deleting poll ' + pollID;
                $resource('/api/polls/' + pollID).delete((res) => {
                    $('#pollContainer' + pollID).remove();
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