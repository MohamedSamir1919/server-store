const express = require("express")
const router = express.Router();
const Category = require("../models/Category");
const { verifyToken } = require("./verifyToken");
const Invoice = require("../models/Invoice");

router.get("/",async(req,res)=>
    {
    
        try{
    
            const category = await Category.find();
            res.status(200).json(category)
        }catch(err){
            res.json(err)
        }
    
    })

    module.exports = router;