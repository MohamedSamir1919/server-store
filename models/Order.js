const mongoose = require('mongoose');

const Order = new mongoose.Schema({
    
    slug:{type: mongoose.Schema.Types.ObjectId, ref: 'Slug'},
    quantity:Number,
    price:Number,
        details:[mongoose.Schema.Types.Mixed],
     
    invoice:{type: mongoose.Schema.Types.ObjectId, ref: 'Invoice'},
    // user:{type: mongooses.Schema.Types.ObjectId, ref: 'User'},
    discount:Number
    
  },{timestamps:true});

  module.exports = mongoose.model("Order",Order)