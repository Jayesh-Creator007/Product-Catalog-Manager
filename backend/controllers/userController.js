const sendMailer = require("../config/mailer")
const User = require("../models/userModel")
const { createModel, viewModel, existModel } = require("../utils/commonModel")
const { verifyEmail } = require("../utils/mailFormate")
const { plainToHash, hashToPlain } = require("../utils/password")
const otpGenerator = require('otp-generator')
const jwt = require('jsonwebtoken')




exports.signup = async (req, res) => {


    const { name, email, password, mobile } = req.body
    const hash_pass = await plainToHash(password)
    // res.json(hash_pass)
    const otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    })
    // res.json(otp)

    const result = await createModel(
        User,
        { name, email, password: hash_pass, otp, mobile },
        "User Added"
    )
    if (result.success) {
        await sendMailer(
            email,
            'verify your account',
            verifyEmail(otp)
        )
    }
    res.json(result)
}



exports.otpVerify = async (req, res) => {

    const { otp } = req.body
    const match = await User.findOne({ otp })
    console.log(match)

    if (!match) {
        return res.json({
            success: false,
            message: "otp not match"
        })
    }


    await User.findByIdAndUpdate({ _id: match._id }, { otp: "", verify: true })

    res.json({
        success: true,
        message: "Your Email has been verify...."
    })

}



exports.login = async (req, res) => {

    const { email, password } = req.body

    const match = await existModel(User, { email, verify:true }, "Email id not exist")

    console.log(match.records)

    
    // console.log(hash_pass)
    
    
    if (match.success) {
        
        const {password: hash_pass, 
            _id: id, 
            email: u_email, 
            role_id
        } = match.records

        
        
        // const hash_pass = match.records.password

        const match_pass = await hashToPlain(password, hash_pass)

        // const { password : hash_pass , _id :id} = match.records

        if (!match_pass) {
            res.json({
                success: true,
                message: "your password is not match"
            })
        }

        const payload = {
            id,u_email,role_id
         }

        //  res.json(payload)

        const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn:'1h'})

        

        res
        .header('token',token)
        .json({
            success:true,
            message:"logIn successfull...",
            token
        })


    } else {
        res.json(match)
    }


}





exports.changePassword = async (req, res) => {
    
    const { old_pass, new_pass } = req.body;
    const { u_email } = req.user;

    const match = await existModel(
        User,
        { email: u_email },
        "Email Id Not Exist"
    )

    if (match.success) {

        const { password, _id: id } = match.records

        const matchPass = await hashToPlain(old_pass, password)

        if (!matchPass) {
            return res.json({
                success: false,
                message: "old password not match"
            })
        }

        const hash_pass = await plainToHash(new_pass)
        // res.json(hash_pass)

        await User.findByIdAndUpdate(id, { password: hash_pass })
            .then(() => {
                res.json({
                    success: true,
                    message: "your password has been changed"
                })
            })
            .catch((err) => {
                res.json({
                    success: false,
                    message: err.message
                })
            })
    }
}

