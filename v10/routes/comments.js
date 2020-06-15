var express = require("express");
var router = express.Router({mergeParams: true});
var Shelter = require("../models/shelters");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.post("/", middleware.isLoggedIn, function(req, res){
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

// Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {shelter_id: req.params.id, comment: foundComment});
		}
	});
});

// Comments update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/shelters/" + req.params.id);
		}
	});
});

//coments destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/shelters/" + req.params.id);
       }
    });
});


module.exports = router;