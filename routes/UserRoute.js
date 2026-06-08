const express = require("express")
const router = express.Router();
const User = require("../models/User");
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const jwt = require('jsonwebtoken')

router.post("/get-users",verifyTokenAndAdmin,async(req,res)=>
{

    try{

        const users = await User.find();
        res.status(200).json(users)
    }catch(err){
        res.json(err)
    }

})
router.post("/",async(req,res)=>{
     try{

    




            const body = await req.body;
            const {password,...u} = body
            const user = await User.find({email : body.email})
            if(user.length > 0){
                res.status(302).json("You allready joined")
            }
            if(u.isAdmin){
 const token = await req.get("Authorization")?.split(" ")[1]
    if(token){

      const user = await  jwt.verify(token,process.env.JWT_PASS)
      
      if(user.isAdmin){

           const cryptoPass = cryptoJS.AES.encrypt(password,process.env.CRYPTO_JS_PASS)
                
                const newUser = Object.assign(u,{password:cryptoPass,isAdmin:true})
                await User.create(newUser)
                await newUser.save();
                const token = jsw.sign({user:u},process.env.JWT_PASS)
                console.log("token",token)
                console.log(token)
                res.status(200),json(token)
            
    }
    else{
        res.status(302).json("you are not allowed")
    }
    }

            }
            else{
                const cryptoPass = cryptoJS.AES.encrypt(password,process.env.CRYPTO_JS_PASS)
                
                const newUser = Object.assign(u,{password:cryptoPass})
                await User.create(newUser)
                await newUser.save();
                const token = jsw.sign({user:u},process.env.JWT_PASS)
                console.log("token",token)
                console.log(token)
                res.status(200),json(token)
            }
    
        }  catch(err){
            res.json(err)
        }
})
router.post("/del",verifyToken,async(req,res)=>{
        try{
            const user = await req.user
            if(user.isAdmin){

                const body = await req.body;
                const deletedOne = await User.findByIdAndDelete(body.id)
            res.status(200).json(`${deletedOne.username} has been deleted`)
            }else res.status(409).json("How dare u !!")
        }
        catch(err){
            res.json(err)
        }   
})

module.exports = router;
