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

	};
	
	this.removePoll = function (req, response) {
		Polls
			.remove({ 'pollID': req.params.id })
			.exec((err, data) => {
				if(err) { response.json(err); }
				response.json(data);
			});
	};
	
	this.editPoll = function (req, res) {
		
	};

}

module.exports = PollHandler;
