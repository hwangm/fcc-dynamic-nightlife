'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    pollID: Number,
    metadata: {
        name: String,
        description: String,
        createDate: String,
        createdBy: String
    },
    options: Array
});

module.exports = mongoose.model('Poll', Poll);
