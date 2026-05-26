const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    name : {
        type : String ,
        require : [true , "กรุณาใส่ชื่อ"],
        trim : true,
        unique : true
    },
    price : {
        type : Number,
        require : [true , "กรุณาใส่ราคาสินค้า"],
        min : [0, "ราคาต้องไม่ต่ำกว่า 0 "]
    },
    description : {
        type : String,
        trim : true
    },
    stock : {
        type : Number,
        default : 0,
        min: [0, "จำนวนสินค้าห้ามติดลบ"]
    },
    category : {
        type : String,
        require: [true, "กรุณาระบุหมวดหมู่สินค้า"],
        enum : {
            values : ['Electronics', 'Clothing', 'Home'],
            message : "หมวกหมู่ต้องเป็น Electronics , Clothing , Home เท่านั้น"
        }
    },
},{
    timestamps : true 
})

module.exports = mongoose.model('Product', productSchema)