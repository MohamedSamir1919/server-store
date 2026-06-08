const mongoose = require('mongoose');
const DynamicAttributes = new mongoose.Schema({
    name:{type:String,required:true},
    value:[String|Number],
    slug:{type: mongoose.Schema.Types.ObjectId, ref: 'Slug'},
  },{timestamps:true});

  module.exports = mongoose.model("Attributes",DynamicAttributes)