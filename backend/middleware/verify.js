const jwt = require('jsonwebtoken')



exports.verifyUser = (req, res, next) => {

    // res.json(req.headers.authorization)

    try {
        
        let token = req.headers.authorization

        // res.json(token.slice(7))
        if (!token) {
            return res.json({
                success: false,
                message: "you are not authenticate_1"
            })
        }

        token = token.split(" ")[1]

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)

        // console.log(verifyToken)
        // res.json(verifyToken)

        if (!verifyToken) {
            return res.json({
                success: false,
                message: "you are not authenticate_2"
            })
        }

        req.user = verifyToken
        next()
        
    } catch (error) {
        res.json({
            success: false,
            message: "you are not authenticate_3" || error.message
        })
    }

    // res.json(token)
    // next()

}



exports.verifyRole = (roles) =>{

    return (req, res, next) => {

        const {role_id} = req.user

        // console.log(roles)
        // console.log(req.user.role_id)

        console.log(roles.includes(role_id))


        if(roles.includes(role_id)){
            next()
        }else{
            return res.json({
                success:false,
                message:"You are not autherized.."
            })
        }
    }


}

