const express = require("express")
const router = express.Router();
const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const Invoice = require("../models/Invoice");

router.post("/get-orders",verifyTokenAndAdmin,async(req,res)=>
    {
    
        try{
    
            const orders = await Order.find();
            res.status(200).json(orders)
        }catch(err){
            res.json(err)
        }
    
    })
    router.get("/best-sell",async(req,res)=>
        {
        
            try{
        
                const orders = await Order.find();
                res.status(200).json(orders)
            }catch(err){
                res.json(err)
            }
        
        })

    router.post("/",verifyToken,async(req,res)=>
        {
        
            try{
                const user = await req.user
                let body = await req.body;
                let invoice = await Invoice.find({user:user._id,status:"order placed"})
                let order = {...body,invoice:invoice._id}
                const newOrder = await Order(body);
                await newOrder.save()
                res.status(200).json(newOrder)
            }catch(err){
                console.log(err)
                res.json(err)
            }
        
        })
        router.post("/my-orders",verifyToken,async(req,res)=>{
            try{  const user = await req.user;
              const invoices = await Invoice.find({user:user._id})
              var orders  =   await Order.find()
              let ordersUser = orders.filter((o)=>{
                  return invoices.filter((i)=> i.user == user._id).some((inv)=> inv._id == o.invoice)
              })
             
  
              res.status(200).json(orders)}
              catch(err){
                  console.log(err)
                  res.json(err)
              }
          })
        //   router.post("/my-orders",verifyToken,async(req,res)=>{
        //     try{  const user = await req.user;
        //       const invoices = await Invoice.find({user:user._id})
        //       var orders  =   await Order.find()
        //       let ordersUser = orders.filter((o)=>{
        //           return invoices.filter((i)=> i.user == user._id).some((inv)=> inv._id == o.invoice)
        //       })
             
  
        //       res.status(200).json(orders)}
        //       catch(err){
        //           console.log(err)
        //           res.json(err)
        //       }
        //   })
         
          router.post("/my-orders/delete/:invoiceId",verifyToken,async(req,res)=>{
            try{  const user = await req.user;
                const invoiceId = await req.params.invoiceId
              const invoices = await Invoice.findById(invoiceId)
              const orders  =   await Order.find()
                const orderInvoice = orders?.filter((o)=>{return o.invoice == invoices._id})
                orderInvoice.forEach(async element => {
                    let order = await Order.findByIdAndDelete(element._id)
                });
                
                console.log("orderInvoice",orderInvoice)
  
              res.status(200).json(orders)}
              catch(err){
                  console.log(err)
                  res.json(err)
              }
          })
        router.post("/make-order",verifyToken,async(req,res)=>
            {
            
                try{
                    const user = await req.user
                    let body = await req.body;
                    let order = body
                    const newOrder = await Order(order);
                    await newOrder.save()
                    res.status(200).json(newOrder)
                }catch(err){
                    console.log(err)
                    res.json(err)

                }
            
            })

module.exports = router;