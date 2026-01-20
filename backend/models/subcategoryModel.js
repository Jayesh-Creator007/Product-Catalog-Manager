const { Schema, Types, model } = require("mongoose");
const { commonString } = require("./common");



const subcategorySchema = new Schema({

    category_id : {
        type: Schema.Types.ObjectId,
        ref:'Category'
    },
    
    sub_name:commonString,

    status:{
        type:Boolean,
        default:true,
        required:true
    }
},{timestamps:true})


const subCategory = model('subCategory',subcategorySchema)
module.exports = subCategory