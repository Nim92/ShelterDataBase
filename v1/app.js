var express = require("express");
var app = express();
var bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


var shelters= [
		{name: "Salmon Creek", image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e5074417c277dd2944ac1_340.jpg"},
		{name: "Bear Camp", image: "https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e5074417c277bd69e48c7_340.jpg"},
		{name: "Milling shelterplads", image: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e5074417c277bd69e48c7_340.jpg"},
		
	];
	

app.get("/", function(req, res){
	res.render("landing");
});


app.get("/shelters", function(req, res){
	res.render("shelters", {shelters: shelters});
});

app.post("/shelters", function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newShelter = {name: name, image: image}
	shelters.push(newShelter);
	//redirect back to shelters page
	res.redirect("/shelters");
});

app.get("/shelters/new", function(req, res){
	res.render("new.ejs");
})

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The Shelter server has started!");
});