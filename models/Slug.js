const mongoose = require('mongoose');

const Slug = new mongoose.Schema({
    category:{type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    code:{type:String,unique:true},
    
  },{timestamps:true});

  module.exports = mongoose.model("Slug",Slug)