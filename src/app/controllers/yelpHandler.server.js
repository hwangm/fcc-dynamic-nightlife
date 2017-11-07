'use strict';

var request = require('request');
var configAuth = require('../config/auth');
var user = require('../models/users');
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
					'latitude': response.json.results[0].geometry.location.lat,
					'longitude': response.json.results[0].geometry.location.lng,
					'radius': 16093 //16,093 meter radius for searching, equivalent to 10 miles 
				}
				request
					.get({ url: configAuth.yelp.apiUrl, qs: qs, auth: { bearer: configAuth.yelp.bearerToken } }, (err, result, body) => {
						if(err) { res.json({error: err}); }
						else {res.json(result.body);}
					});
			}
		});
	}
	this.saveBarChoice = (req, res) => {
		user
			.findOneAndUpdate({'google.id': req.user.google.id}, {'barsAttending': req.body.barId})
			.exec((err, data) => {
				if (err) { res.json({'error': err}); }
				else {
					res.json({'success': true});
				}
			});
	}
	this.removeBarChoice = (req, res) => {
		user
			.findOneAndUpdate({'google.id': req.user.google.id}, {'barsAttending': ''})
			.exec((err, data) => {
				if(err) { res.json({'error': err}); }
				else {
					res.json({'success': true});
				}
			});
	}
	this.isGoing = (req, res) => {
		user
			.findOne({'google.id': req.user.google.id})
			.exec((err, data) => {
				if(err) { res.json({'error': err}); }
				else {
					res.json({'isGoing': data.barsAttending==req.query.barId});
				}
			});
	}
}

module.exports = YelpHandler;
