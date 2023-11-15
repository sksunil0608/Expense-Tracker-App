require('dotenv').config();
const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/users')

exports.getBuyPremium = async (req,res,next)=>{
    try{
        var rzp = new Razorpay ({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const amount =2990;
        rzp.orders.create({amount,currency:"INR"}, async (err, order) =>{
            
            if(err){
                throw new Error(JSON.stringify(err));
            }
            try{    
                const newUser = await req.user.createOrder({order_id: order.id, status:'PENDING'})
                return res.status(201).json({order,key_id : rzp.key_id})
            }
            catch(err){

                res.status(404).json({ Error: "Something Went Wrong!! Payment Failed" })
            }
        })
    }
    catch(err){
        res.status(404).json({Error:"Something Went Wrong!! Nothing Found"})
    }
}

exports.postTransactionStatus =async(req,res)=>{

    const {payment_id,order_id} = req.body
    try{
        const orderPromise = Order.findOne({where:{order_id:order_id}})
        const userPromise = req.user.update({payment_id:payment_id, status:"SUCCESS"}); 
        const [order_info,user_info] = await Promise.all([orderPromise,userPromise])

        await order_info.update({isPremiumUser:true})

        return res.status(202).json({ success:"Transaction Successful" })
    }
    catch(err){
        const order_info = await Order.findOne({ where: { order_id: order_id } })
        await order_info.update({ payment_id: payment_id, status: "FAILED" })
        
        res.status(404).json({ Error: "Something Went Wrong!! Payment Failed" })
    }
}

exports.isPremiumUser =async (req,res)=>{
    try{
        
        const userExist = await User.findByPk(req.user.id);
        if(userExist.isPremiumUser==true){
            return res.status(201).json({success: "Success"})
        }
    }catch(err){
        console.log(err)
        res.status(404).json({ Error: "Something Went Wrong!! Try to login" })
    }
}