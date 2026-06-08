const express = require("express")
const router = express.Router();
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const jose = require('jose')
const cryptoJS = require("crypto-js")
// undefined
// const dotenv = require('dotenv');
require('dotenv').config()

// dotenv.config();
router.post('/login',async(req,res)=>{
    try{
        const body = await req.body;
        const user = await User.find({email : body.email})
        console.log("user",user[0])
        if(user.length > 0){
            const {password,...u} = user[0]._doc
            console.log("password",password)
            console.log("u",u)
            const originalPass = cryptoJS.AES.decrypt(password,process.env.CRYPTO_JS_PASS).toString(cryptoJS.enc.Utf8);
            console.log("originalPass",originalPass)

            console.log("originalPass",originalPass)
          

            if(body.password == originalPass){
                const token = jwt.sign(u,process.env.JWT_PASS)
                res.status(200).json(token)
            }
            else {
                res.status(401).json("Wrong password")
            }
        }
        else{
            res.status(403).json("You have to signup")
        }
    }
    catch(err){
        console.log(err)
        console.log("****************************************************")
        res.status(400).json(err)
    }
})

router.post('/',async(req,res)=>{
    try{

        const body = await req.body;
        const {password,...u} = body
        const user = await User.find({email : body.email})
        if(user.length > 0){
            res.status(302).json("You allready joined")
        }
        else{
            const cryptoPass = cryptoJS.AES.encrypt(password,process.env.CRYPTO_JS_PASS).toString();
            const newUser = Object.assign(body,{password:cryptoPass})
            // console.log(newUser)

            await User.create(newUser)


            let token =  jwt.sign(u,process.env.JWT_PASS)

           
            console.log("token",token)
            
            res.status(200).json(token)
        }

    }  catch(err){
        res.json(err)
    }
})

module.exports = router;



  
