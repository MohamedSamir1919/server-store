const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
    // title:{type: mongoose.Schema.Types.ObjectId, ref: 'Visitor'},
    title:{type:String},
    comment:{type:String},
    post:{type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    
  },{timestamps:true});

  module.exports = mongoose.model("Comment",Comment)