'use strict';

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
	passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_KEY,
		clientSecret: process.env.GOOGLE_SECRET,
		callbackURL: process.env.APP_URL + 'auth/google/callback'
	}, function(token, tokenSecret, profile, cb) {
		User.findOne({ 'google.id' : profile.id }, function (err, user) {
			if (err) {
				return cb(err);
			}
			if (user) {
				return cb(null, user);
			}
			else{
				var newUser = new User();

					newUser.google.id = profile.id;
					newUser.google.name = profile.name;
					newUser.google.displayName = profile.displayName;
					newUser.nbrClicks.clicks = 0;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return cb(null, newUser);
					});
			}
		})
	}));

};
