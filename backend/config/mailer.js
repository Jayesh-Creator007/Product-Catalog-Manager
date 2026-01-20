const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS
    }
})


async function sendMailer(to, subject, html) {
    const option = {
        from: process.env.USER_EMAIL,
        to,
        subject,
        html
    }
    await transporter.sendMail(option, (err, info) => {
        if (err) {
            console.log(err)
        } else {
           return true
        }
    })
}

module.exports = sendMailer
