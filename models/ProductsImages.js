const mongoose = require('mongoose');

const ProductsImages = new mongoose.Schema({
    slug:{type: mongoose.Schema.Types.ObjectId, ref: 'Slug'},
    
    image:String,
    // product:{type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    
  },{timestamps:true});

  module.exports = mongoose.model("ProductsImages",ProductsImages)