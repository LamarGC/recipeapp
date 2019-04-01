const express = require("express"),
      app     = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  Recipe   = require("./models/recipe"),
	  Comment   = require("./models/comment"),
	  User      = require("./models/user"),
	  seedDB   = require("./seeds");
	  port = 3000;


mongoose.connect("mongodb://localhost/recipeapp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
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
	next();
});

//LANDING PAGE
app.get("/", function(req,res){
	res.render("landing");
});

//INDEX
app.get("/recipes", function(req,res){
	Recipe.find({}, function(err, allRecipes){
		if(err){
			console.log(err);
		}
		else{
			res.render("recipes/index", {recipes:allRecipes});
		}
	});
});

//NEW
app.get("/recipes/new", function(req,res){
	res.render("recipes/new");
});

//CREATE
app.post("/recipes", function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newRecipe = {name:name, image:image, description:desc};
	Recipe.create(newRecipe, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/recipes");
		}
	});
});

//SHOW
app.get("/recipes/:id", function(req,res){
	Recipe.findById(req.params.id).populate("comments").exec(function(err, foundRecipe){
		if(err){
			console.log(err);
		}
		else{
			console.log(foundRecipe);
			res.render("recipes/show", {recipe: foundRecipe});
		}
	});
});

//===============
//COMMENTS ROUTES
//===============

app.get("/recipes/:id/comments/new", isLoggedIn, function(req,res){
	Recipe.findById(req.params.id, function(err, recipe){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {recipe:recipe});
		}
	});
});

app.post("/recipes/:id/comments", isLoggedIn, function(req,res){
	Recipe.findById(req.params.id, function(err, recipe){
		if(err){
			console.log(err);
			res.redirect("/recipe");
		}
		else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}
				else{
					recipe.comments.push(comment);
					recipe.save();
					res.redirect("/recipes/" + recipe._id);
				}

			});
		}
	});
});

//AUTH ROUTES

//show register form
app.get("/register", function(req,res){
	res.render("register");
});

//handle sign up logic
app.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/recipes");
		});
	});
});

//show login form
app.get("/login", function(req,res){
	res.render("login");
});

//handle login logic
app.post("/login", passport.authenticate("local",
 	{
		 successRedirect: "/recipes",
		 failureRedirect: "/login"
	}), function(req,res){
});

//logout
app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/recipes");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));