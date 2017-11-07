'use strict';
module.exports = {
	'googleAuth': {
		'consumerKey': process.env.GOOGLE_KEY,
		'consumerSecret': process.env.GOOGLE_SECRET,
		'callbackURL': process.env.APP_URL + 'auth/google/callback',
		'mapsAPIKey': process.env.GOOGLE_MAPS_API_KEY
	},
	'yelp': {
		'apiUrl': 'https://api.yelp.com/v3/businesses/search',
		'bearerToken': process.env.YELP_ACCESS_TOKEN
	}
};
