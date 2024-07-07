const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Product = require('../models/product')
const Offer = require('../models/offer') 

router.post('/send/:buyProduct-:swapProduct', auth, async(req, res) => {
    const buyerId = req.user.id 
    const buyProductId = req.params.buyProduct
    const swapProductId = req.params.swapProduct
    const buyProduct = await Product.findById(buyProductId)
    const sellerId = buyProduct.seller

    const newswap = await Offer.create({
        buyer: buyerId,
        product: buyProductId,
        seller: sellerId,
        offerType: "swap",
        offerDetails: {
            swapProduct: swapProductId
        }
    })
    res.json(newswap)
})

router.get('/sent', auth, async (req, res) => {
    const userId = req.user.id 
    const sentswaps = await Offer.find({buyer:userId, offerType:"swap"}).populate([{path:'buyer'}, {path:'seller', select: 'name email inventory'}, {path: 'product'}]).populate("offerDetails.swapProduct")
    res.json(sentswaps)
})

router.get('/received', auth, async (req, res) => {
    const userId = req.user.id 
    const recswaps = await Offer.find({seller:userId, offerType:"swap", status: "pending"}).populate([{path:'buyer', select: 'name email inventory'}, {path:'seller'}, {path: 'product'}]).populate("offerDetails.swapProduct")
    res.json(recswaps)
})

router.delete('/reject/:id', auth, async (req, res) => {
    const offerId = req.params.id 
    const userId = req.user.id
    const offer = await Offer.findById(offerId)
    if (offer.seller == userId){
        const reject = await Offer.findByIdAndUpdate(offerId, 
            {"status": "rejected"}
        )
        res.json(reject)
    } else {
        res.sendStatus(401)
    }
})

module.exports = router