var express = require("express");
var router = express.Router({mergeParams: true});
var Shelter = require("../models/shelters");
var Comment = require("../models/comment");


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
					comment.author.id = req.user._id;
				    comment.author.username = req.user.username;
				    //save comment
				    comment.save();
					//connect new comment to shelter
					shelter.comments.push(comment);
					shelter.save();
					console.log(comment);
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