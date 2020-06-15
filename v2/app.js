var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/shelter_db", { useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


//SCHEMA SETUP
var shelterSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Shelter = mongoose.model("Shelters", shelterSchema);

// Shelter.create(
// 	{
// 		name: "Kerteminde shelterplads", 
// 		image: "https://gdkfiles.visitdenmark.com/files/435/435_308996.jpg?width=610&height=343&mode=crop",
// 		description: "Dette er shelterpladsen ved Kerteminde, som ligger helt ud til vandet."
// 	}, function(err, shelter){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log("NEWLY CREATED SHELTER: ");
// 			console.log(shelter);
// 		}
// 	});


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
			res.render("index", {shelters: allShelters});
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
	res.render("new.ejs");
})

//SHOW - Show info about one shelter
app.get("/shelters/:id", function(req, res){
	//find shelter with provided ID
	Shelter.findById(req.params.id, function(err, foundShelter){
		if(err){
			console.log(err);
		} else {
			//render show template with that shelter
			res.render("show", {shelter: foundShelter});
		}
	});
})

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The Shelter server has started!");
});