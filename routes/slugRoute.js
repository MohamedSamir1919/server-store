const express = require("express")
const router = express.Router();
const { verifyToken } = require("./verifyToken");
const Slug = require("../models/Slug");

router.get("/",async(req,res)=>
    {
    
        try{
    
            const slug = await Slug.find();
            res.status(200).json(slug)
        }catch(err){
            console.log(err)
            res.json(err)
        }
    
    })

    module.exports = router;