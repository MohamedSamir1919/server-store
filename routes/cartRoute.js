const express = require("express")
const router = express.Router();
const Category = require("../models/Category");
const { verifyToken } = require("./verifyToken");
const Cart = require("../models/Cart");

router.post("/",verifyToken,async(req,res)=>
    {
    
        try{
            const body = await req.body
            const cart = {...body,user:req.user._id}
            const newCart = await Cart.create(body)
            res.status(200).json(newCart)
        }catch(err){
            res.json(err)
        }
    
    })

    module.exports = router;