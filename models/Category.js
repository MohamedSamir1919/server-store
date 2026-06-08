const mongoose = require('mongoose');

const Category = new mongoose.Schema({
    name:{type:String,unique:true},
    arabicName:{type:String},
    
  },{timestamps:true});

  module.exports = mongoose.model("Category",Category)