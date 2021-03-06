var express = require("express");
var router = express.Router();
var Shelter = require("../models/shelters");


// INDEX - show all shelters
router.get("/", function(req, res){
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
router.post("/", isLoggedIn, function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newShelter = {name: name, image: image, description: desc, author:author}
	// create a new shelter and save to DB
	Shelter.create(newShelter, function(err, newlyCreated){
		if(err){
			console.log(err)
		} else {
			//redirect back to shelters page
			console.log(newlyCreated);
			res.redirect("/shelters");
		}
	});
});

//NEW - show form to create new shelter
router.get("/new", isLoggedIn, function(req, res){
	res.render("shelters/new");
})

//SHOW - Show info about one shelter
router.get("/:id", function(req, res){
	//find shelter with provided ID
	Shelter.findById(req.params.id).populate("comments").exec(function(err, foundShelter){
		if(err){
			console.log(err);
		} else {
			//render show template with that shelter
			res.render("shelters/show", {shelter: foundShelter});
		}
	});
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;