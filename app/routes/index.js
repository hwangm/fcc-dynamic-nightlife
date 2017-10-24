'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var pollHandler = new PollHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/layout.html');
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
	
	app.route('/api/polls')
		.get(isLoggedIn, pollHandler.getPolls);
		
	app.route('/api/polls/:id')
		.get(pollHandler.getOnePoll)
		.post(pollHandler.addPoll)
		.put(pollHandler.updatePoll)
		.delete(isLoggedIn, pollHandler.removePoll);
		
	app.route('/api/allPolls')
		.get(pollHandler.getAllPolls);
		
	app.route('/api/addNewPoll')
		.post(pollHandler.addPoll);
		
	app.route('/api/isAuth')
		.get((req, res) => {
			if(req.user !== undefined) {
				res.json({ isAuthenticated: true });
			}
			else res.json({ isAuthenticated: false });
		})

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user);
		});
	
	//add twitter auth option
	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));
	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
	//add google auth option
	app.route('/auth/google')
		.get(passport.authenticate('google', { scope: 'openid profile' }));
	app.route('/auth/google/callback')
		.get(passport.authenticate('google', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

};
