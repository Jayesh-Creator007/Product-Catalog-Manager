const subCategory = require("../models/subcategoryModel")
const { createModel, viewModel, trashModel, updateModel, viewPopulateModel } = require("../utils/commonModel")





exports.store = async (req, res) => {

    const { category_id, sub_name, status } = req.body;

    const match = await subCategory.findOne({ category_id, sub_name });

    if (match) {
        res.json({
            success: false,
            message: "subcategory already exist"
        });
    } else {
        const result = await createModel(
            subCategory,
            { category_id, sub_name, status },
            "SubCategory Added"
        );
        res.json(result);
    }
};




exports.index = async (req, res) => {

    const result = await viewPopulateModel(subCategory, 'category_id', "name status")
    res.json(result)

}




exports.trash = async (req, res) => {

    const { id } = req.params
    const result = await trashModel(subCategory, id)
    res.json(result)

}



exports.update = async (req, res) => {

    const { id } = req.params
    const { category_id, sub_name, status } = req.body

    const result = await updateModel(subCategory, id, { category_id, sub_name, status }, "Subcategory Updated....")
    res.json(result)

}



exports.getByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        const subcategories = await subCategory.find({ category_id: categoryId })
            .populate('category_id', 'name');
        
        res.json({
            success: true,
            records: subcategories.length > 0 ? subcategories : "No Subcategories Found"
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}