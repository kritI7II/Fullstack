const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
            name : {
                type : String,
                require : [true, "กรุณาใส่ชื่อสินค้า"],
                trim : true
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