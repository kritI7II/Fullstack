const mongoose = require('mongoose')
const productModel = require('./productModel')

const cartSchema = mongoose.Schema({
            productId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product',
                require : [true , "ไม่มีสินค้าชิ้นนี้"]
            },
            quantity : {
                type : Number,
                require : [true, "กรุณาระบุจำนวน"],
                default : 1,
                min : [1 , "ขั้นต่ำสินค้า 1 ชิ้น"]
            },
            totalPrice : {
                type : Number,
                require : [true, "กรุณาระบุราคา"],
                min : [0 , "จำนวนราคาห้ามติดลบ"],
            }
},{timestamps : true})

module.exports = mongoose.model("Cart",cartSchema)