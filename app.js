const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var recipes = [
	{name:"noodles", image: "https://c4.staticflickr.com/4/3073/3031492030_e732b28673_z.jpg"},
	{name:"pasta", image: "https://c3.staticflickr.com/5/4029/4410054560_1b2e236aa5_z.jpg"},
	{name:"fish", image: "https://c2.staticflickr.com/3/2437/3585272463_4c4b7d3ce1_z.jpg"},
	{name:"noodles", image: "https://c4.staticflickr.com/4/3073/3031492030_e732b28673_z.jpg"},
	{name:"pasta", image: "https://c3.staticflickr.com/5/4029/4410054560_1b2e236aa5_z.jpg"},
	{name:"fish", image: "https://c2.staticflickr.com/3/2437/3585272463_4c4b7d3ce1_z.jpg"},
	{name:"noodles", image: "https://c4.staticflickr.com/4/3073/3031492030_e732b28673_z.jpg"},
	{name:"pasta", image: "https://c3.staticflickr.com/5/4029/4410054560_1b2e236aa5_z.jpg"},
	{name:"fish", image: "https://c2.staticflickr.com/3/2437/3585272463_4c4b7d3ce1_z.jpg"}
];

//LANDING PAGE
app.get("/", function(req,res){
	res.render("landing");
});

//INDEX
app.get("/recipes", function(req,res){
	res.render("recipes", {recipes:recipes});
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
	recipes.push(newRecipe);
	res.redirect("/recipes");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));