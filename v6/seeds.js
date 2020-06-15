var mongoose = require("mongoose");
var Shelter = require("./models/shelters")

var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Kerteminde shelterplads", 
        image: "https://gdkfiles.visitdenmark.com/files/435/435_308996.jpg?width=610&height=343&mode=crop",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Christianshøj Shelterplads", 
        image: "https://gdkfiles.visitdenmark.com/files/454/178572_Christianshj_hrvejengdk.jpg?width=610&height=343&mode=crop",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Millinge shelterplads", 
        image: "https://bookenshelter.dk/wp-content/uploads/2015/05/millinge-klint-1024x683.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   //Remove all Shelters
   Shelter.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Shelters!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few Shelters
            data.forEach(function(seed){
                Shelter.create(seed, function(err, shelter){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a Shelter");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    shelter.comments.push(comment);
                                    shelter.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;