const { Schema, model} = require("mongoose");
const { commonString } = require("./common");


const categorySchema = new Schema ({

    name:{
        ...commonString,
        unique : [true, "category already exists.."]
    },
    
    status : {
        ...commonString,
        type: Boolean,
        default:true
    } 

},{timestamps:true})


const Category = model('Category', categorySchema)
module.exports = Category