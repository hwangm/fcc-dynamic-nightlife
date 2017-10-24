'use strict';

var Polls = require('../models/polls.js');
var moment = require('moment');

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
