const mongoose = require('mongoose');

const Post = new mongoose.Schema({
    // title:{type: mongoose.Schema.Types.ObjectId, ref: 'Visitor'},
    title:{type:String},
    post:{type:String},
    pic:{type:String},

    
  },{timestamps:true});

  module.exports = mongoose.model("Post",Post)