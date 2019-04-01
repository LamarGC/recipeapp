const express = require("express"),
      app     = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  port = 3000;

mongoose.connect("mongodb://localhost/recipeapp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var recipeSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Recipe = mongoose.model("Recipe", recipeSchema);

/*Recipe.create(
	{
		name:"pasta", 
		image: "https://c3.staticflickr.com/5/4029/4410054560_1b2e236aa5_z.jpg"
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
			res.render("recipes", {recipes:allRecipes});
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
	var newRecipe = {name:name, image:image};
	Recipe.create(newRecipe, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/recipes");
		}
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));