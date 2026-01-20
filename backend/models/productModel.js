const { Schema, model } = require("mongoose");
const { commonString, commonNumber } = require("./common");



const productSchema = new Schema({
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    subcategory_id: {
        type: Schema.Types.ObjectId,
        ref: 'subCategory'
    },
    p_name: commonString,
    p_price: commonNumber,
    p_description: {
        type: String,
        required: false,
        trim: true
    },
    p_image: {
        ...commonString,
        required : false
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    }
}, { timestamps: true });




const Product = model('Product', productSchema);
module.exports = Product;
