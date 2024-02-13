const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    fname:{
        type : String ,
        /*require : true,
        trim : true*/
    },
    email:{
        type : String ,
        /*require : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not valid email");
            }
        }*/
    },

    password:{
        type : String ,
        require : true,
        minlength: 6
    },
   cpassword:{
        type : String ,
        require : true,
        minlength: 6
    },
    
})

module.exports=mongoose.model("users",userSchema);