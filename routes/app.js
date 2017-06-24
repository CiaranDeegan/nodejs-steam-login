const express = require('express'),
	router = express.Router(),
	SteamCommunity = require('steamcommunity'),
	community = new SteamCommunity();

router.get('/', function(req, res) {
	res.render('index', {user: req.user});
});

router.get('/account', ensureAuthenticated, function(req, res) {
	res.render('account', {user: req.user});
});

router.get('/inventory', ensureAuthenticated, function(req, res) {
	community.getUserInventoryContents(req.user.steam_id, 440, 2, true, (err, inv) => {
		if(err) throw err;
		res.render('inventory', {user: req.user, items: inv});
	});
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = router;