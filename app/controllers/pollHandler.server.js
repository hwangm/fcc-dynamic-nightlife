'use strict';

var Polls = require('../models/polls.js');

function PollHandler () {

	this.getPolls = function (req, res) {
		Polls
			.find({ 'metadata.createdBy': req.user.github.id }, { '_id': false })
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

}

module.exports = PollHandler;
