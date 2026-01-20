const { signup, otpVerify, login, changePassword } = require('../controllers/userController')
const { verifyUser, verifyRole } = require('../middleware/verify')


const router = require('express').Router()

router.post('/signup',signup)
router.post('/otpVerify',otpVerify)
router.post('/login',login)
router.post('/changePassword',verifyUser, verifyRole(["admin","staff","user"]), changePassword)





module.exports = router