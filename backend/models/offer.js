const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    offerType: {
        type: String,
        enum: ['bid', 'swap'],
        required: true
    },
    offerDetails: {

        swapProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        bidAmount: {
            type: Number
        }
        
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    }
}, {timestamps: true})

const Offer = mongoose.model('Offer', offerSchema)
module.exports = Offer