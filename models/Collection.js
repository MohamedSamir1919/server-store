const mongoose = require('mongoose');

const Collection = new mongoose.Schema({
    name:{type:String,unique:true},
    arabicName:{type:String},
    img:{type:String},
    active:{type:Boolean,default:true},
    slug:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Slug' }]
    
  },{timestamps:true});

  module.exports = mongoose.model("Collection",Collection)