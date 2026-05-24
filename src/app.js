const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
const product = require('./routes/productRouter')
app.use(express.json())
app.use('/api', product)
 
app.listen(port , () => {
    console.log (`Server is running on port ${port}`)
})