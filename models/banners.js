const mongoose = require('mongoose');

const Banner = new mongoose.Schema({
    name:{type:String},
    title:{type:String},
    arabicTitle:{type:String},
    img:{type:String},
  },{timestamps:true});

  module.exports = mongoose.model("Banner",Banner )