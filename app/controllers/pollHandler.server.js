'use strict';

var Polls = require('../models/polls.js');
var Users = require('../models/users.js');
var moment = require('moment');

function votedOnAlreadyByID(userID, pollID, callback) {
	Users
		.findOne({'google.id': userID})
		.exec((err, data) => {
			if(err) { console.log(err); }
			if(data.pollsVotedOn.indexOf(pollID.toString()) != -1) { //they've voted on the poll before
				callback(null, true);
			}
			else {
				callback(null, false);
			}
		});
};

function votedOnAlreadyByIP(ipAddr, pollID, callback){
	Users
		.findOne({'ipAddress': ipAddr})
		.exec((err, data) => {
			if(err) { console.log(err); }
			if(data == null) { //no user found, create a new one
				var u = new Users();
				u.ipAddress = ipAddr;
				u.pollsVotedOn = [];
				u.save((err, data) => {
					if(err) console.log(err);
					callback(null, false);
				});
			}
			else if(data.pollsVotedOn.indexOf(pollID.toString()) != -1) { //they've voted on the poll before
				callback(null, true);
			}
			else {
				callback(null, false);
			}
		});
};

function PollHandler () {
	
	this.getPolls = function (req, res) {
		Polls
			.find({ 'metadata.createdBy': req.user.google.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};
	
	this.getAllPolls = function (req, res) {
		Polls
			.find({ }, { '_id': false})
			.exec(function (err, result) {
				if(err) throw err;
				res.json(result);
			});
	};
	
	this.getOnePoll = function (req, response) {
		Polls
			.findOne({ 'pollID': req.params.id })
			.exec(function(err, result) {
				if (err) { throw err; }
				response.json(result);
			});
	};
	
	this.addPoll = function (req, response) {
		Polls
			.find({ })
			.sort({pollID: -1})
			.limit(1)
			.exec((err, result) => {
				if(err) response.status(500).send(err);
				else {
					var newPollID = 1;
					if (result.length != 0) newPollID = result[0].pollID + 1;
					Polls
						.create({
							pollID: newPollID,
							metadata: {
								name: req.body.pollName,
								description: req.body.pollDesc,
								createDate: moment().format(),
								createdBy: req.user.google.id
							},
							options: req.body.options
						}, (error, saveResult) => {
							if(error) response.status(500).send(error);
							else response.send(saveResult);
						});
				}
			});
	};
	
	this.removePoll = function (req, response) {
		Polls
			.remove({ 'pollID': req.params.id })
			.exec((err, data) => {
				if(err) { response.json(err); }
				response.json(data);
			});
	};
	
	this.updatePoll = function (req, response) {
		if(req.user !== undefined){
			votedOnAlreadyByID(req.user.google.id, req.params.id, (err, votedAlready) => {
				if (err) { response.json({'error': err}); }
				if (votedAlready) {
					response.json({ 'votedAlready': true });
				}
				else {
					Polls //add the vote to the Poll
						.replaceOne({ 'pollID': req.params.id }, req.body.newDoc)
						.exec((err, data) => {
							if (err) {
								response.json(err);
							}
							response.json(data);
						});
					Users //add the Poll to the list of polls user has voted on
						.findOne({ 'google.id': req.user.google.id })
						.exec((err, data) => {
							if (err) {
								console.log(err);
							}
							data.pollsVotedOn.push(req.params.id);
							Users
								.replaceOne({ 'google.id': req.user.google.id }, data)
								.exec((err, data) => {
									if (err) {
										console.log(err);
									}
								});
						});
				}
			});
			
		}
		else{
			votedOnAlreadyByIP(req.ip, req.params.id, (err, votedAlready) => {
				if (err) { response.json({'error': err}); }
				if (votedAlready) {
					response.json({ 'votedAlready': true });
				}
				else {
					Polls //add the vote to the Poll
						.replaceOne({ 'pollID': req.params.id }, req.body.newDoc)
						.exec((err, data) => {
							if (err) {
								response.json(err);
							}
							response.json(data);
						});
					Users //add the Poll to the list of polls user has voted on
						.findOne({ 'ipAddress': req.ip })
						.exec((err, data) => {
							if (err) {
								console.log(err);
							}
							data.pollsVotedOn.push(req.params.id);
							Users
								.replaceOne({ 'ipAddress': req.ip }, data)
								.exec((err, d) => {
									if (err) {
										console.log(err);
									}
							});
						});
				}
			});
		}
	};
	
	
}

module.exports = PollHandler;
