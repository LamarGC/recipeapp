const mongoose = require("mongoose");
var Recipe = require("./models/recipe");
var Comment = require("./models/comment");

var data = [
    {
        name: "pasta",
        image: "https://cf-images.us-east-1.prod.boltdns.net/v1/static/1033249144001/37355f45-55ce-4b64-976c-6606c8fd2b34/991b39ed-3eb4-4ae2-96c1-19b8f0593126/1280x720/match/image.jpg",
        description: "this is pasta"
    },
    {
        name: "noodles",
        image: "https://www.modernhoney.com/wp-content/uploads/2018/09/Asian-Stir-Fry-Noodles-3.jpg",
        description: "these are noodles"
    },
    {
        name: "salad",
        image: "https://foodrevolution.org/wp-content/uploads/2018/04/blog-featured-diabetes-20180406-1330.jpg",
        description: "this is a salad"
    },
];

function seedDB(){
    Recipe.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed recipe");
        data.forEach(function(seed){
            Recipe.create(seed, function(err, recipe){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("added recipe");
                    Comment.create(
                        {
                            text: "This food tastes delicious",
                            author: "Chef"
                        }, function(err, comment){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    recipe.comments.push(comment);
                                    recipe.save();
                                    console.log("created new comment");
                                }
                        });
                }
            });
        });
    });
}

module.exports = seedDB;