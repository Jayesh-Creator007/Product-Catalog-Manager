const Product = require("../models/productModel")
const path = require('path')
const fs = require('fs')
const { createModel, viewMorePopulateModel } = require("../utils/commonModel.js")




exports.store = async (req, res) => {

    const { category_id, subcategory_id, p_name, p_price, p_description, status } = req.body

    console.log(req.file)

    const result = await createModel(
        Product,
        { category_id, subcategory_id, p_name, p_price, p_description, status, p_image: req?.file?.filename },
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

        const imgPath = path.join(__dirname, '../uploads', match?.p_image)

        fs.unlink(imgPath, async (err) => {

            if (err) {
                res.json({
                    success: false,
                    message: "Image Path Not Found.."
                })
            } else {

                await Product.findByIdAndDelete(id)

                res.json({
                    success: true,
                    message: "Product Deleted Successfully.."
                })
            }

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

    console.log(req.file)
    console.log(req.body)
    console.log(id)

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { category_id, subcategory_id, p_name, p_price, p_description, status, p_image: req.file?.filename }
    )

    if (!updatedProduct) {
        return res.json({
            success: false,
            message: "Product Not Found.."
        })
    }

    res.json({
        success: true,
        message: "Product Updated Successfully.."
    })
}
