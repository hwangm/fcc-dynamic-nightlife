'use strict';

var path = process.cwd();
var YelpHandler = require(path + '/src/app/controllers/yelpHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var yelpHandler = new YelpHandler();
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/dist/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile_voting.html');
		});
	
	app.route('/api/yelp')
		.get(yelpHandler.getBars);
		
	app.route('/api/isAuth')
		.get((req, res) => {
			if(req.user !== undefined) {
				res.json({ isAuthenticated: true });
			}
			else res.json({ isAuthenticated: false });
		})
	
	app.route('/api/user/isGoing')
		.get(isLoggedIn, yelpHandler.isGoing);
	
	app.route('/api/user/countAttendees')
		.get(yelpHandler.countAttendees);
		
	app.route('/api/user')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user);
		})
		.post(isLoggedIn, yelpHandler.saveBarChoice)
		.delete(isLoggedIn, yelpHandler.removeBarChoice);
		
	//add google auth option
	app.route('/auth/google')
		.get(passport.authenticate('google', { scope: 'openid profile' }));
	app.route('/auth/google/callback')
		.get(passport.authenticate('google', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
	
};
