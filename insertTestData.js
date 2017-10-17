'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var Poll = require('./app/models/polls.js');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI, {
	useMongoClient: true
});
mongoose.Promise = global.Promise;

/**
 * @description This file removes polls from the clementinejs.polls collection 
 * that were created on September 27, 2017 and inserts 4 test poll documents 
 * into the collection
 */

Poll.remove({ "metadata.createDate": "September 27, 2017" }, function(err) {
	if(err) throw err;
	var poll1 = new Poll({
		pollID: 1,
		metadata: {
	        name: "Test poll 1",
	        description: "Test poll data 1",
	        createDate: "September 27, 2017",
	        createdBy: "115186002489441654144"
	    },
	    options: [
	    	{ name: "hello", count: 1 },
	    	{ name: "goodbye", count: 3 },
	    	{ name: "what's up", count: 5 },
		]
	});
	
	var poll2 = new Poll({
		pollID: 2,
		metadata: {
	        name: "Test poll 2",
	        description: "Test poll data 2",
	        createDate: "September 27, 2017",
	        createdBy: "115186002489441654144"
	    },
	    options: [
	    	{ name: "hello", count: 2 },
	    	{ name: "goodbye", count: 4 },
	    	{ name: "what's up", count: 6 },
	    	{ name: "how are you", count: 11 }
    	]
	});
	
	var poll3 = new Poll({
		pollID: 3,
		metadata: {
	        name: "Test poll 3",
	        description: "Test poll data 3",
	        createDate: "September 27, 2017",
	        createdBy: "115186002489441654144"
	    },
	    options: [
	    	{ name: "hello", count: 0 },
	    	{ name: "goodbye", count: 1 },
	    	{ name: "what's up", count: 2 },
	    	{ name: "how are you", count: 10 },
	    	{ name: "no way, hello", count: 20 }
		]
	});
	
	var poll4 = new Poll({
		pollID: 4,
		metadata: {
	        name: "Test poll 4",
	        description: "Test poll data 4",
	        createDate: "September 27, 2017",
	        createdBy: "115186002489441654144"
	    },
	    options: [
	    	{ name: "hello", count: 10 },
	    	{ name: "goodbye", count: 12 },
	    	{ name: "what's up", count: 75 },
	    	{ name: "how are you", count: 10 },
	    	{ name: "no way, hello", count: 20 },
	    	{ name: "wow, this is unreal", count: 99 }
		]
	});
	
	poll1.save(function(err) {
		if(err) throw err;
		console.log('saved successfully');
		poll2.save(function(err) {
			if(err) throw err;
			console.log('saved successfully');
			poll3.save(function(err) {
				if(err) throw err;
				console.log('saved successfully');
				poll4.save(function(err) {
					if(err) throw err;
					console.log('saved successfully');
					process.exit(0);
				});
			});
			
		});
	});
	
	
	
});


