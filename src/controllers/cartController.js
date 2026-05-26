const Cart = require('../models/cartModel')
const Product = require ('../models/productModel')
const addCart = async(req, res) => {
    try{
        const {productId , quantity } = req.body
        
        quantity = Number(quantity)

        if(!productId || !quantity
        ){
            return res.status(400).json({
                success : false,
                message : "กรุณากรอกข้อมูลให้ครบ"
            })
        }
        const item = await Cart.findById(productId).exec()

        if(!item){
            return res.status(400).json({
                success : false,
                message : "ไม่พบสินค้า"
            })
        }

        const product = await Product.findByid(productId).exec()

        if(Number(quantity)>productStock.stock){
            return res.status(400).json({
                success : false,
                message : "สินค้าหมดไม่เพียงพอ",
                stock : product.stock
            })
        }
        product.stock -= quantity
        const totalPrice = product.total * quantity

        const itemCart = new Cart({
            name : product,
            quantity : quantity,
            totalPrice : totalPrice
        })
        
        await itemCart.save()
        
        // if(item._id==productId){
        //     item.quantity += quantity
        //     item.totalPrice = item.totalPrice + (priceItem * quantity)
        // 
        
        if(shoppingItem){
            shoppingItem.quantity =+ Number(quantity) 
            shoppingItem.totalPrice =+ totalPrice
            return res.status(200).json({
                success : true, 
                message : "เพิ่มข้อมูลสำเร็จ",
                data : shoppingCart
            })
        }

        shoppingCart.push(newShopping) 
        res.status(200).json({
            success : true,
            message : "เพิ้มในตะกร้าแล้ว",
            newdata : newShopping,
            data : shoppingCart,
            stock : productName.stock
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
        console.log(err)
    }
}

const getCart = (req, res) => {
    try{
        let grandPrice = 0
        for(let i=0; i<shoppingCart.length; i++){
            const item = shoppingCart[i]
            grandPrice = grandPrice + item.totalPrice
        }
        res.status(200).json({
            success : true,
            message : "ดึงข้อมูลสำเร็จ",
            data : shoppingCart ,
            price : grandPrice
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
}

const deleteCart = async(req, res) => {
    const productId = Number(req.params.id)
    
    const productDelete = shoppingCart.find(product => product.id === productId)

    if(!productDelete){
        return res.status(400).json({
            success : false,
            message : "ไม่พบข้อมูลสินค้า"
        })
    }

    if(productDelete.quantity > 1){
        productDelete.quantity-=1
        const productInfo = productsInSystem.find(p => p.id === productId)
        productDelete.totalPrice = productInfo.price * productDelete.quantity
        return res.status(200).json({
            success : true,
            message : "ลดสินค้าสำเร็จ",
            data : productDelete,
        })
    }else{
        shoppingCart = shoppingCart.filter(item => item.id !==productId)
        res.status(200).json({
            success : true,
            message : "ลบข้อมูลสำเร็จ",
            data : productDelete.name
        })
    }
} 

const clearCart = async(req, res) => {
    try{
        shoppingCart = []
        res.status(200).json({
            success : true,
            message : "ลบข้อมูลทั้งหมดสำเร็จ",
            data : shoppingCart
        })
    }catch(err){
        res.status(400).json({
            success : false,
            message : "Server Error"
        })
    }
}  
