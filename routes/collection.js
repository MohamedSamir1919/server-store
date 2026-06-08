const Collection = require("../models/Collection")
const CollectionDic = require("../models/CollectionDic")
const Slug = require("../models/Slug")
const express = require("express")

const router = express.Router();
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/collection/'); // Specify the folder to store files
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname); // Name the file uniquely
    }
});
const upload = multer({ storage: storage });
router.get("/",async(req,res)=>{
try{
    const collections = await Collection.find()
    res.status(200).json(collections)
}
catch(err){console.log("/collection route api error",err)}
})
router.post("/upload-images", upload.any("images/collection/"), async (req, res) => {
res.status(200).json('done')   
})
router.post("/add-collection",async(req,res)=>{
    try{
        let body = await req.body
        console.log(body)
        // let newCollection = await Collection.create(body)
        // res.status(200).json(newCollection)
        res.json(body)
    }
    catch(err){
        console.log(" '/collection/add-collection' route api error",err)
    }
})
router.post('/collection-dictionary',async(req,res)=>{
    const body = req.body;
    try {
        const collectionDicData = await Promise.all(body.map(async (item) => {
            const { collection, slug } = item;

            // Find the Collection by name
            const foundCollection = await Collection.findOne({ name: collection });
            if (!foundCollection) {
                throw new Error(`Collection with name "${collection}" not found.`);
            }

            // Find the Slug by code
            const foundSlug = await Slug.findOne({ code: slug });
            if (!foundSlug) {
                throw new Error(`Slug with code "${slug}" not found.`);
            }

            return { collection: foundCollection._id, slug: foundSlug._id };
        }));

        // Save the modified data to CollectionDic model
        const createdCollectionDics = await CollectionDic.insertMany(collectionDicData);
        res.status(201).json(createdCollectionDics);
    } catch (error) {
        console.error("Error processing collection dictionary:", error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;