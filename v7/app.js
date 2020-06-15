var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Shelter = require("./models/shelters")
var Comment = require("./models/comment")
var User = require("./models/user")
var seedDB = require("./seeds")
var passport = require("passport")
var LocalStrategy = require("passport-local")


mongoose.connect("mongodb://localhost/shelter_db", { useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Best Shelter database in DK",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})

app.get("/", function(req, res){
	res.render("landing");
});


// INDEX - show all shelters
app.get("/shelters", function(req, res){
	//Get all shelters from DB
	Shelter.find({}, function(err, allShelters){
		if(err){
			console.log(err);
		} else {
			res.render("shelters/index", {shelters: allShelters, currentUser: req.user});
		}
	})
});

//CREATE - add new shelter to DB
app.post("/shelters", function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newShelter = {name: name, image: image, description: desc}
	// create a new shelter and save to DB
	Shelter.create(newShelter, function(err, newlyCreated){
		if(err){
			console.log(err)
		} else {
			//redirect back to shelters page
			res.redirect("/shelters");
		}
	});
});

//NEW - show form to create new shelter
app.get("/shelters/new", function(req, res){
	res.render("shelters/new");
})

//SHOW - Show info about one shelter
app.get("/shelters/:id", function(req, res){
	//find shelter with provided ID
	Shelter.findById(req.params.id).populate("comments").exec(function(err, foundShelter){
		if(err){
			console.log(err);
		} else {
			//render show template with that shelter
			res.render("shelters/show", {shelter: foundShelter});
		}
	});
})

// =============
// COMMENTS ROUTES
// =============

app.get("/shelters/:id/comments/new", isLoggedIn, function(req, res){
	//find shelter by id
	Shelter.findById(req.params.id, function(err, shelter){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {shelter: shelter});
		}
	});
});

app.post("/shelters/:id/comments", isLoggedIn, function(req, res){
	// Lookup shelter by id
	Shelter.findById(req.params.id, function(err, shelter){
		if(err){
			console.log(err);
			res.redirect("/shelters");
		} else{
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else{
					//connect new comment to shelter
					shelter.comments.push(comment);
					shelter.save();
					// redirect to shelter show page
					res.redirect('/shelters/' + shelter._id);
				}
			});
		}
	});
});
	
	
//  ===========
// AUTH ROUTES
//  ===========

//show register form
app.get("/register", function(req, res){
	res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/shelters")
		});
	});
});

//  ===========
// LOGIN ROUTES
//  ===========

//show login form
app.get("/login", function(req, res){
	res.render("login")
});

// handling login logic
app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/shelters",
		failureRedirect: "/login"
	}), function(req, res){
});

//logout logic
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/shelters");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The Shelter server has started!");
});