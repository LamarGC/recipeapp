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
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					recipe.comments.push(comment);
					recipe.save();
					res.redirect("/recipes/" + recipe._id);
				}

			});
		}
	});
});


//comment edit route
router.get("/:comment_id/edit", function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit", {recipe_id: req.params.id, comment: foundComment});
		}
	});
});

//comment update
router.put("/:comment_id", function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/recipes/" + req.params.id);
		}
	});
})


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;