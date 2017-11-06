'use strict';
module.exports = {
	'googleAuth': {
		'consumerKey': process.env.GOOGLE_KEY,
		'consumerSecret': process.env.GOOGLE_SECRET,
		'callbackURL': process.env.APP_URL + 'auth/google/callback'
	},
	'yelpAuth': {
		'apiUrl': 'https://api.yelp.com/v3/businesses/search',
		'bearerToken': process.env.YELP_ACCESS_TOKEN
	}
};
