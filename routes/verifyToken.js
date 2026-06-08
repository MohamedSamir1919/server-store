const jwt = require('jsonwebtoken')
const express = require('express')
require('dotenv').config()
const verifyToken = async(req, res, next)=>{
  try{  const token = await req.get("Authorization")?.split(" ")[1]
    if(token){

      const user = await  jwt.verify(token,process.env.JWT_PASS)
      
      req.user = user
      next();}
      else return res?.status(403).json("You are not allowed to access")
    }
    catch(err){
        return res?.status(400).json(err)
    }

}
const verifyTokenAndAdmin = async(req,res,next) => { 
  try{
   
    const token = await req.get("Authorization")?.split(" ")[1]
    console.log(token)
    if(token){

      const user = jwt.verify(token,process.env.JWT_PASS)
      
    const isAdmin = user.isAdmin;
    if(isAdmin){
      next();
    } else {
      console.log(`${req} try to do somthing`)
      return res?.status(403).json("You are not allowed to access")
    }
   
  }
else{
  return res?.status(401).json("You are not authanticated")
}
}
  catch(err){
    console.log(err);
    return res?.status(400).json(err)
  }
}


const ErrorHandler = async(req, res, next)=>{
  try{  

      next();
    
    }
    catch(err){
        return res?.status(400).json(err)
    }

}
module.exports = {verifyToken, verifyTokenAndAdmin,ErrorHandler}