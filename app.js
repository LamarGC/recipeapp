const express = require("express"),
      app     = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  flash = require("connect-flash"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  methodOverride = require("method-override"),
	  Recipe   = require("./models/recipe"),
	  Comment   = require("./models/comment"),
	  User      = require("./models/user"),
	  seedDB   = require("./seeds");
	  port = 3000;

const recipeRoutes = require("./routes/recipes"),
	  commentRoutes = require("./routes/comments"),
	  indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/recipeapp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "1nniH1VAznUoCddAgKB1",
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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/recipes/:id/comments", commentRoutes);
app.use("/recipes", recipeRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));