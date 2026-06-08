const mongoose = require('mongoose');

const Cart = new mongoose.Schema({
   product:{type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
   size:String,
   color:String,
   status:String,
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    
  },{timestamps:true});

  module.exports = mongoose.model("Cart",Cart)