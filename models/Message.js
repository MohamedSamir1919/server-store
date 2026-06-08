const mongoose = require('mongoose');

const Message = new mongoose.Schema({
    
    visitor:{type: mongoose.Schema.Types.ObjectId, ref: 'Visitor'},
    email:String,
    name:String,
    message:String,
    
  },{timestamps:true});

  module.exports = mongoose.model("Message",Message)