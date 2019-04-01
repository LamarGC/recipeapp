const express = require("express"),
      app     = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  Recipe   = require("./models/recipe"),
	  seedDB   = require("./seeds");
	  port = 3000;

seedDB();
mongoose.connect("mongodb://localhost/recipeapp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


/*Recipe.create(
	{
		name:"pasta", 
		image: "https://c3.staticflickr.com/5/4029/4410054560_1b2e236aa5_z.jpg",
		description: "add water"
	}, function(err, recipe){
		if(err){
			console.log(err);
		}
		else{
			console.log("newly created recipe");
			console.log(recipe);
		}
});*/



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
			res.render("index", {recipes:allRecipes});
		}
	});
});

//NEW
app.get("/recipes/new", function(req,res){
	res.render("new");
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
	Recipe.findById(req.params.id, function(err, foundRecipe){
		if(err){
			console.log(err);
		}
		else{
			res.render("show", {recipe: foundRecipe});
		}
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));