require('dotenv').config();
const Razorpay = require('razorpay');
const Order = require('../models/order');
const userController = require('./user')
exports.getBuyPremium = async (req, res, next) => {
    try {
        if (req.user.is_premium_user == true) {
            return res.status(403).json({ Error: "You are already a premium User" })
        }
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const amount = 2990;
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {

            if (err) {
                throw new Error(JSON.stringify(err));
            }
            try {
                const new_user = await req.user.createOrder({ order_id: order.id, status: 'PENDING' })
                return res.status(201).json({ order, key_id: rzp.key_id })
            }
            catch (err) {

                res.status(404).json({ Error: "Something Went Wrong!! Payment Failed" })
            }
        })
    }
    catch (err) {
        res.status(404).json({ Error: "Something Went Wrong!! Nothing Found" })
    }
}

exports.postTransactionStatus = async (req, res) => {

    const { payment_id, order_id } = req.body
    try {
        const order_info = await Order.findOne({ where: { order_id: order_id } })

        const user_promise = order_info.update({ payment_id: payment_id, status: "SUCCESS" });
        const trans_promise = req.user.update({ is_premium_user: true })
        const [trans_info, user_info] = await Promise.all([user_promise, trans_promise])

        return res.status(202).json({ success: "Transaction Successful", token: userController.generateAccessToken(req.user.id, req.user.name, true) })
    }
    catch (err) {
        console.log(err)
        const order_info = await Order.findOne({ where: { order_id: order_id } })
        await order_info.update({ payment_id: payment_id, status: "FAILED" })

        res.status(404).json({ Error: "Something Went Wrong!! Payment Failed" })
    }
}