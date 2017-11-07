'use strict';

var request = require('request');
var configAuth = require('../config/auth');
var googleMapsClient = require('@google/maps').createClient({
  key: configAuth.googleAuth.mapsAPIKey
});

//Yelp Business Search API: https://www.yelp.com/developers/documentation/v3/business_search
function YelpHandler () {
	this.getBars = (req, res) => {
		googleMapsClient.geocode({
			address: req.query.address
		}, function(err, response) {
			if (err) {
				res.json({ 'error': err });
			}
			else if (response.json.status == "ZERO_RESULTS") {
				res.json({ 'error': 'ZERO_RESULTS'});
			}
			else {
				let qs = {
					'term': 'bars',
					'location': 'Sacramento, CA',
					'radius': 16093 //16,093 meter radius for searching, equivalent to 10 miles 
				}
				request
					.get({ url: configAuth.yelp.apiUrl, qs: qs, auth: { bearer: configAuth.yelp.bearerToken } }, (err, result, body) => {
						res.json(result.body);
					});
			}
		});
	}
}

module.exports = YelpHandler;
