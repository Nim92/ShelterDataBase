var express = require("express");
var router = express.Router();
var Shelter = require("../models/shelters");
var middleware = require("../middleware");


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
router.post("/", middleware.isLoggedIn, function(req, res){
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
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("shelters/new");
})

//SHOW - Show info about one shelter
router.get("/:id", function(req, res){
	//find shelter with provided ID
	Shelter.findById(req.params.id).populate("comments").exec(function(err, foundShelter){
		if(err || !foundShelter){
			req.flash("error", "Shelter blev ikke fundet");
			console.log(err);
			res.redirect("back")
		} else {
			//render show template with that shelter
			res.render("shelters/show", {shelter: foundShelter});
		}
	});
});

//Edit shelter route
router.get("/:id/edit", middleware.checkShelterOwnership, function(req, res){
    Shelter.findById(req.params.id, function(err, foundShelter){
        res.render("shelters/edit", {shelter: foundShelter});
    });
});

//Update shelter route
router.put("/:id", middleware.checkShelterOwnership, function(req, res){
	// find and update the correct shelter
	Shelter.findByIdAndUpdate(req.params.id, req.body.shelter, function(err, updatedShelter){
		if(err){
			res.redirect("/shelters");
		} else {
			// redirect to show page
			res.redirect("/shelters/" + req.params.id);
		}
	});
	
});

// Destroy shelter route
router.delete("/:id", middleware.checkShelterOwnership, function(req, res){
	Shelter.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/shelters");
		} else {
			res.redirect("/shelters");
		}
	});
});


module.exports = router;