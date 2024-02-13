const express = require("express");
const app = express();
require("./db/config");
const User=require("./db/users.js");
const Nodes=require("./db/Nodes.js");
app.use(express.json());
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PORT=5000;

const JWT_SECRET ="hvdvay6ert72839289fgdfgjhsgfsdhdfhjdfh"

app.use(cors());

// Register Backend Page
app.post("/register",async(req,res)=>{

    const {fname,email,password,cpassword} = req.body;
    const encryptedPassword =await bcrypt.hash(password,10);
    try {
        const oldUser = User.findOne({email});
        if(oldUser==email){
            return res.send({error:"User Exists"});
        }
        await User.create({
            fname,
            email,
            password:encryptedPassword ,
            cpassword:encryptedPassword ,

        });
        
        res.send({status:201})
    
        
    } catch (error) {
        res.send({status:"error"})
    }
});

//Login Backend page
app.post("/login-user",async (req,res) =>{
    const {email,password}= req.body;
    const user = await User.findOne({ email });
    if(!user){
        return res.json({error:"User not found"});
    }
    if(await bcrypt.compare(password , user.password)){
        const token = jwt.sign({} ,JWT_SECRET,{
        });
       
        if(res.status(201)){
            return res.json({status:201,data:token});
        }else{
            return res.json({error:"error"});
        }
    }
    res.json({status:"error", error:"Invalid Password"})


})

// Post the Nodes Data

app.post('/api/nodes', async (req, res) => {
    try {
      const newNodeData = req.body;
      const newNode = new Nodes(newNodeData);
      await newNode.save();
      res.json(newNode);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

    // app.post('/api/nodes', async (req, res) => {
    //     try {
    //     const newNodeData = req.body;
    
    //     // Check if a node with similar details already exists
    //     const existingNode = await Nodes.findOne({ 'details.index': newNodeData.id });
    
    //     if (existingNode) {
    //         // Node with similar details already exists, send a response or handle accordingly
    //         res.status(400).json({ error: 'Node with similar details already exists' });
    //     } else {
    //         // Node with similar details doesn't exist, save the new node
    //         const newNode = new Nodes(newNodeData);
    //         await newNode.save();
    //         res.json(newNode);
    //     }
    //     } catch (error) {
    //     console.error('Error saving node:', error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // });
    


  app.get('/get/api/nodes', async (req, res) => {
    try {
      const nodes = await Nodes.find();
      res.json(nodes);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


//   app.put('/api/update/nodes/:id', async (req, res) => {
//     try {
//       const nodeId = req.params.id;
//       const updatedNodeData = req.body;
//       const updatedNode = await Node.findOneAndUpdate({ _id: nodeId }, updatedNodeData, { new: true });
//       res.json(updatedNode);
//     } catch (error) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

app.put('/api/update/nodes/:id',async(req,res)=>{
    let result = await Nodes.updateOne(
        {index:req.params.id},
        {
            $set : req.body
        }
    )
    res.send(result)
})

// app.put('/api/update/nodes/:id', async (req, res) => {
//     const nodeId = req.params.id;
//     const updatedNodeData = req.body;
  
//     try {
//       // Find the node by ID and update it
//       const updatedNode = await Node.findByIdAndUpdate(nodeId, updatedNodeData);
  
//       // Check if the node was found and updated successfully
//       if (updatedNode) {
//         res.json(updatedNode);
//       } else {
//         res.status(404).json({ error: 'Node not found' });
//       }
//     } catch (error) {
//       console.error('Error updating node:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
  
  app.delete('/api/delete/nodes/:id', async (req, res) => {
    try {
      const nodeId = req.params.id;
      await Nodes.deleteOne({ index: nodeId });
      res.json({ message: 'Node deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.get('/api/get/nodeDetails/:nodeId', async(req, res) => {
    const nodeId = req.params.nodeId;
    const node =await Nodes.find((n) => n.index === nodeId);
  
    if (node) {
      res.json({ details: node.details });
    } else {
      res.status(404).json({ error: 'Node not found' });
    }
  });
  












app.listen(PORT,()=>{
        console.log("server is connected with port number 5000")
 })