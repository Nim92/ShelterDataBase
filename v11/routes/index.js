var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
//var middleware = require("../middleware");

// root route
router.get("/", function(req, res){
	res.render("landing");
});


//  ===========
// AUTH ROUTES
//  ===========

//show register form
router.get("/register", function(req, res){
	res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Velkommen to Shelter databasen " + user.username + "!");
			res.redirect("/shelters")
		});
	});
});

//  ===========
// LOGIN ROUTES
//  ===========

//show login form
router.get("/login", function(req, res){
	res.render("login")
});

// handling login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/shelters",
		failureRedirect: "/login"
	}), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
	req.flash("success", "Du er nu logget ud!");
    res.redirect("/shelters");
});


module.exports = router;