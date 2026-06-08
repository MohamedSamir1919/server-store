const mongoose = require('mongoose');

const User = new mongoose.Schema({
    
    email:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName:String,
    telephone:Number,
    isAdmin:{type:String,default:false},
   address:String,
    visitor:{type:mongoose.Schema.Types.ObjectId,ref:"Visitor"}
  },{timestamps:true});

  module.exports = mongoose.model("User",User)