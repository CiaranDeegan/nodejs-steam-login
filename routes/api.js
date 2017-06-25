const express = require('express'),
	router = express.Router(),
	SteamCommunity = require('steamcommunity'),
	User = require('../models/user'),
	community = new SteamCommunity();

router.route('/inventory/').get(ensureAuthenticated, function(req, res){
	//GET route (get inventory of logged in user)
	console.log("[API] Getting Inventory " + req.user.steam_id);
	community.getUserInventoryContents(req.user.steam_id, 440, 2, true, (err, inv) => {
		if(err) throw err;
		res.status(200).json(inv);
	});
});

router.route('/inventory/:steam_id').get(ensureAuthenticated, function(req, res){
	//GET route (get inventory with user ID)
	console.log("[API] Getting Inventory " + req.params.steam_id);
	community.getUserInventoryContents(req.params.steam_id, 440, 2, true, (err, inv) => {
		if(err) throw err;
		res.status(200).json(inv);
	});
});

router.route('/user/').get(ensureAuthenticated, function(req, res){
	console.log("[API] Getting User " + req.user.steam_id);
	//GET route (get logged in user)
	User.findOne({steam_id: req.user.steam_id}, function(err, user) {
		if(err) throw err;
		if(user) {
			//User exists, get data
			res.json(user);
		}
		else {
			//User does not exist, 404 not found
			res.status(404).send('Invalid user');
		}
	});
});

router.route('/user/:steam_id').get(ensureAuthenticated, function(req, res){
	console.log("[API] Getting User " + req.params.steam_id);
	//GET route (get user with ID)
	User.findOne({steam_id: req.params.steam_id}, function(err, user) {
		if(err) throw err;
		if(user) {
			//User exists, get data
			res.json(user);
		}
		else {
			//User does not exist, 404 not found
			res.status(404).send('Invalid user');
		}
	});
});

router.route('/auth/loginstatus').get(function(req, res) {
	console.log('[API] Checking a user\'s auth status');
	if(req.isAuthenticated()) return res.json(req.user);
	return res.send(false);
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = router;