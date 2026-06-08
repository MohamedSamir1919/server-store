const mongoose = require('mongoose');

const Bromocode = new mongoose.Schema({
    code:String,
    discount:Number,
    
  },{timestamps:true});

  module.exports = mongoose.model("Invoice",Invoice)