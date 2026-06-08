const express = require("express")
const router = express.Router();
const Setting = require("../models/setting");
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const Banners = require("../models/banners");
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/settings/'); // Specify the folder to store files
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname); // Name the file uniquely
    }
});
    const upload = multer({ storage: storage });

router.get("/",async(req,res)=>
    {
    
        try{
            
            const setting = await Setting.find();
            res.status(200).json(setting)
        }catch(err){
            res.json(err)
        }
    
    })
    router.post('/add-banner', verifyTokenAndAdmin,upload.single('imgFile'),async(req,res)=>{
        try{    
            
            const body = await req.body
            const newBanner = await Banners.create(body)
        res.status(200).json(newBanner)
        }  catch(err){
            console.log(err)
            res.json(err)
        }  


})
router.get('/get-banner', async(req,res)=>{
    try{    
        
        const banners = await Banners.find({}, {}, { sort: { 'created_at' : 1 } })
        res.status(200).json(banners)
    }  catch(err){
        console.log(err)
        res.json(err)
    }  


})

    module.exports = router;