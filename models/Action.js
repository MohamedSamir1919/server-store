const mongoose = require('mongoose');

const Action = new mongoose.Schema({
    visitor:{type: mongoose.Schema.Types.ObjectId, ref: 'Visitor'},
    name:{type:String},
    description:{type:String}
    
  },{timestamps:true});

  module.exports = mongoose.model("Action",Action)