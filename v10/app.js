var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
    Shelter 	= require("./models/shelters"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

var commentRoutes    = require("./routes/comments"),
    shelterRoutes 	 = require("./routes/shelters"),
    indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost/shelter_db_v10", { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB(); //seed the database


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

app.use("/", indexRoutes);
app.use("/shelters", shelterRoutes);
app.use("/shelters/:id/comments", commentRoutes);



app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The Shelter server has started!");
});