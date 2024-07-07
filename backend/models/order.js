const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderType: {
        type: String,
        enum: ['normal', 'bid', 'swap']
    },
    status: {
        type: String,
        enum: ['pending', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: {
        type: String
    }
}, {timestamps: true})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order