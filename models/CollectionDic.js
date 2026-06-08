const mongoose = require('mongoose');

const CollectionDic = new mongoose.Schema({
    slug:{type: mongoose.Schema.Types.ObjectId, ref: 'Slug'},
    collection:{type: mongoose.Schema.Types.ObjectId, ref: 'Collection'},
    
  },{timestamps:true});

  module.exports = mongoose.model("CollectionDic",CollectionDic)