const Collection = require("../models/Collection");
const CollectionDic = require("../models/CollectionDic");
const Slug = require("../models/Slug");
const express = require("express");
const { verifyToken, verifyTokenAndAdmin } = require('./verifyToken');

const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// 1. إعدادات Cloudinary
cloudinary.config({
    cloud_name: 'dfitswv4j',
    api_key: '533456789927742',
    api_secret: 'n_2JSSh1JlQIgs6-CyFE1aNE98M'
});

// 2. إعدادات Multer لتخزين الصورة مؤقتاً في الذاكرة (Memory)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // حد أقصى 5 ميجا للملف
});

// دالة مساعدة لرفع الملف الـ Buffer إلى Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'collections' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url); // إرجاع رابط الـ https الآمن
            }
        );
        uploadStream.end(fileBuffer);
    });
};

// ==================== [ GET ALL COLLECTIONS ] ====================
router.get("/", async (req, res) => {
    try {
        const collections = await Collection.find();
        res.status(200).json(collections);
    }
    catch (err) {
        console.log("/collection route api error", err);
        res.status(500).json({ error: err.message });
    }
});

// ==================== [ ADD COLLECTION + CLOUDINARY ] ====================
// استخدمنا upload.any() لتتماشى مع فرونت إند الـ Bulk والـ Single
router.post("/add-collection", verifyTokenAndAdmin, upload.any(), async (req, res) => {
    try {
        // فك تشفير النصوص القادمة من FormData
        if (!req.body.collectionsData) {
            return res.status(400).json({ message: "Missing collectionsData" });
        }
        const collectionsList = JSON.parse(req.body.collectionsData);
        const files = req.files || [];

        // رفع كافة الصور لـ Cloudinary وعمل خريطة برابط كل صورة بناءً على اسمها
        const uploadedImagesMap = {};
        for (const file of files) {
            const fileNameWithoutExt = file.originalname.split('.')[0].toLowerCase();
            const imageUrl = await uploadToCloudinary(file.buffer);
            uploadedImagesMap[fileNameWithoutExt] = imageUrl;
        }

        const savedCollections = [];

        // معالجة وحفظ كل كوليكشن
        for (const col of collectionsList) {
            // توليد الـ slug المتوقع للاسم (مثال: Summer Collection -> summer-collection)
            const expectedSlug = col.name.replace(/\s+/g, '-').toLowerCase();
            const finalImgUrl = uploadedImagesMap[expectedSlug] || '';

            const collectionData = {
                name: col.name,
                arabicName: col.arabicName,
                active: col.active !== undefined ? col.active : true,
                img: finalImgUrl // حفظ رابط كلوديناري هنا في الـ img موديل
            };

            // الـ findOneAndUpdate بيضمن عدم حدوث Duplicate Error لو دست مضاف وموجود قبل كده
            const updatedOrCreatedCollection = await Collection.findOneAndUpdate(
                { name: col.name },
                collectionData,
                { upsert: true, new: true }
            );

            savedCollections.push(updatedOrCreatedCollection);
        }

        res.status(200).json(savedCollections);
    }
    catch (err) {
        console.log(" '/collection/add-collection' route api error", err);
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
});

// ==================== [ ADD COLLECTION SLUGS ] ====================
router.post("/add-collection-slugs", verifyTokenAndAdmin, async (req, res) => {
    try {
        // الفرونت إند بيبعت المصفوفة جوة كائن أو مباشرة، هنا بندعم الطريقتين
        const body = await req.body.slugsData || req.body;

        if (!Array.isArray(body)) {
            return res.status(400).json({ message: "Data must be an array" });
        }

        // استخدام loop من نوع for...of عشان تضمن الـ Async/Await يشتغل بالترتيب السليم
        for (const item of body) {
            let collection = await Collection.findOne({ name: item.collection });
            let slug = await Slug.findOne({ code: item.slug });

            if (collection && slug) {
                // التأكد إن الـ slug مش مضاف مسبقاً في المصفوفة منعاً للتكرار
                if (!collection.slug.includes(slug._id)) {
                    collection.slug.push(slug._id);
                    await collection.save();
                }
            }
        }
        res.status(200).json({ message: "done" });
    }
    catch (err) {
        console.log(" '/collection/add-collection-slugs' route api error", err);
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
});

module.exports = router;