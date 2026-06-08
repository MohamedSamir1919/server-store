const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    title: String,
    slug:{type: mongoose.Schema.Types.ObjectId, ref: 'Slug'},
    description:String,
    price:Number,
    paid:Number,
    stock:Number,
    details:[mongoose.Schema.Types.Mixed],
    published:Boolean,
    img:String,
    collections:[String],
    discount:Number
    
  },{timestamps:true});

  module.exports = mongoose.model("Product",Product)