
const express = require("express")
const router = express.Router();
const Slug = require("../models/Slug")
const ProductImage = require("../models/ProductsImages")
const multer = require('multer');
const path = require('path');

const {verifyToken} = require('./verifyToken')
router.get("/",async(req,res)=>{
   try{
    const productImage = await ProductImage.find()
    res.status(200).json(productImage)
   }catch(err){
    console.log(err)
   }
})
const storage = multer.diskStorage({
    destination: './images/products',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ "-" + path.extname(file.originalname));
    }
  });
  
  // Initialize upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    }
  }).array('images', 10); // Accept up to 10 files named 'images'
  
router.post("/?query=many",async(req,res)=>{

})