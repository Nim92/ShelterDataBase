var express = require("express");
var router = express.Router({mergeParams: true});
var Shelters = require("../models/shelters");
var comment = require("../models/comments");


// comments new
router.get("/new", isLoggedIn, function(req, res){
	//find shelter by id
	Shelter.findById(req.params.id, function(err, shelter){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {shelter: shelter});
		}
	});
});

// comments create
router.post("/", isLoggedIn, function(req, res){
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

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;