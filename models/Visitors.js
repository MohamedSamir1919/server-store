const mongoose = require('mongoose');

const Visitor = new mongoose.Schema({
    channel:{type:String,default:"Website"},
    isActive:{type:Boolean},
    subscribed:{type:String},
    online:Boolean
  },{timestamps:true});

  module.exports = mongoose.model("Visitor",Visitor)