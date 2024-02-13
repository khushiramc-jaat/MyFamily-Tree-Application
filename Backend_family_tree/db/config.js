const mongoose=require("mongoose");


    mongoose.connect("mongodb://127.0.0.1:27017/FamilyTreeApp")
.then(()=>console.log("database is connected"))
.catch((error)=>console.log("database is not connected"));  



