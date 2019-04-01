const express = require("express"),
      app     = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  Recipe   = require("./models/recipe"),
	  Comment   = require("./models/comment"),
	  seedDB   = require("./seeds");
	  port = 3000;


mongoose.connect("mongodb://localhost/recipeapp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
//seedDB();


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

app.get("/recipes/:id/comments/new", function(req,res){
	Recipe.findById(req.params.id, function(err, recipe){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {recipe:recipe});
		}
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));