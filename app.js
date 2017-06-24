const express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	session = require('express-session'),
	SteamStrategy = require('passport-steam').Strategy,
	authRoutes = require('./routes/auth'),
	appRoutes = require('./routes/app'),
	User = require('./models/user'),
	config = require('./config');

mongoose.connect(config.db_url);

//Determine data to be stored in session
passport.serializeUser(function(user, done) {
	//save JSON data to session
	done(null, user._json);
});

//Match session data with DB data and parse
passport.deserializeUser(function(obj, done) {
	//Search DB for user with session's steam ID
	User.findOne({steam_id: obj.steamid},
		(err, user) => {
			//Fetched object is attached to request object (req.user)
			done(err, user);
		});
});

//Specify Passport authentication strategy (Steam)
passport.use(new SteamStrategy({
	returnURL: config.app_base_url + '/auth/steam/return',
	realm: config.app_base_url,
	apiKey: config.steam_api_key
}, function(identifier, profile, done) {
	//Check if user exists in DB
	User.findOne({steam_id: profile.id}, function(err, user) {
		if(err) throw err;
		if(!user) {
			//User does not exist, define new user
			var newUser = User({
				steam_id: profile.id,
				username: profile.displayName,
				photo_url: profile.photos[2].value
			});
			//Save new user to DB
			newUser.save(function(err) {
				if(err) throw err;
				console.log('New user ' + profile.displayName + '[' + profile.id + '] created');
			});
		}
	});
	profile.identifier = identifier;
	return done(null, profile);
}));

const app = express();

//Define view engine and template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//Initialise session
app.use(session({
	secret: 's3cr3tStr1nG',
	saveUninitialized: false,
	resave: true
}));

//Authentication middleware
app.use(passport.initialize());
app.use(passport.session());

//Point to static asset directory
app.use(express.static(__dirname + 'public'));

//Define routes
app.use('/', appRoutes);
app.use('/auth', authRoutes);

//Start server
app.listen(config.port, function(){
	console.log('Listening on port ' + config.port);
});