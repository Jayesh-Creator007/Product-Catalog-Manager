const Product = require("../models/productModel")
const path = require('path')
const fs = require('fs')
const { createModel, viewMorePopulateModel } = require("../utils/commonModel.js")
const { deleteFromCloudinary } = require("../middleware/cloudinaryUpload")




exports.store = async (req, res) => {

    const { category_id, subcategory_id, p_name, p_price, p_description, status } = req.body

    const productData = {
        category_id,
        subcategory_id,
        p_name,
        p_price,
        p_description,
        status,
        p_image: req?.file?.filename
    }

    // Add Cloudinary image if available
    if (req.cloudinaryUrl) {
        productData.image = req.cloudinaryUrl
        productData.imagePublicId = req.cloudinaryPublicId
    }

    const result = await createModel(
        Product,
        productData,
        "Product Added"
    )

    res.json(result)
}


exports.index = async (req, res) => {

    const result = await viewMorePopulateModel(
        Product,
        "category_id", "name",
        "subcategory_id", "sub_name"
    )

    res.json(result)
}



exports.trash = async (req, res) => {

    const { id } = req.params

    const match = await Product.findById(id)

    if (match) {
        // Delete from Cloudinary if image exists
        if (match.imagePublicId) {
            await deleteFromCloudinary(match.imagePublicId)
        }

        // Delete local file if exists
        if (match.p_image) {
            const imgPath = path.join(__dirname, '../uploads', match?.p_image)
            fs.unlink(imgPath, (err) => {
                if (err) console.log('Local file not found')
            })
        }

        await Product.findByIdAndDelete(id)

        res.json({
            success: true,
            message: "Product Deleted Successfully.."
        })

    } else {
        res.json({
            success: false,
            message: "Product Not Found.."
        })
    }
}



exports.update = async (req, res) => {

    const { id } = req.params
    const { category_id, subcategory_id, p_name, p_price, p_description, status } = req.body

    const product = await Product.findById(id)

    if (!product) {
        return res.json({
            success: false,
            message: "Product Not Found.."
        })
    }

    const updateData = {
        category_id,
        subcategory_id,
        p_name,
        p_price,
        p_description,
        status,
        p_image: req.file?.filename || product.p_image
    }

    // If new image from Cloudinary
    if (req.cloudinaryUrl) {
        // Delete old Cloudinary image if exists
        if (product.imagePublicId) {
            await deleteFromCloudinary(product.imagePublicId)
        }

        updateData.image = req.cloudinaryUrl
        updateData.imagePublicId = req.cloudinaryPublicId
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData)

    res.json({
        success: true,
        message: "Product Updated Successfully.."
    })
}
