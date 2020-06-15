var Shelter = require("../models/shelters");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkShelterOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		// is user logged in
			Shelter.findById(req.params.id, function(err, foundShelter){
				if(err){
					req.flash("error", "Shelter blev ikke fundet");
					res.redirect("back");
				} else {
					// does user own the shelter?
				if(foundShelter.author.id.equals(req.user.id)) {
					next();
				} else {
					req.flash("error", "Du har ikke tilladelse til at gøre dette");
					res.redirect("back");
				}
			   }
			});
		} else {
			req.flash("error", "Du skal være logget ind med den rette bruger for at gøre dette");
			res.redirect("back");
		}
}
	

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		// is user logged in
			Shelter.findById(req.params.id, function(err, foundComment){
				if(err){
					res.redirect("back")
				} else {
					// does user own the comment?
				if(foundComment.author.id.equals(req.user.id)) {
					next();
				} else {
					req.flash("error", "Du har ikke tilladelse til at gøre dette")
					res.redirect("back");
				}
			   }
			});
		} else {
			req.flash("error", "Du skal være logget ind for at gøre dette")
			res.redirect("back");
		}
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "Du skal være logget ind for at gøre dette");
    res.redirect("/login");
}


module.exports = middlewareObj;