const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost/ziddi")
.then(()=>console.log("mongodb connected"))
.catch((e)=>console.log(e))

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})