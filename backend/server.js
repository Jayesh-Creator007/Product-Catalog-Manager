const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/uploads', express.static('uploads'))

require('dotenv').config()
require('./config/db.js')()

// Routes
// console.log("CATEGORY ROUTE LOADED");

const categoryRoute = require('./routes/categoryRoute.js')
const subcategoryRoute = require('./routes/subcategoryRoute.js')
const productRoute = require('./routes/productRoute.js')

app.use("/api/category", categoryRoute)
app.use("/api/subcategory", subcategoryRoute)
app.use("/api/product", productRoute)
// console.log("CATEGORY ROUTE LOADED");

// Default
app.get('/', (req, res) => {
    res.send("Hello World!")
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
