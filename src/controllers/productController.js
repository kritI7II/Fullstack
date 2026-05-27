
const Product = require('../models/productModel')

let shoppingCart = [];

const getProducts = async(req, res) => {
    try{
        const product = await Product.find({}).exec()
        res.status(200).json({
            success : true,
            message : "ดึงข้อมูลสำเร็จ",
            data : product
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            success : false,
            message : "Server Error",
        })
    }
}

const getProduct = async(req, res) => {
    try{
        const id = req.params.id
        const productId = await Product.findById(id).exec()
        if(!productId){
            return res.status(500).json({
                success : false,
                message : "ไม่พบข้อมูลสินค้าชิ้นนี้"
            })
        }

        res.status(200).json({
            success : true,
            message : "ส่งข้อมูลสำเร็จ",
            data : productId
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
}

const createProduct = async(req, res) => {
    try{
    const { name , price ,stock , category } = req.body
    if  ( typeof(price) === 'string'|| typeof(stock) === 'string'){
        return res.status(400).json({
            success : false,
            message : "กรุณาส่งข้อมูลเป็นตัวเลข"
        })
    }

    if(price < 0 || stock < 0){
        return res.status(400).json({
            success : false,
            message : "กรุณาใส่ค่าให้ถูกต้อง"
        })
    }

    const productItem = await Product.findOne({name : name})

    if(productItem){
        return res.status(400).json({
            success : false,
            message : "มีสินค้าชื่อนี้อยู่แล้ว"
        })
    }

        const newProduct = new Product({
            name ,
            price : Number(price),
            stock : Number(stock),
            category}
        )
        await newProduct.save()
        
        res.status(200).json({
            success : true,
            message : "สร้างสินค้าสำเร็จ",
            data : newProduct
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : "Server Error "
        })
        console.log(err)
    }
}

const updateProduct = async(req, res) => {
    try{
        const { name , price ,stock , category } = req.body
        const productId = req.params.id
        
        const id = await Product.findById(productId).exec()

        if(!id){
            return res.status(400).json({
                success : false ,
                message : "ไม่มีข้อมูลนี้ในระบบ"
            })
        }

        const updateItem= { name , price ,stock , category }

        if(name !== undefined) updateItem.name = name 
        if(price !== undefined) updateItem.price = price
        if(stock !== undefined) updateItem.stock = stock
        if(category !== undefined) updateItem.category = category

        const productItem = await Product.findByIdAndUpdate(productId ,updateItem, {new : true})
        
    res.status(200).json({
        success : true,
        message : "แก้ไขข้อมูลสำเร็จ",
        data : productItem
    })
    }catch(err){
        console.log(err)
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
}

const deleteProduct = async(req, res) => {
    try{
        const productId = req.params.id
        const deleteItem = await Product.findByIdAndDelete(productId).exec()

        if(!deleteItem){
            return res.status(400).json({
                success : false,
                message : "ไม่พบข้อมูล"
            })
        }

        res.status(200).json({
            success : true,
            message : "ลบช้อมูลสำเร็๋จ",
            data : deleteItem
        })

    }catch(err){
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
}

const deleteAll = async(req, res) => {
    try{
        const deleted = await Product.deleteMany({}).exec()
        res.status(200).json({
            success : true,
            message : "Delete All",
            data : deleted
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteAll,
    deleteProduct
}