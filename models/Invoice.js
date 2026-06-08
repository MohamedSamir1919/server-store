const mongoose = require('mongoose');

const Invoice = new mongoose.Schema({
    price:Number,
    paid:Number,
    discount:Number,
    id:String,
    status:String,
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    
  },{timestamps:true});

  module.exports = mongoose.model("Invoice",Invoice)