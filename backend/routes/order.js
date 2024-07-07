const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Product = require('../models/product')
const Offer = require('../models/offer')
const Order = require('../models/order')

router.post('/checkout/:id', auth, async (req, res) => {
    const buyerId = req.user.id 
    const productId = req.params.id 
    const product = await Product.findById(productId)
    const sellerId = product.seller

    if (product.buyer){
        return res.status(401).send('product already has a buyer')
    }

    const cartarr = await User.findById(buyerId).select({ "cart": 1, "_id": 0 })

    const newOrder = await Order.create({
        buyer: buyerId,
        seller: sellerId,
        product: productId,
        totalAmount: product.price,
        orderType: 'normal'
    })
    res.json(newOrder)

    if (cartarr.cart.includes(productId)) {
        const popcart = await User.findByIdAndUpdate(buyerId,
            {$pull: {"cart": productId}}
        )
    }

    const popinventory = await User.findByIdAndUpdate(sellerId,
        {$pull: {"inventory": productId}}
    )

    const produpdatebuyer = await Product.findByIdAndUpdate(productId, {
        buyer: buyerId
    })

})

router.get('/', auth, async (req, res) => {
    const buyer = req.user.id
    const orders = await Order.find({buyer}).sort({createdAt:-1}).populate([{path:'buyer'}, {path:'seller', select:'name email inventory'}, {path:'product'}])
    res.json(orders)
})

router.post('/bid/:offerId', auth, async (req, res) => {
    const sellerId = req.user.id 
    const offerId = req.params.offerId
    const offer = await Offer.findById(offerId).populate('product')
    const product = await Product.findById(offer.product)
    if (product.buyer) {
        return res.status(401).send('product already has a buyer')
    }

    if(offer.seller == sellerId){
        const accept = await Offer.findByIdAndUpdate(offerId,
            {status:"accepted"}
        )

        const newBidOrder = await Order.create({
            buyer: offer.buyer,
            seller: sellerId,
            product: offer.product,
            totalAmount: offer.offerDetails.bidAmount,
            orderType: 'bid'
        })
        res.json(newBidOrder)
        
        const popinventory = await User.findByIdAndUpdate(sellerId,
            {$pull: {"inventory": offer.product}}
        )

        const produpdatebuyer = await Product.findByIdAndUpdate(offer.product, {
            buyer: offer.buyer
        })

    } else {
        res.sendStatus(401)
    }
})

router.post('/swap/:offerId', auth, async (req, res) => {
    const sellerId = req.user.id 
    const offerId = req.params.offerId 
    const offer = await Offer.findById(offerId)

    const checkproduct = await Product.findById(offer.product)
    if (checkproduct.buyer) {
        return res.status(401).send('product already has a buyer')
    }

    if (offer.seller == sellerId){
        const accept = await Offer.findByIdAndUpdate(offerId,
            {status:"accepted"}
        )

        const buyerSwapOrder = await Order.create({
            buyer: offer.buyer,
            seller: sellerId,
            product: offer.product,
            totalAmount: 0,
            orderType: 'swap'
        })
        
        const sellerSwapOrder = await Order.create({
            buyer: sellerId,
            seller: offer.buyer,
            product: offer.offerDetails.swapProduct,
            totalAmount: 0,
            orderType: 'swap'
        })

        const popsellerinventory = await User.findByIdAndUpdate(sellerId,
            {$pull: {"inventory": offer.product}}
        )

        const popbuyerinventory = await User.findByIdAndUpdate(offer.buyer,
            {$pull: {"inventory": offer.offerDetails.swapProduct}}
        )

        const produpdatebuyer = await Product.findByIdAndUpdate(offer.product,{
            buyer: offer.buyer
        })

        const swapprodupdatebuyer = await Product.findByIdAndUpdate(offer.offerDetails.swapProduct, {
            buyer: sellerId
        })

        res.sendStatus(200)

    } else {
        res.sendStatus(401)
    }
})

router.delete('/cancel/:id', auth, async (req, res) => {
    const buyerId = req.user.id 
    const orderId = req.params.id 
    const order = await Order.findById(orderId)
    const sellerId = order.seller
    const productId = await Product.findById(order.product)

    if(buyerId != order.buyer){
        return res.sendStatus(401)
    }

    const sellerinventoryupdate = await User.findByIdAndUpdate(sellerId, 
        { $push: {"inventory": productId}}
    )

    const productkabuyerupdate = await Product.findByIdAndUpdate(productId, 
        { $unset: { buyer: "" }}
    )

    const deleteorder = await Order.findByIdAndUpdate(orderId, {
        status: "cancelled"
    }
    )
    res.sendStatus(200)
})

module.exports = router