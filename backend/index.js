const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000
const authroute = require('./routes/auth')
const productsroute = require('./routes/products')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost/ziddi")
.then(()=>console.log("mongodb connected"))
.catch((e)=>console.log(e))

app.use('/auth', authroute)
app.use('/products', productsroute)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})