const { Schema, model } = require("mongoose");
const { commonString } = require("./common");



const UserSchema = new Schema({
    
    name: commonString,
    email: {
        ...commonString,
        unique: [true, "Email ID Already Exist"]
    },
    mobile: {
        ...commonString,
        unique: [true, "Mobile Number Already Exist"]
    },
    password: commonString,
    otp: commonString,
    verify: {
        type: Boolean,
        default: false,
        required: true
    },
    role_id:{
        type:String,
        enum : ["admin", "staff", "user"],
        default:"user"
    }
}, { timestamps: true })



const User = model('User', UserSchema)
module.exports = User
