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
router.get("/new", isLoggedIn, function(req,res){
	res.render("recipes/new");
});

//CREATE
router.post("/", isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newRecipe = {name:name, image:image, description:desc, author:author};
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

//EDIT
router.get("/:id/edit", function(req, res){
	Recipe.findById(req.params.id, function(err, foundRecipe){
		if(err){
			res.redirect("/recipes");
		}
		else{
			res.render("recipes/edit", {recipe: foundRecipe});
		}
	});
});


//UPDATE
router.put("/:id", function(req, res){
	Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe){
		if(err){
			res.redirect("/recipes");
		}
		else{
			res.redirect("/recipes/" + req.params.id);
		}
	});
});

//DESTROY
router.delete("/:id", function(req, res){
	Recipe.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/recipes");
		}
		else{
			res.redirect("/recipes")
		}
	});
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;