const Category = require("../models/categoryModel")
const { createModel, viewModel, trashModel, updateModel } = require("../utils/commonModel")



exports.store = async (req, res) => {
    try {
        const { name, status } = req.body
        const result = await createModel(Category, { name, status }, "Category Added..")
        res.json(result)
    } catch (error) {
        res.json(error.message)
    }

}



exports.index = async (req, res) => {

    const result = await viewModel(Category)
    res.json(result)

}




exports.trash = async (req, res) => {

    const { id } = req.params  
    const result = await trashModel(Category, id)
    res.json(result)

}



exports.update = async (req, res) => {

    const { id } = req.params
    const { name, status } = req.body


    const result = await updateModel(Category,id,{ name, status }, "Category Updated...." )
    res.json(result)

}