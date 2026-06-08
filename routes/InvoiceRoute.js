const express = require("express")
const router = express.Router();
const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");

router.post("/get",verifyTokenAndAdmin,async(req,res)=>
    {
    
        try{
    
            const invoice = await Invoice.find();
            // console.log(invoice)
            res.status(200).json(invoice)
        }catch(err){
            res.json(err)

            console.log(err)
        }
    
    })

router.post("/my-invoice",verifyToken,async(req,res)=>
        {
        
            try{
                const user = await req.user
                const invoice = await Invoice.find({user:user._id});
                res.status(200).json(invoice)
            }catch(err){
                res.json(err)
            }
        
        })
router.post("/",verifyToken,async(req,res)=>{
            try{
                let body = await req.body
                let user = await req.user
                let invoices = await Invoice.find();
                let newInvoice = new Invoice({...body, paid:0,user:user._id,id:`ORD-${invoices.length + 1}`})
                await newInvoice.save();
                res.status(200).json(newInvoice)
            }catch(err){
                console.log(err)
        
                res.json(err)
            }
        })
        router.post("/cancel/:invoiceId",verifyToken,async(req,res)=>{
            try{
                let body = await req.body
                let user = await req.user
                let invioceId = await req.params.invoiceId
                let updatedInvoice = await Invoice.findByIdAndUpdate(invioceId,{status:"canceled"})
                
                res.status(200).json(updatedInvoice)
            }catch(err){
                console.log(err)
        
                res.json(err)
            }
        })
        
router.put("/",verifyToken,async(req,res)=>{
    try{
        let body = await req.body
        // console.log(body)
                let products = await Product.find();

        let updateInvoice = await Invoice.findByIdAndUpdate({_id:body.id},body)
        let order = await Order.find({invoice:updateInvoice._id})
        if(body.status == "completed"){

            order.forEach(async(o)=>{
                let product = await Product.findOne({slug:o.slug})
                console.log("product",product)
                if(product){
                    let newStock = product.stock - o.quantity
                    let updateproduct = await Product.findByIdAndUpdate(product._id,{stock:newStock})
                    await updateproduct.save()
                }
            })
        }
       await updateInvoice.update();
       order.forEach(async(o)=>{
        let product = products.find((p)=>p.slug.toString() == o.slug.toString())
        
       })
        let invoice = await Invoice.findById(body._id)
       
        res.status(200).json(invoice)
    }catch(err){
        res.json(err)
    }
})
module.exports = router;