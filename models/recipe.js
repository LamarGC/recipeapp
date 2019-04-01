const mongoose = require("mongoose");

var recipeSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

module.exports = mongoose.model("Recipe", recipeSchema);