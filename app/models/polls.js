'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    metadata: {
        name: String,
        description: String,
        createDate: String,
        createdBy: String
    },
    options: Object,
	github: {
		id: String,
		displayName: String,
		username: String,
      publicRepos: Number
	}
});

module.exports = mongoose.model('Poll', Poll);
