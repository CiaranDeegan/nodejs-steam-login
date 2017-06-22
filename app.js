var express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	session = require('express-session'),
	SteamStrategy = require('passport-steam').Strategy,
	authRoutes = require('./routes/auth'),
	User = require('./models/user'),
	config = require('./config');

mongoose.connect(config.db_url);

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	done(null, id);
});

passport.use(new SteamStrategy({
	returnURL: config.app_base_url + '/auth/steam/return',
	realm: config.app_base_url,
	apiKey: config.steam_api_key
}, function(identifier, profile, done){
	process.nextTick(function()
	{
		//Check if user exists in DB
		User.find({steam_id: profile.id}, function(err, users){
			if(err) throw err;
			if(users.length === 0)
			{
				//User does not exist, create new entry
				var newUser = User({
					steam_id: profile.id,
					username: profile.displayName,
					photo_url: profile.photos[2].value
				});

				newUser.save(function(err)
				{
					if(err) throw err;
					console.log('New user ' + profile.displayName + '[' + profile.id + '] created');
				});
			}
		});
		profile.identifier = identifier;
		return done(null, profile);
	})
}));

var app = express();
app.set('views', __dirname + '/views');
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

app.get('/', function(req, res)
{
	if(req.user)
	{
		//Find user in DB and pass their user object to the page
		User.find({steam_id: req.user}, function(err, users){
			if(err) throw err;
			res.render('index', {user: users[0]});
		});
	}
	else
	{
		//User has not signed in yet
		res.render('index', {user: req.user});
	}
});

app.get('/account', ensureAuthenticated, function(req, res){
	User.find({steam_id: req.user}, function(err, users){
		if(err) throw err;
		res.render('account', {user: users[0]});
	});
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.use('/auth', authRoutes);

app.listen(config.port, function(){
	console.log('Listening on port ' + config.port);
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()) return next();
	res.redirect('/');
}