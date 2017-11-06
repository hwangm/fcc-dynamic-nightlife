'use strict';

var request = require('request');
var configAuth = require('../config/auth');

//Yelp Business Search API: https://www.yelp.com/developers/documentation/v3/business_search
function YelpHandler () {
	this.getBars = (req, res) => {
		let qs = {
			'term': 'bars',
			'location': 'Sacramento, CA',
			'radius': 16093 //16,093 meter radius for searching, equivalent to 10 miles 
		}
		request
			.get({ url: 'https://api.yelp.com/v3/businesses/search', qs: qs, auth: { bearer: process.env.YELP_ACCESS_TOKEN }}, (err, result, body) => {
				res.json(result);
			});
	};
}

module.exports = YelpHandler;
