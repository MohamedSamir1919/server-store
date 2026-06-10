const express = require("express")
const router = express.Router();
const Product = require("../models/Product")
const Slug = require("../models/Slug")
const ProductsImages = require("../models/ProductsImages")
const Attributes = require("../models/DynamicAttributes")
const { verifyToken, verifyTokenAndAdmin } = require('./verifyToken');
const Category = require("../models/Category");
const multer = require('multer')



const cloudinary = require('cloudinary').v2;


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
//         cb(null, './images/products/'); // Specify the folder to store files
//     },
//     filename: function (req, file, cb) {
//         cb(null,  file.originalname); // Name the file uniquely
//     }
// });
// const upload = multer({ storage: storage });

router.post('/upload-sheet', verifyTokenAndAdmin, async (req, res) => {
    const productsFromSheet = req.body.products;

    if (!Array.isArray(productsFromSheet) || productsFromSheet.length === 0) {
        return res.status(400).json({ message: 'No product data provided or invalid format.' });
    }

    let createdCount = 0;
    let updatedCount = 0;
    const errors = [];

    for (const productData of productsFromSheet) {
        try {
            const {
                title,
                slugCode,     // From "Slug Code" column
                categoryName, // From "Category" column
                price,
                stock,
                details,      // Expecting array of {name, value}
                published,
                // ... any other fields from CSV that map directly to Product model
            } = productData;

            if (!title || !slugCode) {
                errors.push({ productIdentifier: title || slugCode || 'N/A', error: 'Missing title or slug code.' });
                continue;
            }

            // 1. Handle Category
            let categoryId = null;
            if (categoryName && typeof categoryName === 'string' && categoryName.trim() !== '') {
                let category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName.trim()}$`, 'i') } });
                if (!category) {
                    category = new Category({ name: categoryName.trim() });
                    await category.save();
                }
                categoryId = category._id;
            }

            // 2. Handle Slug and Product (Upsert logic)
            let slug = await Slug.findOne({ code: { $regex: new RegExp(`^${slugCode.trim()}$`, 'i') } });
            let existingProduct = null;

            if (slug) {
                existingProduct = await Product.findOne({ slug: slug._id });
            } else {
                slug = new Slug({ code: slugCode.trim() });
                await slug.save();
            }

            const productPayload = {
                title: title.trim(),
                slug: slug._id,
                price: parseFloat(price) || 0,
                stock: parseInt(stock) || 0,
                details: Array.isArray(details) ? details : [],
                published: typeof published === 'boolean' ? published : false,
            };
            if (categoryId) {
                productPayload.category = categoryId;
            }

            if (existingProduct) {
                Object.assign(existingProduct, productPayload);
                await existingProduct.save();
                updatedCount++;
            } else {
                const newProduct = new Product(productPayload);
                await newProduct.save();
                createdCount++;
            }
        } catch (err) {
            errors.push({ productIdentifier: productData.title || productData.slugCode || 'N/A', error: err.message });
        }
    }

    res.status(200).json({ message: 'Product sheet processed.', created: createdCount, updated: updatedCount, errors });
});

router.get("/get-one/:id", async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id)
        res.status(200).json(product)
    } catch (err) {
        console.log(err)
    }
})
router.get("/", async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (err) {
        console.log(err)
    }
})

router.get("/get-imgs", async (req, res) => {
    try {

        const imgs = await ProductsImages.find()
        res.status(200).json(imgs)
    } catch (err) {
        console.log(err)
    }
})

router.post('/:slug', verifyTokenAndAdmin, async (req, res) => {
    try {
        const body = await req.body

        // if (body?.every((b) => {
        //     return (
        //         b.hasOwnProperty("slug")
        //         & b.hasOwnProperty("title")
        //         & b.hasOwnProperty("description")


        //     )
        // })) {
        let slugs = await Slug.find();
        let cats = await Category.find()

        if (req.params.slug == "many") {
            const newProducts = body

            const categories = newProducts.reduce((categoriess, curr) => {
                const cat = cats.filter((c) => { c.name == curr.name })
                if (cats.some((c) => c.name == curr.name)) {
                    return categoriess
                }
                else if (cat?.length > 0)
                    return categoriess
                else {
                    categoriess = [...categoriess, { name: curr.category }]

                    return categoriess
                }
            }, [])
            function removeDuplicates(arr) {
                const uniqueNames = new Set();
                return arr.filter(obj => {
                    if (uniqueNames.has(obj.name)) {
                        return false;
                    } else {
                        uniqueNames.add(obj.name);
                        return true;
                    }
                });
            }
            if (categories) {

                let categoriess = removeDuplicates(categories);

                categoriess = categoriess.reduce((ca, curr) => {
                    if (cats.some((c) => c.name = curr.name)) {
                        return ca
                    }
                    else {
                        ca.push({ name: curr.name })
                        return ca
                    }
                }, [])

                if (categories?.length > 0) {

                    const categoriesInsert = await Category.insertMany(categoriess)
                }
            }
            const details = newProducts.map((pr) => {


                pr.details.split('&').map((d) => {
                    [key, value] = d.split(":")

                    return { key: value, slug: pr.slug }
                })


            }
            )

            cats = await Category.find({})



            const slugs = newProducts.reduce((slugss, curr) => {

                const cat = cats.filter(c => c.name === curr.category)

                slugss.push({ category: cat[0]?._id, code: curr.slug })

                return slugss
                //                 const newSlug = {product:createProduct._id,category:category._id,code:p.slug}

            }, [])


            const slugInsert = async () => {
                await slugs.forEach(async (s) => {
                    try {
                        await Slug.create(s)


                    } catch (err) { console.log(err) }
                })
            }
            const products = newProducts.forEach(async (curr) => {
                const { slug, category, ...prod } = curr

                // let slugId =  slgs?.filter(s=> s && s?.code == slug?.toString())[0]?._id;
                let deatailsArray = prod.details?.split('&').map(item => {
                    const [key, value] = item.split(':');
                    return { [key]: value };
                });
                // console.log(slugId)
                let product;

                let queue = async () => {
                    const slgs = await Slug.find();

                    let slugId = await slgs?.filter(s => s.code == slug?.toString())[0]?._id;
                    console.log('slugId:', slugId)
                    console.log('slug:', slug)

                    product = Object.assign(prod, { slug: slugId, details: deatailsArray.map(d => { return d }) })

                }
                // if(slugId){

                //     let newProduct = new Product(product)
                //     await newProduct.save();

                // }else{


                // }
                slugInsert().then(async () => {

                    queue().then(async () => {
                        let newProduct = new Product(product)
                        await newProduct.save();
                    })
                })
            })


        }
        else {

            const newProduct = new Product(body)
            await newProduct.save();
        }
        return res.status(200).json(body)
        // }
        // else {

        //     return res.status(400).json("please write all nessaccery fields")
        // }
    } catch (err) {
        console.log(err)
        res.json(err)
    }
})

router.post("/del/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const body = await req.body;
        const id = req.params.id
        const deleteOne = await Product.findByIdAndDelete({ _id: id })
        await Slug.findByIdAndDelete({ _id: deleteOne.slug })
        res.status(200).json(deleteOne)
    }

    catch (err) {
        res.json(err)
    }
})

// router.post("/upload/images", verifyTokenAndAdmin, upload.any('images/products'), async (req, res) => {
//     try {

//         // const body = await req.body;
//         // const proImages = await ProductsImages.insertMany(body)
//         console.log('imgs uploaded')
//         res.status(200).json("Done")
//     }

//     catch (err) {
//         res.json(err)
//     }
// })



router.post('/upload/images', upload.array('img', 10), async (req, res) => {
    try {
        // 1. Check if any files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images uploaded.' });
        }

        const uploadedImageDetails = [];

        // 2. Process each uploaded file
        for (const file of req.files) {
            // Convert the file buffer to a base64 string for Cloudinary upload
            const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

            // Upload image to Cloudinary
            const cloudinaryUploadResult = await cloudinary.uploader.upload(base64Image, {
                resource_type: 'image',
                folder: 'store_product_images', // Optional: Organize your product images in a specific folder in Cloudinary
                // You can also set a custom public_id here if you want to control the filename in Cloudinary,
                // e.g., public_id: file.originalname.split('.')[0], but ensure uniqueness to avoid overwrites.
            });

            const cloudinarySecureUrl = cloudinaryUploadResult.secure_url;
            uploadedImageDetails.push({
                originalName: file.originalname,
                cloudinaryUrl: cloudinarySecureUrl,
                publicId: cloudinaryUploadResult.public_id,
            });

            // 3. Find the product by its original filename and update its 'img' field
            // WARNING: This approach (finding by original filename) has several limitations:
            //   - Original filenames are not guaranteed to be unique across different products.
            //   - If a product's 'img' field is already updated to a Cloudinary URL,
            //     subsequent uploads using the original filename will not find that product.
            //   - For a more robust solution, consider sending the product's unique ID
            //     from the frontend along with the image upload to explicitly link the image.
            const productToUpdate = await Product.findOne({ img: file.originalname });

            if (productToUpdate) {
                // Update the product's 'img' field with the new Cloudinary URL
                productToUpdate.img = cloudinarySecureUrl;
                await productToUpdate.save();
                console.log(`Product ${productToUpdate._id} updated with Cloudinary URL: ${cloudinarySecureUrl}`);
            } else {
                console.warn(`No product found with original image filename '${file.originalname}'. Image uploaded to Cloudinary: ${cloudinarySecureUrl}`);
                // You might want to handle cases where no product is found:
                // - Delete the uploaded image from Cloudinary if it's not linked to any product.
                //   await cloudinary.uploader.destroy(cloudinaryUploadResult.public_id);
                // - Store the Cloudinary URL in a temporary collection for manual linking.
            }
        }

        // 4. Send a success response back to the frontend
        res.status(200).json({
            message: 'Images uploaded and products updated successfully (where matched by original filename).',
            uploadedImages: uploadedImageDetails,
        });

    } catch (error) {
        console.error('Error during image upload or product update:', error);
        // Provide a more informative error response
        res.status(500).json({
            message: 'Server error during image upload or product update.',
            error: error.message,
            details: error.stack, // Include stack trace for debugging in development
        });
    }
});





router.post("/upload/imagesDictionary", verifyTokenAndAdmin, upload.any('images/products'), async (req, res) => {
    try {

        // const body = await req.body;
        // const slugs = await Slug.find()
        // let imgDic = body.reduce((all,curr)=>{
        //     return [...all,{...curr,slug:slugs.filter((s)=>(s.code == curr.slug))[0]._id}]
        // },[])
        // const proImages = await ProductsImages.insertMany(imgDic)

        res.status(200).json("done")
    }

    catch (err) {
        res.json(err)
    }
})
router.post("/publish/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const body = await req.body;
        const pro = await Product.findById(req.params.id)


        const updatedOne = await Product.findByIdAndUpdate({ _id: req.params.id }, { published: body.published });
        let saveChanges = await updatedOne.save();
        res.status(200).json(updatedOne)
    }
    catch (err) {
        res.json(err)
    }
})
router.post("/edit/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const body = await req.body;
        const pro = await Product.findById(req.params.id)

        let [[key, value]] = Object.entries(body)
        let details = pro.details
        let updatedDetails = details.map(obj => {
            // Check if the object has the key we are looking for
            if (obj.hasOwnProperty(key)) {
                // Return a new object with the updated value
                return { [key]: value };
            }
            else {
                return obj
            }
        })
        const updatedOne = await Product.findByIdAndUpdate({ _id: req.params.id }, { details: updatedDetails });
        let saveChanges = await updatedOne.save();
        res.status(200).json(updatedOne)
    }
    catch (err) {
        res.json(err)
    }
})

router.get('/details/attributes', async (req, res) => {
    try {
        const attributes = await Attributes.find();
        if (attributes.length > 0) {

            res.status(200).json(attributes)
        }
    }
    catch (err) {
        res.json(err)
    }
})
router.post('/details/attributes', async (req, res) => {
    try {
        const body = await req.body;
        const arrtibutes = await Attributes.create(body);
        await arrtibutes.save();


        res.status(200).json(arrtibutes)

    }
    catch (err) {
        res.json(err)
    }
})
module.exports = router;