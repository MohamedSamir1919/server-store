const express = require("express")
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("./verifyToken");
const Visitor = require("../models/Visitors")
const Action = require("../models/Action")
const jwt = require("jsonwebtoken")
require('dotenv')
const {verifyTokenAndAdmin} = require('./verifyToken')
router.post("/get-visitor",verifyTokenAndAdmin,async(req,res)=>
{

    try{

        // const user = await req.user
        // if(user?.isAdmin){
            const visitor = await Visitor.find()
            res.status(200).json(visitor)
        // }
        // else res.status(403).status("You are not allowed to do this")
    }catch(err){
        res.json(err)
    }

})
router.post("/actions",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const actions = await Action.find();
        console.log(actions)
        res.status(200).json(actions)
    }catch(err){
        console.log("actions post err",err)
        res.json(err)
    }
})

router.post("/active",async(req,res)=>{
    let body = await req.body
  try{  const visitorToken = await req.get("vToken").split(" ")[1]
    const visitor = jwt.verify(visitorToken,process.env.JWT_PASS)
    const action = await Action.create({name:"visit",description:"visit website",visitor:visitor.newVisitor._id})
    await action.save();
    let activeVisitor = await Visitor.findByIdAndUpdate(visitor.newVisitor._id,{isActive:true,online:true})
    await activeVisitor.save()
}
    catch(err){console.log(err) 
        res.json(err)
    }
})

router.post("/deactive",async(req,res)=>{
   try{ const visitorToken = await req.get("vToken").split(" ")[1]
    const visitor = jwt.verify(visitorToken,process.env.JWT_PASS)
    let activeVisitor = await Visitor.findByIdAndUpdate(visitor.visitor._id,{isActive:false})
}
catch(err){
    console.log(err)
    res.json(err)
}
})
router.post('/visit',async (req,res)=>{
   try{
    const body = await req.body
    const newVisitor = new Visitor({body})
    await newVisitor.save();
    const visitorToken =  jwt.sign({newVisitor}, process.env.JWT_PASS)
    res.status(200).json(visitorToken)
   }
   catch(err){
    console.log(err)
    res.json(err)
   }

})
router.post("/get-user",verifyToken,async(req,res)=>{
    try{

    const usr = await req.user
    const visitorToken = await req.get("vToken").split(" ")[1]

    const visitor = jwt.verify(visitorToken,process.env.JWT_PASS)
    const user = await User.findByIdAndUpdate(usr._id,{visitor:visitor.newVisitor._id})
    await user.save();
    if(user){
        res.status(200).json(user)
    }
}catch(err){
    console.log(err)
    res.status(400).json(err)
}
})
router.post("/subscribe",async(req,res)=>{
    try{
        const body = await req.body
        const visitorToken = await req.get("vToken").split(" ")[1]

    const visitor = jwt.verify(visitorToken,process.env.JWT_PASS)
    const updateVisitor = await Visitor.findByIdAndUpdate(visitor.newVisitor._id,{subscribed:body.email})
    if(updateVisitor){
        res.status(200).json(updateVisitor)
    }
}catch(err){
    console.log(err)
    res.status(400).json(err)
}
})
// router.post("/get-active",verifyToken,async (req,res)=>{
//     const { isOnline } = req.body;
//     const userId = req.headers['user-id'];
  
//     if (isOnline) {
//       onlineUsers[userId] = Date.now();
//     } else {
//       delete onlineUsers[userId];
//     }
  
//     res.sendStatus(200);
// })
router.post('/create-action',async(req,res)=>{
    try{
        const body = await req.body
        console.log(body)
    const visitorToken = await req.get("vToken").split(" ")[1]

    const visitor =  jwt.verify(visitorToken,process.env.JWT_PASS)
    console.log(visitor)
        if(body.description == 'online')
            {const actions = await Action.find({visitor:visitor?.newVisitor?._id,description:"online"})
        actions.forEach(async(element) => {
            const deleteAction = await Action.findByIdAndDelete(element._id)
        });
    }
   
    const newAction = await Action.create({...body,visitor:visitor?.newVisitor?._id,})
    
    
        
    
    res.status(200).json(newAction)
    }catch(err){
        console.log(err)
        res.json(err)
    }
})
module.exports = router;
