const express = require("express")
const router = express.Router();
const Setting = require("../models/setting");
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const Banners = require("../models/banners");
const multer = require('multer')






const cloudinary = require('cloudinary').v2;

const app = express();

// 1. إعدادات Cloudinary (حط بياناتك هنا أو في ملف الـ .env وأرفعهم على فيرسيل)
cloudinary.config({
    cloud_name: 'dfitswv4j',
    api_key: '533456789927742',
    api_secret: 'n_2JSSh1JlQIgs6-CyFE1aNE98M'
});

// 2. إعدادات Multer لتخزين الصورة مؤقتاً في الذاكرة (Memory) وليس الهاردسك
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });








// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './images/settings/'); // Specify the folder to store files
//     },
//     filename: function (req, file, cb) {
//         cb(null,  file.originalname); // Name the file uniquely
//     }
// });
//     const upload = multer({ storage: storage });

router.get("/", async (req, res) => {

    try {

        const setting = await Setting.find();
        res.status(200).json(setting)
    } catch (err) {
        res.json(err)
    }

})
router.post('/add-banner', verifyTokenAndAdmin, upload.single('imgFile'), async (req, res) => {
    try {

        const body = await req.body
        const fileBase64 = req.file.buffer.toString('base64');
        const fileUrl = `data:${req.file.mimetype};base64,${fileBase64}`;

        // رفع الصورة إلى Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(fileUrl, {
            folder: 'store_banners', // اسم الفولدر اللي هيتنشئ جوه موقع كلوديناري
        });

        // الرابط الأونلاين بتاع الصورة اللي هتحفظه في المونجو داتابيز!
        const secureUrl = uploadResponse.secure_url;
        body.img = secureUrl;

        const newBanner = await Banners.create(body)
        awaitnewBanner.save();
        res.status(200).json(newBanner)
    } catch (err) {
        console.log(err)
        res.json(err)
    }


})
router.get('/get-banner', async (req, res) => {
    try {

        const banners = await Banners.find({}, {}, { sort: { 'created_at': 1 } })
        res.status(200).json(banners)
    } catch (err) {
        console.log(err)
        res.json(err)
    }


})

module.exports = router;