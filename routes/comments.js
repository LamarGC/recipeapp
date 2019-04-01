const express = require("express");
const router = express.Router({mergeParams: true});
const Recipe = require("../models/recipe.js");
const Comment = require("../models/comment");

//===============
//COMMENTS ROUTES
//===============

//comments new
router.get("/new", isLoggedIn, function(req,res){
	Recipe.findById(req.params.id, function(err, recipe){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {recipe:recipe});
		}
	});
});


//comments create
router.post("/", isLoggedIn, function(req,res){
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

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;