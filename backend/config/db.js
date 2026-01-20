const { default: mongoose } = require("mongoose")


const dbConfig = () =>{
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("db connected.."))
    .catch((err) => {console.log(err)})
}

module.exports = dbConfig