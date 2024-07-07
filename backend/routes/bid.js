const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Product = require('../models/product')
const Offer = require('../models/offer')

router.post('/send/:id', auth, async(req, res) => {
    const buyerId = req.user.id 
    const productId = req.params.id 
    const product = await Product.findById(productId)
    const sellerId = product.seller
    const { bidAmount } = req.body 

    const newbid = await Offer.create({
        buyer: buyerId,
        product: productId,
        seller: sellerId,
        offerType: "bid",
        offerDetails: {
            bidAmount: bidAmount
        }
    })
    res.json(newbid)

})

router.get('/sent', auth, async (req, res) => {
    const userId = req.user.id 
    const sentbids = await Offer.find({buyer:userId, offerType:"bid"}).populate([{path:'buyer'}, {path:'seller', select: 'name email inventory'}, {path: 'product'}])
    res.json(sentbids)
})

router.get('/received', auth, async (req, res) => {
    const userId = req.user.id 
    const recbids = await Offer.find({seller:userId, offerType:"bid", status:"pending"}).populate([{path:'buyer', select: 'name email inventory'}, {path:'seller'}, {path: 'product'}])
    res.json(recbids)
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