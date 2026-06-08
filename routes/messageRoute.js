
const jwt = require("jsonwebtoken")
const {verifyTokenAndAdmin} = require('./verifyToken')
const express = require("express")
const router = express.Router();
const Message = require("../models/Message")
router.post("/get-messages",verifyTokenAndAdmin,async(req,res)=>
{

    try{

 
            // const visitor = await Visitor.find()
            // res.status(200).json(visitor)
        }catch(err){
        res.json(err)
    }

})
router.post("/save-message",async(req,res)=>
{

    try{
        const body = await req.body
        
        const visitorToken = await req.get("vToken").split(" ")[1]
        const visitor = jwt.verify(visitorToken,process.env.JWT_PASS)
        console.log(visitor)
        const message = new Message({...body,visitor:visitor.visitor._id})
          await message.save();
          console.log(message)
            res.status(200).json(message)
       }catch(err){
        res.json(err)
    }

})
module.exports = router;
