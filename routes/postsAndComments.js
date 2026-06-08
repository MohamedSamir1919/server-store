const express = require("express")
const router = express.Router();
const User = require("../models/User");
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const jwt = require('jsonwebtoken')
const Comment = require("../models/Comments");
const Post = require("../models/Post");

router.get("/posts",async(req,res)=>
{

    try{
        const posts = await Post.find()
        
        res.status(200).json(posts)
    }
    catch(err){
        res.json(err)
    }

})

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/posts/'); // Specify the folder to store files
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname); // Name the file uniquely
    }
});
const upload = multer({ storage: storage });

router.post("/post",verifyTokenAndAdmin,upload.any('images/products'),async(req,res)=>
{

    try{
        const {title,post,pic} = await req.body
        console.log(title,post,pic)
        const postt = await Post.create({title:title,post:post,pic:pic})
        await postt.save();
        res.status(200).json(postt)
    }
    catch(err){
        res.json(err)
    }

})

router.post("/comment",verifyToken,async(req,res)=>
{

    try{
        const body = await req.body
        const comment = await Comment.create(body)
        await comment.save();
        res.status(200).json(comment)
    }
    catch(err){
        res.json(err)
    }

})

router.get("/comments",async(req,res)=>
{

    try{
        const comments = await Comment.find()
        res.status(200).json(comments)
    }
    catch(err){
        res.json(err)
    }

})

module.exports = router;
