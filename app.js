var express = require('express'),
	passport = require('passport'),
	session = require('express-session'),
	SteamStrategy = require('passport-steam').Strategy,
	authRoutes = require('./routes/auth'),
	config = require('./config.js');

var appBaseURL = "http://localhost:3000";
var port = process.env.PORT || 3000;
var userSteamProfile;

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	done(null, id);
});

passport.use(new SteamStrategy({
	returnURL: appBaseURL + '/auth/steam/return',
	realm: appBaseURL,
	apiKey: config.steam_api_key
}, function(identifier, profile, done){
	process.nextTick(function()
	{
		userSteamProfile = profile;
		profile.identifier = identifier;
		return done(null, profile);
	})
}));

var app = express();
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');

app.use(session({
	secret: 's3cr3tStr1nG',
	saveUninitialized: false,
	resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
//Point to static asset directory
app.use(express.static(__dirname + 'public'));

app.get('/', function(req, res){
	res.render('index', {user: req.user, profile: userSteamProfile});
});

app.get('/account', ensureAuthenticated, function(req, res){
	res.render('account', {user: req.user, profile: userSteamProfile});
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.use('/auth', authRoutes);

app.listen(port, function(){
	console.log('Listening on port ' + port);
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect('/');
}