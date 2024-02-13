const express=require("express");
require("./db/config");
const User=require("./db/users.js");
const cors=require("cors");


const PORT=5000;

const app=express();
app.use(cors({
    origin:"http://localhost:3000",
}));

app.use(express.json());

app.post("/Register",async(req,res)=>{
    const user=new User(req.body);
    const result=await user.save()
    res.send(result);
})

app.listen(PORT,()=>{
    console.log("server is connected with port number 5000")
})


