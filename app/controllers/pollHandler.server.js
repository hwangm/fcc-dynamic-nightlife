'use strict';

var Polls = require('../models/polls.js');

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
	
	this.addPoll = function (req, res) {
		Polls
			.find({ })
			.sort({pollID: -1})
			.limit(1)
			.exec((err, result) => {
				if(err) res.json(error);
				var newPollID = 1;
				if (result.length != 0) newPollID = result.pollID + 1;
				Polls
					.create({
						pollID: newPollID,
						metadata: {
							name: req.body.pollName,
							description: req.body.pollDesc,
							createDate: new Date().toDateString(),
							createdBy: req.user.id
						},
						options: req.body.options
					}, (error, saveResult) => {
						if(error) res.json(error);
						res.json(saveResult);
					});
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
		Polls
			.replaceOne({ 'pollID': req.params.id }, req.body.newDoc)
			.exec((err, data) => {
				if (err) {
					response.json(err);
				}
				response.json(data);
			});
	};
	
	this.editPoll = function (req, res) {
		
	};

}

module.exports = PollHandler;
