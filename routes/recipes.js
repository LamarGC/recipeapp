const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");

//INDEX
router.get("/", function(req,res){
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
router.get("/new", function(req,res){
	res.render("recipes/new");
});

//CREATE
router.post("/", function(req,res){
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
router.get("/:id", function(req,res){
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

module.exports = router;