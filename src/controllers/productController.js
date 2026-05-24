let productsInSystem = [
            {id : 1, name : "DIOR",price : 40_000 , stock: 10},
            {id : 2, name : "FANTA", price : 15, stock: 10},
            {id : 3, name : "COCA COLA" , price : 20, stock: 10}
        ]

let shoppingCart = [];

const getProducts = async(req, res) => {
    try{
        res.status(200).json({
            success : true,
            message : "ดึงข้อมูลสำเร็จ",
            data : productsInSystem
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            success : false,
            message : "Server Error",
        })
    }
}

const createProduct = (req, res) => {
    try{
    const { name , price } = req.body
    
    if(productsInSystem.find(p => p.name === name)){
        return res.status(400).json({
            success : false,
            message : "มีสินค้าชื่อนี้อยู่แล้ว"
        })
    }

    if(!name || !price){
       return res.status(400).json({
            success : false,
            message : "กรุณาใส่ข้อมูลให้ครบ"
        })}

        const newProduct = {
            id : productsInSystem.length > 0 ? productsInSystem[productsInSystem.length - 1].id + 1 : 1,
            name ,
            price : Number(price)
        }

        productsInSystem.push(newProduct)

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

const updateProduct = (req, res) => {
    try{
        const productId = Number(req.params.id)
        const { name , price } = req.body

        const productIndex = productsInSystem.findIndex(p => p.id === productId)

        if (productIndex === -1 ){
            return res.status(400).json({
                success : false,
                message : "ไม่พบข้อมูล"
            })
        
        }
    if(name) productsInSystem[productIndex].name = name
    if(price) productsInSystem[productIndex].price = Number(price)

    res.status(200).json({
        success : true,
        message : "แก้ไขข้อมูลสำเร็จ",
        data : productsInSystem[productIndex]
    })
    }catch(err){
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
}

const deleteProduct = (req, res) => {
    try{
        const productId = Number(req.params.id)
        const productExist = productsInSystem.find(p => p.id === productId)

        if(!productExist){
            return res.status(404).json({
                success : false,
                message : "ไม่พบสินค้า"
            })
        }
        productsInSystem = productsInSystem.filter(p => p.id !== productId)

        res.status(200).json({
            success : true,
            message : "ลบช้อมูลสำเร็๋จ",
            data : productsInSystem
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
}

const addCart = async(req, res) => {
    try{
        const {productId , quantity } = req.body
        
        if(!productId || !quantity
        ){
            return res.status(400).json({
                success : false,
                message : "กรุณากรอกข้อมูลให้ครบ"
            })
        }

        const productName = productsInSystem.find(p => p.id === productId)

        if(!productName){
            return res.status(400).json({
                success : false,
                message : "ไม่พบสินค้า"
            })
        }

        if(Number(quantity)>productName.stock){
            return res.status(400).json({
                success : false,
                message : "สินค้าหมดแล้ว",
                stock : productName.stock
            })
        }
        productName.stock -= Number(quantity)


        const shoppingItem = shoppingCart.find(p => p.id === productId)
        let totalPrice = productName.price * Number(quantity)

        const newShopping = {
            id : productName.id,
            name : productName.name,
            quantity : Number(quantity),
            totalPrice
        }
        
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
module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    addCart,
    getCart,
    deleteCart,
    clearCart
}