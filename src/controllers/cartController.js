const Cart = require('../models/cartModel')
const Product = require ('../models/productModel')

const addCart = async(req, res) => {
    try{
    const {productId , quantity } = req.body
    const orderQuantity = Number(quantity);

    if(!productId || !quantity
    ){
        return res.status(400).json({
            success : false,
            message : "กรุณากรอกข้อมูลให้ครบ"
        })
    }

    const productItem = await Product.findById(productId).exec()
    
        if(!productItem){
            return res.status(400).json({
                success : false,
                message : "ไม่พบสินค้า"
            })
        }

        
        if(orderQuantity>productItem.stock){
            return res.status(400).json({
                success : false,
                message : "สินค้าหมดไม่เพียงพอ",
                stock : productItem.stock
            })
        } 
        
        productItem.stock -= orderQuantity
        await productItem.save()
        let totalPrice = productItem.price * orderQuantity
        
        const cartItem = await Cart.findOne({productId : productId}).exec()

        if(cartItem){
            cartItem.quantity += orderQuantity
            cartItem.totalPrice += totalPrice
            await cartItem.save()
            await cartItem.populate('productId','name')
            await productItem.save()
            return res.status(200).json({
                success : true,
                message : 
                "เพิ่มสินค้าสำเร็จ",
                data : cartItem,
                stock : productItem.stock
            })
        }

        const newItem = new Cart({
            productId : productItem._id,
            quantity : orderQuantity,
            totalPrice : totalPrice
        })

        await newItem.save()

        await newItem.populate('productId','name')
        
        const cart = await Cart.findById(newItem._id).populate('productId', 'name').exec()
        const cartAll = await Cart.find({}).populate('productId', 'name').exec()
        res.status(200).json({
            success : true,
            message : "เพิ่มในตะกร้าแล้ว",
            newdata : cart,
            cart : cartAll,
            stock : productItem.stock
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
        console.log(err)
    }
}

const getCart = async(req, res) => {
    try{
        const itemCart = await Cart.find({}).populate('productId', 'name').exec()
        let totalPrice = 0

        if(itemCart.length === 0){
            return res.status(404).json({
                success : false,
                message : "ไม่มีข้อมูลสินค้า"
            })
        }

        for(const item of itemCart){
            totalPrice += item.totalPrice
        }

        res.status(200).json({
            success : true,
            message : "ดึงข้อมูลสำเร็จ",
            data : itemCart ,
            totalPrice
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
}

const deleteCart = async(req, res) => {
    try {
        const id = req.params.id
        const deleteId = await Cart.findByIdAndDelete(id).exec()
        
        if(!deleteId){
            return res.status(400).json({
                success : false,
                message : "ไม่มีข้อมูลสินค้านี้"
            })
        }
        
        const quantity = deleteId.quantity
        const product = await Product.findById(deleteId.productId).exec()

        if(product){
            product.stock += quantity
            await product.save()
        }

        res.status(200).json({
            success : true,
            message : "ลบข้อมูลสำเร็จ",
            data : deleteId,
            product : product
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
} 

const clearCart = async(req, res) => {
    try{
        const cart = await Cart.find({}).exec()
        if(cart.length === 0){
            return res.status(404).json({
                success : false,
                message : "ไม่พบข้อมูล"
            })
        }
        
        for(const product of cart){
            const itemId = product.productId
            const productItem = await Product.findById(itemId).exec()
            productItem.stock += product.quantity
            await productItem.save()
        }
        
        await Cart.deleteMany({}).exec()

        res.status(200).json({
            success : true,
            message : "ลบข้อมูลทั้งหมดสำเร็จ",
            data : cart
        })
    }catch(err){
        console.log(err)
        res.status(400).json({
            success : false,
            message : "Server Error"
        })
    }
}  

module.exports = {addCart, getCart, deleteCart,clearCart}