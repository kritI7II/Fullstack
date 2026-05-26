const mongoose = require('mongoose')

const connectDB = async() => {
     try{
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017')
        console.log('Connect DB Is Success')
     }catch(err){
        console.log(err)
     }
}

module.exports = connectDB