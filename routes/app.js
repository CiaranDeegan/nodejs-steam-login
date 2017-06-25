const express = require('express'),
	router = express.Router(),
	SteamCommunity = require('steamcommunity'),
	community = new SteamCommunity(),
	path = require('path');

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

router.get('/account', ensureAuthenticated, function(req, res) {
	res.sendFile(path.join(__dirname, '../public', 'account.html'));
});

router.get('/inventory', ensureAuthenticated, function(req, res) {
	res.sendFile(path.join(__dirname, '../public', 'inventory.html'));
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